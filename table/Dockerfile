# =============================
# Base Image - Development
# =============================
FROM node:20-alpine AS deps

WORKDIR /app

# Cài dependencies để cache hiệu quả
COPY package.json package-lock.json* ./
RUN npm ci

# =============================
# Builder Image
# =============================
FROM node:20-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Tắt telemetry + build
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# =============================
# Production Image
# =============================
FROM node:20-alpine AS runner

WORKDIR /app

# Tạo user non-root
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Copy cần thiết
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

USER nextjs

EXPOSE 3000

CMD ["node_modules/.bin/next", "start"]