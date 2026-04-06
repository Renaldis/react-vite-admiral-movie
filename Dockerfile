FROM node:20.12.1-alpine

WORKDIR /app

RUN apk add git
RUN npm install -g pnpm@8.14.1
RUN npm -g install serve
RUN corepack enable

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN pnpm install

COPY . .

RUN pnpm lint
RUN pnpm build

ENV PORT=8080
EXPOSE 8080

CMD ["serve", "-s", "dist"]