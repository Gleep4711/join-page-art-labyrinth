FROM node:14 AS build

WORKDIR /code
COPY *.json ./
COPY *.js ./
RUN npm install

COPY ./src ./src
COPY ./public ./public
RUN npm run build

FROM nginx:latest

COPY --from=build /code/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
