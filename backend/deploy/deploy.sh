#!/bin/sh

set -e

IMAGE_NAME=us-central1-docker.pkg.dev/after-432118/aftr-images/after-webserver

docker build -t after .
docker tag after $IMAGE_NAME
docker push $IMAGE_NAME

