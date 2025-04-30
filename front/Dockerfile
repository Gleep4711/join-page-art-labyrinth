FROM node:22-bookworm-slim AS build

WORKDIR /code
COPY *.json ./
COPY *.js ./
RUN npm install

COPY ./src ./src
COPY ./public ./public
RUN npm run build

FROM openresty/openresty

COPY --from=build /code/build /usr/share/nginx/html
COPY nginx.conf /usr/local/openresty/nginx/conf/nginx.conf
