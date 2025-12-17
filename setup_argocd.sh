#!/bin/bash

echo "[1/4] Creating ArgoCD namespace..."
kubectl create namespace argocd || true

echo "[2/4] Installing ArgoCD (Stable)..."
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

echo "[3/4] Waiting for ArgoCD server to be ready (this may take a minute)..."
kubectl wait --for=condition=available --timeout=300s deployment/argocd-server -n argocd

echo "[4/4] Applying Project Shopping Application..."
kubectl apply -f argocd/application.yaml

echo "------------------------------------------------"
echo "ArgoCD Installed Successfully!"
echo "To access the UI:"
echo "1. Run: kubectl port-forward svc/argocd-server -n argocd 8080:443"
echo "2. Open: https://localhost:8080"
echo "3. Username: admin"
echo "4. Password: (Run command below to get it)"
echo "   kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath=\"{.data.password}\" | base64 -d; echo"
echo "------------------------------------------------"
