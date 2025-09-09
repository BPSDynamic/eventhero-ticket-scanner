# Multi-stage Dockerfile for Next.js (Node 20 on Alpine)

######## deps ########
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN sh -c "npm ci || npm install"

######## build ########
FROM node:20-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

######## prod-deps ########
FROM node:20-alpine AS prod-deps
WORKDIR /app
COPY package.json package-lock.json* ./
COPY --from=deps /app/node_modules ./node_modules
RUN npm prune --omit=dev || npm prune --production

######## runtime ########
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup -g 1001 -S nodejs \
	&& adduser -S nextjs -u 1001

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000
USER nextjs
CMD ["npm", "run", "start"]
