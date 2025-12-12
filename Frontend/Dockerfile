FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./
# Use npm ci when a lockfile exists for reproducible installs; otherwise fall back to npm install
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

COPY . .
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}
RUN npm run build

FROM nginx:stable-alpine AS production

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
STOPSIGNAL SIGTERM
CMD [ "nginx", "-g", "daemon off;" ]