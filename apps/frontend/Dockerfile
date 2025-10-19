# 1. Build Stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json ./
COPY apps/frontend/package.json ./apps/frontend/
# Install hanya dependensi frontend
RUN npm install --workspace=apps/frontend

COPY . .

WORKDIR /app/apps/frontend
# Build Next.js
RUN npm run build

# 2. Production Stage (menggunakan output standalone)
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/apps/frontend/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/apps/frontend/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/frontend/.next/static ./.next/static

# Jalankan server.js dari output standalone
CMD ["node", "server.js"]