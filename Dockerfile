FROM node:22.14.0 AS builder

LABEL maintainer="calvinmilner"

ARG COMPILE_DIR=/compiledir

# Build the application
WORKDIR ${COMPILE_DIR}

# Inside of /app
# Copy files over src dst
RUN npm install -g @angular/cli

COPY . .

RUN npm install 
RUN npm run build

# Second stage
FROM caddy:2.9.1

ARG WORK_DIR=/compiledir

WORKDIR ${WORK_DIR}

COPY --from=builder /compiledir/dist/day32-ws/browser /webapp
COPY Caddyfile /webapp

ENV SERVER_PORT=8080

EXPOSE ${SERVER_PORT}

CMD [ "caddy", "run", "--config", "/webapp/Caddyfile" ]