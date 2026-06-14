#!/bin/bash
set -e

echo "Building Docker image for Minikube..."
eval $(minikube docker-env)

cd erp-gateway/
docker build -t gateway-service .

cd ..
cd erp-people/

docker build -t people-service .

echo "Docker images built successfully for Minikube."