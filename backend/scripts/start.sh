#!/bin/sh

echo "Waiting for PostgreSQL database..."
while ! nc -z postgres 5432; do
  sleep 1
done
echo "PostgreSQL is up and running!"

# Run migrations
echo "Running Prisma migrations..."
npx prisma migrate deploy

# Seed database
echo "Seeding database..."
node prisma/seed.js

# Start Express application server
echo "Starting production API server..."
node src/server.js
