# Step 1: Build React app
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build  # tạo thư mục dist/

# --- Production stage ---
FROM nginx:stable-alpine

# Copy custom nginx config
COPY /root/logibase-be/src/main/docker/nginxnginx.conf /etc/nginx/conf.d/default.conf

# Copy build from React
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]