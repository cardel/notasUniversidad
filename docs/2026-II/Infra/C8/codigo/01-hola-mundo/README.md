# 01 — Hola mundo en Docker

Servicio Flask mínimo dentro de un contenedor.

## Construir

```bash
docker build -t hola-mundo .
```

## Ejecutar

```bash
docker run -d -p 8080:5000 --name hola hola-mundo
curl http://localhost:8080
```

## Limpiar

```bash
docker stop hola && docker rm hola
docker rmi hola-mundo
```
