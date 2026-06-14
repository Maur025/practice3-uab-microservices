#!/bin/bash
set -e

echo "Building Docker image for Minikube..."
# eval $(minikube docker-env)

cd erp-gateway/
docker build -t gateway-service .

cd ..

cd erp-people/
docker build -t people-service .

cd ..

cd erp-inventory/
docker build -t inventory-service .

cd ..

cd erp-payment/
docker build -t payment-service .

cd ..

cd erp-purchase/
docker build -t purchase-service .

cd ..

cd erp-sale/
docker build -t sale-service .

echo "Docker images built successfully for Minikube."