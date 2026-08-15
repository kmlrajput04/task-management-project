FROM node:20-alpine

WORKDIR /app

# Install system dependencies (openssl is required for Prisma engines)
RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma/

# Install only production dependencies
RUN npm ci --omit=dev

COPY . .

# Grant execute rights on POSIX startup script
RUN chmod +x scripts/start.sh

# Generate Prisma Client node_modules target
RUN npx prisma generate

EXPOSE 5000

ENV NODE_ENV=production

CMD ["/bin/sh", "scripts/start.sh"]
