# 01 · Compose básico

Tres servicios (`web`, `db`, `cache`) declarados en `compose.yml`. La
aplicación web escribe un contador en Redis y verifica el estado de
PostgreSQL.

## Levantar

```bash
docker compose up -d --build
curl http://localhost:8080
docker compose logs -f web
```

## Parar y limpiar

```bash
docker compose down            # mantiene volúmenes
docker compose down -v         # también borra el volumen pgdata
```
