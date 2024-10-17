#!/bin/bash

echo "Starting docker containers on folder..."
pwd

source ./docker/scripts/env_functions.sh

if [ "$DOCKER_ENV" != "true" ]; then
    export_env_vars
fi

docker compose up --build -d

sleep 5