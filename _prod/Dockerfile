ARG HTTP_IMAGE_VERSION=D-3
# =================================================
# -- PHASE 1 : generate website build
# =================================================
ARG NODE_BASE_VERSION=18.14.2-bullseye-slim
FROM harbor.shared.acrist-services.com/proxy-cache/node:$NODE_BASE_VERSION AS builder
WORKDIR /app
COPY package*.json ./
COPY .npmrc .npmrc
RUN npm ci
COPY . .
RUN npm run build

# =================================================
# -- PHASE 2 : copy build then serve on nginx
# =================================================
FROM nginx:1.27-alpine

EXPOSE 80
# Nginx conf is loaded from the config map in deployment
WORKDIR /usr/share/nginx/html

COPY _prod/nginx.conf /etc/nginx/nginx.conf
COPY _prod/default.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist/ .
