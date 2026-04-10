import { FastifyPluginAsync } from "fastify";
import { UserRole } from "../../generated/prisma/index.js";
import { prisma } from "../../db/prisma.js";
import { generateOpaqueToken, hashPassword, hashToken, verifyPassword } from "../../utils/crypto.js";

const SESSION_TTL_DAYS = 30;

function getBearerToken(authorizationHeader?: string): string | null {
  if (!authorizationHeader) {
    return null;
  }

  const [type, token] = authorizationHeader.split(" ");

  if (type !== "Bearer" || !token) {
    return null;
  }

  return token;
}

function getSessionExpiry(): Date {
  const now = new Date();
  now.setDate(now.getDate() + SESSION_TTL_DAYS);
  return now;
}

export const authRoutes: FastifyPluginAsync = async (app) => {
  app.post(
    "/auth/register",
    {
      schema: {
        body: {
          type: "object",
          additionalProperties: false,
          required: ["email", "password", "role"],
          properties: {
            email: { type: "string", format: "email", maxLength: 255 },
            password: { type: "string", minLength: 8, maxLength: 72 },
            role: { type: "string", enum: ["CLIENTE", "ADMIN", "PROFISSIONAL"] }
          }
        }
      }
    },
    async (request, reply) => {
      const { email, password, role } = request.body as {
        email: string;
        password: string;
        role: UserRole;
      };

      const existingUser = await prisma.user.findUnique({ where: { email } });

      if (existingUser) {
        throw app.httpErrors.conflict("Email already in use");
      }

      const user = await prisma.user.create({
        data: {
          email,
          passwordHash: hashPassword(password),
          role
        }
      });

      reply.status(201).send({
        id: user.id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      });
    }
  );

  app.post(
    "/auth/login",
    {
      schema: {
        body: {
          type: "object",
          additionalProperties: false,
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email", maxLength: 255 },
            password: { type: "string", minLength: 8, maxLength: 72 }
          }
        }
      }
    },
    async (request) => {
      const { email, password } = request.body as { email: string; password: string };

      const user = await prisma.user.findUnique({ where: { email } });

      if (!user || !verifyPassword(password, user.passwordHash) || !user.isActive) {
        throw app.httpErrors.unauthorized("Invalid credentials");
      }

      const token = generateOpaqueToken();
      const tokenHash = hashToken(token);

      const session = await prisma.session.create({
        data: {
          userId: user.id,
          tokenHash,
          expiresAt: getSessionExpiry(),
          ip: request.ip
        }
      });

      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() }
      });

      return {
        accessToken: token,
        tokenType: "Bearer",
        expiresAt: session.expiresAt
      };
    }
  );

  app.get("/auth/me", async (request) => {
    const token = getBearerToken(request.headers.authorization);

    if (!token) {
      throw app.httpErrors.unauthorized("Missing bearer token");
    }

    const tokenHash = hashToken(token);

    const session = await prisma.session.findFirst({
      where: {
        tokenHash,
        revokedAt: null,
        expiresAt: { gt: new Date() }
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
            lastLoginAt: true
          }
        }
      }
    });

    if (!session || !session.user.isActive) {
      throw app.httpErrors.unauthorized("Invalid session");
    }

    return { user: session.user };
  });
};
