# 06 · Stack en Swarm

Dos servicios en un mismo `stack.yml`: `web`, con cuatro réplicas
restringidas a los workers, y `visualizer`, con una sola réplica en el
manager. La clave `deploy` es la que controla réplicas, recursos, política
de reinicio y ubicación, y un `compose.yml` plano la ignora.

## Levantar

```bash
docker stack deploy -c stack.yml demo
docker stack services demo
docker stack ps demo
```

## Probar

```bash
curl http://localhost:8080
xdg-open http://localhost:8081
```

## Bajar

```bash
docker stack rm demo
```
