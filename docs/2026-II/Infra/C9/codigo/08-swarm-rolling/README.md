# 08 · Rolling update y rollback

Despliega 6 réplicas, las actualiza por lotes de 2 con 5 s de espera y
revierte automáticamente si falla más del 34 % del lote.

## Probar

```bash
bash demo.sh
```

## Claves del `update_config`

- `parallelism`: cuántas réplicas se actualizan a la vez.
- `delay`: tiempo entre lotes.
- `order: start-first`: arranca la nueva antes de matar la vieja
  (cero downtime; alternativa: `stop-first`).
- `failure_action: rollback`: vuelve atrás automáticamente.
- `monitor`: ventana de observación tras actualizar para detectar fallo.
