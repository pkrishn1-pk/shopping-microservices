#!/bin/bash

# Check if helm is installed
if ! command -v helm &> /dev/null
then
    echo "Helm could not be found. Please install it first: https://helm.sh/docs/intro/install/"
    exit 1
fi

# Install/Upgrade the chart
# Release name: shopping-app
# Chart path: ./charts/shopping-microservices
echo "Deploying shopping-microservices helm chart..."
helm upgrade --install shopping-app ./charts/shopping-microservices

echo "Deployment initiated. Check status with: kubectl get pods"
