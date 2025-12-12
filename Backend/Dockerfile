FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN mkdir -p src/Middlewares/uploads

ENV NODE_ENV=production
EXPOSE 8080

CMD [ "node", "src/index.js" ]