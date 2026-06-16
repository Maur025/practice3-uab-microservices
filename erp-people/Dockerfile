FROM node:22-alpine

RUN apk add --no-cache wget

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

RUN chmod +x docker-entrypoint.sh

EXPOSE 7802

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget -qO- http://localhost:7802/health || exit 1

ENTRYPOINT ["./docker-entrypoint.sh"]
