FROM node:22-alpine3.21 AS builder

WORKDIR /app
COPY package.json ./
RUN npm install
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM node:22-alpine3.21

WORKDIR /app
COPY --from=builder /app/package.json ./
COPY --from=builder /app/dist ./dist
RUN npm install --omit=dev

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "dist/server.js"]
