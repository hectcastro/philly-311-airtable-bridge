
FROM node:16-alpine
WORKDIR /app

deps:
    COPY package.json package-lock.json ./
    RUN npm ci
    SAVE ARTIFACT package-lock.json AS LOCAL ./package-lock.json

lint:
    FROM +deps
    COPY .eslintrc.js ./
    COPY src src
    RUN npm run lint

build:
    FROM +deps
    COPY tsconfig.json ./
    COPY src src
    RUN npm run build
    SAVE ARTIFACT dist /dist AS LOCAL dist

docker:
    FROM +deps
    COPY +build/dist ./dist
    ENTRYPOINT ["node", "./dist/tsc/cli.js"]
    SAVE IMAGE --push philly-311-airtable-bridge:latest

ci:
    BUILD +lint
    BUILD +build
