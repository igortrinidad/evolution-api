#!/bin/bash

if [ "$(docker ps -a -q)" ]; then
  echo "Stopping and removing all docker containers..."
  docker stop $(docker ps -a -q)
  docker rm $(docker ps -a -q)
fi

pwd
echo "Starting docker containers on folder..."

source ./docker/scripts/env_functions.sh

if [ "$DOCKER_ENV" != "true" ]; then
    export_env_vars
fi

docker compose up --build -d

sleep 5