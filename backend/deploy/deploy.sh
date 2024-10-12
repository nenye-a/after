#!/bin/sh

set -e

IMAGE_NAME=us-central1-docker.pkg.dev/after-432118/aftr-images/after-webserver

# As authorized user, call this
gcloud auth print-access-token \                                                                                                                                                                               [09/23/24|11:50:48PM]
    --impersonate-service-account after-webserver@after-432118.iam.gserviceaccount.com | docker login \
    -u oauth2accesstoken \
    --password-stdin https://us-central1-docker.pkg.dev

docker build -t after .
docker tag after $IMAGE_NAME
docker push $IMAGE_NAME

