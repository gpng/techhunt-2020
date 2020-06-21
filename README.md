# TechHunt 2020 Take Home Assessment

HR Employee Salary Management MVP

## Table of Contents

- [Description](#description)
- [Usage](#usage)

## Description

### Frontend

- Written in ReactJS, using NextJS.

- Global app state is managed using React Context, by dispatching actions to reducers, and using useContext hooks to read state.

- Tests are written and run using Jest and React-Testing-Library

### Backend

- API server is written in Go, run in a Docker container, both locally and in production. Dockerfiles for dev (Dockerfile.dev) and production is provided.

- Database uses PostgreSQL (RDBMS) and is run in Docker container

- Docker Compose for running both Go and DB containers

## Usage

1. Clone this repo

2. Setup and run backend

   `cd backend` and follow backend-specific README

3. Setup and run frontend

   `cd frontend` and follow backend-specific README
