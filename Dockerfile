# Step 1: Build React app
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build  # tạo thư mục dist/

# Stage 2: Copy to volume-mount
FROM alpine AS export
WORKDIR /export
COPY --from=build /app/dist ./