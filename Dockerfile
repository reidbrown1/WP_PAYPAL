# syntax=docker/dockerfile:1

FROM node:12
WORKDIR /app
COPY . .
RUN npm install
CMD ["node", "src/index.js"]
EXPOSE 8080