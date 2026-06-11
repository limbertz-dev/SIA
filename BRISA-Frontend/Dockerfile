FROM node:20-alpine AS builder
WORKDIR /app

ARG VITE_API_URL
ARG PUBLIC_API_URL

ENV VITE_API_URL=$VITE_API_URL
ENV PUBLIC_API_URL=$PUBLIC_API_URL

COPY package.json ./
RUN npm install

COPY . .

RUN npm run build

FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/start.mjs ./start.mjs

EXPOSE 5173

CMD ["node", "start.mjs"]
