FROM node:22.14.0 AS builder

ARG COMPILE_DIR=/src

WORKDIR ${COMPILE_DIR}

# Install Angular CLI
RUN npm install -g @angular/cli

# Copy srcs into container
COPY angular.json .
COPY package.json .
COPY package-lock.json .
COPY tsconfig.app.json .
COPY tsconfig.spec.json .
COPY tsconfig.json .
COPY public public
COPY src src

# Install the packages from package.json -> node_modules
RUN npm ci 

# Build angular application -> dist/day32-ws/browser
RUN ng build

# Second stage

# Copy Angular to Caddy
FROM caddy:2.9.1

LABEL maintainer="calvinmilner"

ARG WORK_DIR=/webapp

WORKDIR ${WORK_DIR}

# Copy the Angular artifacts and Caddyfile
COPY --from=builder /src/dist/day32-ws/browser browser
COPY Caddyfile .

ENV SERVER_PORT=8080

EXPOSE ${SERVER_PORT}

# To remove off JSONArguments
SHELL [ "/bin/sh", "-c"]

# RUN used for build, ENTRYPOINT used for execution
ENTRYPOINT caddy run --config ./Caddyfile

# CMD [ "caddy", "run", "--config", "/webapp/Caddyfile" ]