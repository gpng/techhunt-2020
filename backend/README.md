# TechHunt 2020 Take Home Assessment - Backend

HR Employee Salary Management API

## Table of Contents

- [Usage](#usage)
- [Maintainers](#maintainers)

## Setup

1. Install [Go](https://golang.org/dl/) and [Docker](https://www.docker.com/get-started)

2. Create your own .env using .sample.env

## Usage

1. Start docker containers

   ```
   make up
   ```

2. View logs

   ```
   make logs
   ```

3. Visit `localhost:4000/some` to check if API is responding

4. Visit `localhost:4000/docs` for documentation if `DOCS=true` in .env

5. Stop docker containers

   ```
   make down
   ```

## Test

```
make test
```

## Maintainers

[@gpng](https://github.com/gpng)
