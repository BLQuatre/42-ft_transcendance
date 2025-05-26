NAME								=	transcendance

DOCKER_COMPOSE_CMD	=	docker-compose
DOCKER_COMPOSE_PATH	=	docker-compose.yml

ENV_FILE						=	.env

CERTS_PATH				=	proxy/certs
CERTS_KEY					=	$(CERTS_PATH)/localhost.key
CERTS_CRT					=	$(CERTS_PATH)/localhost.crt
CERTS_FILES				=	$(CERTS_KEY) $(CERTS_CRT)

all: up

up: ${ENV_FILE} ${CERTS_FILES}
	COMPOSE_BAKE=true $(DOCKER_COMPOSE_CMD) -p $(NAME) -f $(DOCKER_COMPOSE_PATH) up --build -d; \

down:
	$(DOCKER_COMPOSE_CMD) -p $(NAME) -f $(DOCKER_COMPOSE_PATH) down -v

stop:
	$(DOCKER_COMPOSE_CMD) -p $(NAME) -f $(DOCKER_COMPOSE_PATH) stop

start:
	$(DOCKER_COMPOSE_CMD) -p $(NAME) -f $(DOCKER_COMPOSE_PATH) start

restart:
	$(DOCKER_COMPOSE_CMD) -p $(NAME) -f $(DOCKER_COMPOSE_PATH) restart

re: down reload_certs up

reload_certs:
	@echo "Reloading certificates..."
	@rm -f ${CERTS_FILES}
	@$(MAKE) -s ${CERTS_FILES}
	@echo "Certificates reloaded successfully."

${CERTS_FILES}:
	@mkdir -p $(CERTS_PATH)
	@openssl req -x509 -newkey rsa:4096 -sha256 -days 365 -nodes \
		-keyout ${CERTS_KEY} -out ${CERTS_CRT} \
		-subj "/CN=localhost" \
		-addext "subjectAltName=DNS:localhost"

${ENV_FILE}:
	@chmod u+x generate-env.sh
	@./generate-env.sh --production
	@echo ".env file created successfully."
	@exit 1

del_images_none:
	for i in $$(docker images | grep "<none>" | awk '{print $$3}'); do docker rmi $$i; done

del_images:
	for i in $$(docker images | grep "$(NAME)-" | awk '{print $$3}'); do docker rmi $$i; done

del_node_modules:
	find . -type d -name "node_modules" -prune -exec rm -rf '{}' +

del_dist:
	find . -type d -name "dist" -prune -exec rm -rf '{}' +

.PHONY: all up down stop start restart re reload_certs del_images_none del_images del_node_modules del_dist
