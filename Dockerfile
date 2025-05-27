# Step 1: Build React app
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
COPY . .
RUN npm install && npm run build

# Stage 2: Copy to volume-mount
FROM scratch AS export
COPY --from=build /app/dist /export/