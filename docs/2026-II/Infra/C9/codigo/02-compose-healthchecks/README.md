# 02 · Healthchecks declarativos

Tres servicios encadenados con `depends_on: condition:`:

1. `db` arranca y reporta `healthy` cuando `pg_isready` responde.
2. `migrate` corre las migraciones y termina (`service_completed_successfully`).
3. `web` no arranca hasta que `db` está healthy y `migrate` terminó OK.

## Probar

```bash
docker compose up -d
docker compose ps
curl http://localhost:8080
```

Sin healthcheck declarativo, `web` arrancaría antes y fallaría con
"connection refused" hasta que la base aceptara conexiones.
