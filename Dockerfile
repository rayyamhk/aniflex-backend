FROM node:18.12-bullseye-slim

RUN apt-get update -qq && apt-get install -y ffmpeg

ENV NODE_ENV=production

WORKDIR /app
COPY package*.json .
RUN npm ci --omit=dev

COPY src ./src
COPY tsconfig.json .
RUN npm run build

EXPOSE 8080
CMD ["node", "dist/main"]