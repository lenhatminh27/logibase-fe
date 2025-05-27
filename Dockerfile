# Stage 1: Build
FROM node:18-alpine as builder

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Xoá config mặc định
RUN rm -rf /etc/nginx/conf.d/default.conf

# Copy file build vào nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf