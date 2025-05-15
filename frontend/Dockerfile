FROM node:22-alpine3.21 AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install

COPY . .
RUN pnpm build

FROM node:22-alpine3.21

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --prod

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

ENV NODE_ENV=production

CMD ["pnpm", "start"]
