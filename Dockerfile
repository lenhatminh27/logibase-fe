# Step 1: Build React app với Node
FROM node:18-alpine AS build

WORKDIR /app

# Copy package.json & package-lock.json (hoặc yarn.lock)
COPY package*.json ./

# Cài dependencies
RUN npm install

# Copy toàn bộ source code
COPY . .

# Build app với biến môi trường nếu cần (ví dụ dùng .env.prod)
RUN npm run build

# Step 2: Serve build output bằng Nginx
FROM nginx:alpine

# Xóa config nginx default
RUN rm /etc/nginx/conf.d/default.conf

# Copy file config nginx custom vào container
COPY nginx.conf /etc/nginx/conf.d/

# Copy thư mục build từ stage build vào thư mục serve của nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Chạy nginx foreground
CMD ["nginx", "-g", "daemon off;"]