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
