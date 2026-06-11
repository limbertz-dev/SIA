FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .
ARG VITE_API_URL
ARG PUBLIC_API_URL
ENV VITE_API_URL=$VITE_API_URL
ENV PUBLIC_API_URL=$PUBLIC_API_URL
RUN npm run build

FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 5173
ENV NODE_ENV=production

CMD ["node", "build/index.js"]
