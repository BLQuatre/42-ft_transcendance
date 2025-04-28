NAME				=	transcendance

DOCKER_COMPOSE_CMD	=	docker-compose
DOCKER_COMPOSE_PATH	=	docker-compose.yml

all: up

up:
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

re: down all

del_images_none:
	for i in $$(docker images | grep "<none>" | awk '{print $$3}'); do docker rmi $$i; done

del_images:
	for i in $$(docker images | grep "$(NAME)-" | awk '{print $$3}'); do docker rmi $$i; done

.PHONY: all up down stop start restart re test del_images_none del_images
