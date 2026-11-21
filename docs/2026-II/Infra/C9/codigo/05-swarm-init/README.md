# 05 · Inicialización de Swarm

Arranca un clúster de un solo nodo, que queda como manager y como líder.
El guion imprime además los dos tokens de unión, el de worker y el de
manager, que son lo que hace falta para sumar más nodos al clúster.

## Probar

```bash
bash demo.sh
```

## Salir del clúster

```bash
docker swarm leave --force
```
