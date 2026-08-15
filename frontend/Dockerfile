# Stage 1: Build React static assets
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Serve relative path to let Nginx proxy API calls
ENV VITE_API_URL=/api

RUN npm run build

# Stage 2: Serve compiled HTML assets with Nginx
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
