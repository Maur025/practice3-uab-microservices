FROM node:22-alpine

RUN apk add --no-cache wget

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

EXPOSE 7800

HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
  CMD wget -qO- http://localhost:7800/api/health || exit 1

CMD ["npm", "start"]
