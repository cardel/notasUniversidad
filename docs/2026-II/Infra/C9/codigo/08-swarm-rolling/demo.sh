#!/usr/bin/env bash
# Demuestra rolling update y rollback.

set -e

docker info | grep -q 'Swarm: active' || docker swarm init --advertise-addr 127.0.0.1

# Versión inicial
docker stack deploy -c stack.v1.yml rolling
echo "=== Estado inicial ==="
docker stack services rolling
docker stack ps rolling --no-trunc | head -8

# Esperar a que se estabilice
sleep 5

# Actualizar a v2 (cambia la imagen). El parallelism: 2 reemplaza 2 réplicas
# a la vez con delay 5s entre lotes.
echo
echo "=== Iniciando rolling update a v2 ==="
docker stack deploy -c stack.v2.yml rolling

# Observar el avance del update
sleep 10
docker stack services rolling

# Forzar rollback manual
echo
echo "=== Rollback manual a la version anterior ==="
docker service rollback rolling_web

docker stack rm rolling
