#!/usr/bin/env bash
# Inicializa un cluster Swarm de un solo nodo (manager).

set -e

# Inicializar el swarm. La dirección de aviso (--advertise-addr) la
# usan otros nodos para unirse.
docker swarm init --advertise-addr 127.0.0.1 || true

# Imprimir el token para añadir workers / managers.
echo
echo "=== Token para workers ==="
docker swarm join-token worker
echo
echo "=== Token para managers ==="
docker swarm join-token manager

# Listar nodos del cluster.
echo
echo "=== Nodos en el cluster ==="
docker node ls

# Para abandonar el swarm:
# docker swarm leave --force
