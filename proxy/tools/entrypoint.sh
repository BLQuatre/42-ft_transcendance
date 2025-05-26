#!/bin/sh

# envsubst '${GATEWAY_HOST} ${GATEWAY_PORT} ${FRONTEND_HOST} ${FRONTEND_PORT}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# TMP
envsubst '${GATEWAY_HOST} ${GATEWAY_PORT} ${FRONTEND_HOST} ${FRONTEND_PORT} ${MAIN_PORT} ${MAIN_HOST}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

exec "$@"
