FROM nginx:1.28.0-alpine3.21-perl

COPY conf/nginx.conf /etc/nginx/nginx.conf
COPY certs /etc/nginx/certs

CMD [ "nginx", "-g", "daemon off;" ]
