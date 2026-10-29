# Giai đoạn 1: build React
FROM node:22-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Giai đoạn 2: nginx phục vụ file tĩnh và chuyển tiếp /api/ sang backend
FROM nginx:alpine
ENV PORT=80 BACKEND_URL=http://host.docker.internal:5000
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
