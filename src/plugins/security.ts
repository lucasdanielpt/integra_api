import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import sensible from "@fastify/sensible";
import { FastifyInstance } from "fastify";

export async function registerSecurityPlugins(app: FastifyInstance): Promise<void> {
  await app.register(sensible);

  await app.register(helmet, {
    contentSecurityPolicy: false
  });

  await app.register(cors, {
    origin: true,
    credentials: true
  });

  await app.register(rateLimit, {
    max: 100,
    timeWindow: "1 minute"
  });
}
