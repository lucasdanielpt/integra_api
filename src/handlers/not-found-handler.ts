import { FastifyInstance } from "fastify";

export function registerNotFoundHandler(app: FastifyInstance): void {
  app.setNotFoundHandler((request, reply) => {
    reply.status(404).send({
      success: false,
      error: {
        code: "NOT_FOUND",
        message: "Resource not found"
      },
      meta: {
        requestId: request.id,
        method: request.method,
        path: request.url,
        timestamp: new Date().toISOString()
      }
    });
  });
}
