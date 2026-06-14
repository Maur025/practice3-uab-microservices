FROM node:24.16.0-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile
COPY . .

FROM node:24.16.0-alpine AS runner
WORKDIR /app

COPY --from=base /app/package.json ./
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/src ./src

EXPOSE 7805

ENV NODE_ENV=production

CMD ["node","src/index.js"]