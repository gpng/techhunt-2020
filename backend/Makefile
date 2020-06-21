# Docker parameters
DOCKERCMD=docker
DOCKERCOMPOSECMD=docker-compose

# Go parameters
GOCMD=go
GOBUILD=$(GOCMD) build
GOTEST=$(GOCMD) test

# App parameters
CONTAINER_TAG=techhunt
DOCKERFILE=Dockerfile.dev
MAIN_FOLDER=cmd/api
MAIN_PATH=$(MAIN_FOLDER)/main.go

default:
	@echo "=============building API============="
	$(DOCKERCMD) build -f $(DOCKERFILE) -t $(CONTAINER_TAG) .

up: default
	@echo "=============starting API locally============="
	$(DOCKERCOMPOSECMD) up -d

logs:
	$(DOCKERCOMPOSECMD) logs -f

dev: up logs

run:
	go build -o bin/application $(MAIN_PATH) && ./bin/application

down:
	$(DOCKERCOMPOSECMD) down

test:
	$(GOTEST) -cover ./...

test-v:
	$(GOTEST) -cover -v ./...

clean: down
	@echo "=============cleaning up============="
	$(DOCKERCMD) system prune -f
	$(DOCKERCMD) volume prune -f

run-prod:
	$(DOCKERCMD) build -t $(CONTAINER_TAG)-eb .
	docker run -p 4000:5000 $(CONTAINER_TAG)-eb

generate-docs:
	swag init -g $(MAIN_PATH)