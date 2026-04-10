import { FastifyPluginAsync } from "fastify";

export const healthRoutes: FastifyPluginAsync = async (app) => {
  app.get(
    "/health",
    {
      schema: {
        response: {
          200: {
            type: "object",
            additionalProperties: false,
            required: ["status", "timestamp"],
            properties: {
              status: { type: "string" },
              timestamp: { type: "string" }
            }
          }
        }
      }
    },
    async () => {
      return {
        status: "ok",
        timestamp: new Date().toISOString()
      };
    }
  );
};
