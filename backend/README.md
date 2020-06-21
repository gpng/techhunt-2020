# TechHunt 2020 Take Home Assessment - Backend

- API server is written in Go, run in a Docker container, both locally and in production. Dockerfiles for dev (Dockerfile.dev) and production is provided.

- Database uses PostgreSQL (RDBMS) and is run in Docker container

- Docker Compose for running both Go and DB containers

## Table of Contents

- [Setup](#setup)
- [Usage](#usage)
- [Test](#test)

## Setup

1. Install [Go](https://golang.org/dl/) and [Docker](https://www.docker.com/get-started)

2. Create your own .env using .sample.env. You should be able to directly use the contents of .sample.env as .env

   Use `DB_NAME=techhunt-dev` as in .sample.env for automatically created db in docker-compose, otherwise you have to access the postgres instance to create your own db.

## Usage

1. Start docker containers

   ```
   make dev
   ```

**NOTE:** On linux, depending on your installation process of Docker, there might be permission issues with the db container accessing the db-data folder. Either fix the permission issues or use `sudo`

2. View logs

   ```
   make logs
   ```

3. Visit `localhost:4000/docs` for documentation if `DOCS=true` in .env

4. Stop docker containers

   ```
   make down
   ```

## Test

`make test` or `make test-v` for verbose
