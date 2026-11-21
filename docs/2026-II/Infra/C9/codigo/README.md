# Código de la sesión

Los cinco ejemplos que se levantaron en clase. La numeración es la del material
completo del tema, de modo que salta: los que faltan son perfiles, secretos y
redes overlay, que quedaron para leer por cuenta propia.

| Carpeta | Qué muestra |
|---|---|
| `01-compose-basico` | Los tres servicios, `web`, `db` y `cache`, en un solo `compose.yml`, con su red y el volumen de la base |
| `02-compose-healthchecks` | `depends_on` con condición: `service_healthy` para la base y `service_completed_successfully` para la migración |
| `05-swarm-init` | El clúster de un nodo y los dos tokens de unión |
| `06-swarm-stack` | `docker stack deploy` con `deploy.replicas`, límites de recursos y restricción de ubicación |
| `08-swarm-rolling` | La actualización progresiva por lotes y la vuelta a la versión anterior |

Conviene partir de un Docker sin nada corriendo:

```bash
docker stack ls -q | xargs -r docker stack rm
docker compose ls --format '{{.Name}}' | xargs -r -I{} docker compose -p {} down
```

## Los tres servicios

```bash
cd 01-compose-basico
docker compose up -d --build
docker compose ps --format 'table {{.Service}}\t{{.Status}}\t{{.Ports}}'
```

```
SERVICE   STATUS          PORTS
cache     Up 14 seconds   6379/tcp
db        Up 14 seconds   5432/tcp
web       Up 14 seconds   0.0.0.0:8080->5000/tcp, [::]:8080->5000/tcp
```

```bash
curl -s localhost:8080
curl -s localhost:8080
```

```
{"db_ok":true,"visitas":1}
{"db_ok":true,"visitas":2}
```

El contador sube porque `web` encontró a `cache` por su nombre de servicio, y
`db_ok` en verdadero porque el `SELECT 1` llegó a PostgreSQL. La base y la
caché aparecen con su puerto sin dirección delante: se alcanzan dentro de la
red del proyecto y no desde el anfitrión.

## La cadena de dependencias

```bash
cd 02-compose-healthchecks
docker compose up -d
docker compose ps
```

`db` reporta `healthy` cuando `pg_isready` responde, `migrate` crea la tabla y
termina, y `web` no arranca hasta que las dos condiciones se cumplen.

## El clúster, el stack y la actualización

```bash
cd 05-swarm-init
bash demo.sh
```

```
ID                            HOSTNAME         STATUS    AVAILABILITY   MANAGER STATUS   ENGINE VERSION
ibherjfz80z5j0k4ht3skp6i0 *   cardel-desktop   Ready     Active         Leader           29.7.2
```

```bash
cd 06-swarm-stack
docker stack deploy -c stack.yml demo
docker stack services demo
```

El `stack.yml` pide cuatro réplicas de `web` restringidas a los workers, de
modo que para verlas programadas hace falta que el clúster tenga nodos con ese
rol. `08-swarm-rolling` despliega seis réplicas y las reemplaza por lotes de
dos, con cinco segundos de espera entre lotes:

```bash
cd 08-swarm-rolling
bash demo.sh
```

## Limpiar

```bash
docker compose down -v
docker stack rm demo rolling
docker swarm leave --force
```
