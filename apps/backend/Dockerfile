# 1. Build Stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json ./
COPY apps/backend/package.json ./apps/backend/
# Install hanya dependensi backend
RUN npm install --workspace=apps/backend

COPY . .

WORKDIR /app/apps/backend
# Generate Prisma Client
RUN npx prisma generate
# Build TypeScript
RUN npm run build

# 2. Production Stage
FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/apps/backend/package.json ./apps/backend/
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/prisma ./apps/backend/prisma

WORKDIR /app/apps/backend
ENV NODE_ENV=production
CMD ["node", "dist/index.js"]