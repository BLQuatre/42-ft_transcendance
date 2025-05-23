#!/bin/sh

# envsubst '${GATEWAY_HOST} ${GATEWAY_PORT} ${FRONTEND_HOST} ${FRONTEND_PORT}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# TMP
envsubst '${GATEWAY_HOST} ${GATEWAY_PORT} ${FRONTEND_HOST} ${FRONTEND_PORT} ${DINO_HOST} ${DINO_PORT} ${PONG_HOST} ${PONG_PORT}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

exec "$@"
