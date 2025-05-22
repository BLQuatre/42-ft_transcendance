FROM nginx:1.28.0-alpine3.21-perl

COPY conf/nginx.conf /etc/nginx/nginx.conf.template
COPY certs /etc/nginx/certs

COPY tools/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT [ "/entrypoint.sh" ]
CMD [ "nginx", "-g", "daemon off;" ]
