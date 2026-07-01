# syntax=docker/dockerfile:1.7

FROM node:22-bookworm-slim AS builder

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates g++ make python3 \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm \
  npm ci

COPY . .
RUN npm run build

FROM node:22-bookworm-slim AS production

WORKDIR /app

ENV NODE_ENV=production \
  NITRO_HOST=0.0.0.0 \
  NITRO_PORT=5200 \
  PORT=5200

COPY --from=builder --chown=node:node /app/.output ./.output
COPY --from=builder --chown=node:node /app/config.toml ./config.toml
COPY --from=builder --chown=node:node /app/data ./data

RUN mkdir -p logs \
  && chown -R node:node /app

USER node

EXPOSE 5200

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:5200/ping').then((r) => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", ".output/server/index.mjs"]
