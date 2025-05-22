NAME				=	transcendance

DOCKER_COMPOSE_CMD	=	docker-compose
DOCKER_COMPOSE_PATH	=	docker-compose.yml

all: up

up:
	@if [ ! -d "proxy/certs" ]; then \
		make cert; \
	fi

	@if [ -f ".env" ]; then \
		COMPOSE_BAKE=true $(DOCKER_COMPOSE_CMD) -p $(NAME) -f $(DOCKER_COMPOSE_PATH) up --build -d; \
	else \
		echo "No .env file found in srcs folder, please create one before running make"; \
	fi

down:
	$(DOCKER_COMPOSE_CMD) -p $(NAME) -f $(DOCKER_COMPOSE_PATH) down -v

stop:
	$(DOCKER_COMPOSE_CMD) -p $(NAME) -f $(DOCKER_COMPOSE_PATH) stop

start:
	$(DOCKER_COMPOSE_CMD) -p $(NAME) -f $(DOCKER_COMPOSE_PATH) start

restart:
	$(DOCKER_COMPOSE_CMD) -p $(NAME) -f $(DOCKER_COMPOSE_PATH) restart

re: down cert all

cert:
	mkdir -p proxy/certs
	openssl req -x509 -newkey rsa:4096 -sha256 -days 365 -nodes \
		-keyout proxy/certs/localhost.key -out proxy/certs/localhost.crt \
		-subj "/CN=localhost" \
		-addext "subjectAltName=DNS:localhost"

del_images_none:
	for i in $$(docker images | grep "<none>" | awk '{print $$3}'); do docker rmi $$i; done

del_images:
	for i in $$(docker images | grep "$(NAME)-" | awk '{print $$3}'); do docker rmi $$i; done

del_node_modules:
	find . -type d -name "node_modules" -prune -exec rm -rf '{}' +

del_dist:
	find . -type d -name "dist" -prune -exec rm -rf '{}' +

del_users:
	docker exec -it $(NAME)-postgres-1 psql -U test -d $(NAME) -c 'TRUNCATE TABLE "user" RESTART IDENTITY;'

show_users:
	docker exec -it $(NAME)-postgres-1 psql -U test -d $(NAME) -c 'SELECT * FROM "user";'

.PHONY: all up down stop start restart re test del_images_none del_images del_node_modules del_dist del_users show_users
