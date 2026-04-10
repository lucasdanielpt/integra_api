import { FastifyServerOptions } from "fastify";

export const validationConfig: FastifyServerOptions["ajv"] = {
  customOptions: {
    coerceTypes: true,
    removeAdditional: "all",
    useDefaults: true,
    allErrors: true
  }
};
