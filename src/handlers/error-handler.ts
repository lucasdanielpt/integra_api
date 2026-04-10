import { FastifyError, FastifyInstance } from "fastify";

type ValidationIssue = { instancePath?: string; message?: string };
type ErrorWithValidation = FastifyError & {
  validation?: ValidationIssue[];
};

export function registerErrorHandler(app: FastifyInstance): void {
  app.setErrorHandler((error, request, reply) => {
    const appError = error as ErrorWithValidation;
    const isValidationError = Array.isArray(appError.validation);
    const statusCode = isValidationError ? 400 : appError.statusCode ?? 500;
    const code = isValidationError
      ? "VALIDATION_ERROR"
      : statusCode >= 500
        ? "INTERNAL_SERVER_ERROR"
        : "REQUEST_ERROR";

    const details = isValidationError
      ? appError.validation?.map((issue) => ({
          field: issue.instancePath || "request",
          message: issue.message ?? "Invalid value"
        }))
      : undefined;

    if (statusCode >= 500) {
      request.log.error(error);
    } else {
      request.log.warn({ err: error }, appError.message);
    }

    reply.status(statusCode).send({
      success: false,
      error: {
        code,
        message: statusCode >= 500 ? "Unexpected internal server error" : appError.message,
        details
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
