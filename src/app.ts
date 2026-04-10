import Fastify, { FastifyInstance } from "fastify";
import { env } from "./config/env.js";
import { validationConfig } from "./config/validation.js";
import { registerErrorHandler } from "./handlers/error-handler.js";
import { registerNotFoundHandler } from "./handlers/not-found-handler.js";
import { registerSecurityPlugins } from "./plugins/security.js";
import { authRoutes } from "./routes/auth/auth.js";
import { healthRoutes } from "./routes/health.js";

export function buildApp(): FastifyInstance {
  const app = Fastify({
    logger: env.NODE_ENV !== "test",
    ajv: validationConfig
  });

  app.register(async (instance) => {
    await registerSecurityPlugins(instance);
  });

  registerErrorHandler(app);
  registerNotFoundHandler(app);

  app.register(healthRoutes, { prefix: env.API_PREFIX });
  app.register(authRoutes, { prefix: env.API_PREFIX });

  return app;
}
