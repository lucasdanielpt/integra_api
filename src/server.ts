import { buildApp } from "./app.js";
import { env } from "./config/env.js";

const MAX_PORT_RETRIES = 10;

async function start(): Promise<void> {
  const app = buildApp();
  const port = env.PORT;

  for (let attempt = 0; attempt <= MAX_PORT_RETRIES; attempt += 1) {
    try {
      await app.listen({ port, host: env.HOST });
      app.log.info(`Server listening on ${env.HOST}:${port}`);
      return;
    } catch (error) {
      console.log(error);
    }
  }
}

void start();
