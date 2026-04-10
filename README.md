# Integra API

Base project for a REST API using Node.js, Fastify, TypeScript, PostgreSQL, and Redis.

## Tech stack

- Fastify
- TypeScript
- PostgreSQL (to be integrated with Prisma/Drizzle in next steps)
- Redis (refresh/session/rate-limit scenarios)

## Getting started

1. Copy environment file:

```bash
cp .env.example .env
```

2. Install dependencies:

```bash
pnpm install
```

3. Run development server:

```bash
pnpm dev
```

API base path: `/api/v1`

Healthcheck endpoint: `GET /api/v1/health`
