FROM node:20-alpine AS builder

RUN apk --no-cache --update --virtual build-dependencies add \
    python3 \
    make \
    g++

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build