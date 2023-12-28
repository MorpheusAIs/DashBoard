FROM node:16-alpine as builder
RUN apk --no-cache --update --virtual build-dependencies add \
    python \
    make \
    g++

ARG BUILD_VERSION
WORKDIR /build
COPY package*.json ./
COPY yarn*.lock ./
RUN true \
 && yarn autoclean --init \
 && yarn autoclean --force \
 && yarn install \
 && true
COPY . .
RUN yarn lint | tee 1.log | sed -e 's/^/[yarn lint] /' & yarn test | tee 2.log | sed -e 's/^/[yarn test] /' & VITE_BUILD_VERSION="$BUILD_VERSION" yarn build | tee 3.log | sed -e 's/^/[yarn build] /'

FROM nginx:1.20.2-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /build/dist /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
