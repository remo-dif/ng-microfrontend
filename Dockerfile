FROM node:22-alpine AS build
WORKDIR /workspace
COPY package*.json ./
RUN npm ci
COPY . .
ARG APP=shell
RUN npx nx run ${APP}:federation-build

FROM nginx:1.27-alpine
ARG OUTPUT_PATH=dist/apps/shell/browser
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /workspace/${OUTPUT_PATH}/ /usr/share/nginx/html/
EXPOSE 8080
HEALTHCHECK CMD wget -q -O /dev/null http://localhost:8080/ || exit 1
