# Docker Compose y Swarm · Infra C9

Lo que se vio en la sesión: los tres sitios donde un contenedor puede guardar
algo que le sobreviva, quién alcanza a quién cuando hay más de una red, cómo
pasan tres `docker run` a un solo archivo que se versiona con el código, qué se
lleva por delante un `down` y qué no, y qué aparece cuando el mismo archivo se
despliega sobre un clúster en vez de sobre una máquina. Las diapositivas están
en el Campus Virtual; aquí quedan las órdenes, las trazas que devolvieron y lo
que salió en el salón.

## El sistema de archivos del contenedor es efímero

De la sesión de [imágenes y contenedores](../C8/Docker,%20imagenes%20y%20contenedores.md)
quedó la capa escribible que nace con el contenedor y muere con él. Vale
volver a verlo, porque todo lo que sigue se apoya ahí:

```bash
docker run --name prueba alpine sh -c 'echo dato-importante > /datos.txt'
docker rm prueba
docker run --rm alpine cat /datos.txt
```

```
cat: can't open '/datos.txt': No such file or directory
```

Mientras el contenedor existe el archivo se alcanza, y `docker cp
prueba:/datos.txt -` lo saca al anfitrión con su contenido intacto. El borrado
es lo que lo liquida:

| Paso | Acción | Estado de `/datos.txt` |
|---|---|---|
| 1 | `docker run` escribe el archivo | queda en la capa del contenedor |
| 2 | `docker cp` lo saca al anfitrión | se lee sin problema |
| 3 | `docker rm` borra el contenedor | se va con la capa |
| 4 | `docker run` con la misma imagen | no existe |

Una base de datos sin volumen pierde todo en el paso tres, y el paso tres es
la operación más rutinaria que hay.

### Tres mecanismos, y cada uno sirve para otra cosa

El **bind mount** expone un directorio del anfitrión dentro del contenedor, de
modo que los dos ven el mismo archivo. Sirve en desarrollo y para dejar
configuración local a mano:

```bash
mkdir -p ./datos
docker run --rm -v "$PWD/datos:/data" alpine \
    sh -c 'echo "hola desde dentro" > /data/saludo.txt'
cat ./datos/saludo.txt
```

```
hola desde dentro
```

El **volumen nombrado** lo administra Docker bajo `/var/lib/docker/volumes/` y
no depende de ninguna ruta del anfitrión. Es el que va en producción:

```bash
docker volume create datos-app
docker run --rm -v datos-app:/data alpine sh -c 'echo "primer escritor" > /data/log.txt'
docker run --rm -v datos-app:/data alpine cat /data/log.txt
```

```
datos-app
primer escritor
```

Dos contenedores distintos, el primero ya borrado, y el segundo encuentra lo
que escribió el primero.

El **tmpfs** vive en la memoria del anfitrión y no toca disco, así que sirve
para datos sensibles de vida corta, como un token o un archivo de sesión:

```bash
docker run --rm --tmpfs /tmp:rw,size=32m alpine \
    sh -c 'echo "datos volatiles" > /tmp/secreto.txt; cat /tmp/secreto.txt'
```

```
datos volatiles
```

### El caso que obliga a entenderlos

PostgreSQL guarda lo suyo en `/var/lib/postgresql/data`. Con un volumen montado
ahí, el contenedor se puede recrear incluso con otra versión de la imagen y los
datos siguen donde estaban:

```bash
docker volume create pgdata

docker run -d --name db -e POSTGRES_PASSWORD=ejemplo \
    -v pgdata:/var/lib/postgresql/data postgres:16

docker rm -f db
docker run -d --name db -e POSTGRES_PASSWORD=ejemplo \
    -v pgdata:/var/lib/postgresql/data postgres:16.2
```

Dos trampas de los bind mounts, que son las que más tiempo se llevan en la
práctica. Una es de permisos: el identificador de usuario de dentro del
contenedor no tiene por qué coincidir con el del anfitrión, y la escritura
falla; se arregla con `--user $(id -u):$(id -g)` o ajustando los permisos
afuera. La otra son los volúmenes anónimos. Un `-v /data` sin origen deja un
volumen sin nombre que después nadie reconoce; `docker volume prune` los
recoge, y nombrarlos los evita de entrada.

## Quién alcanza a quién

En la red `bridge` por defecto los contenedores se hablan por dirección y no
por nombre. Una red creada por el usuario activa el servicio de nombres
interno, y ahí sí el `--name` de cada contenedor sirve como nombre de máquina:

```bash
docker run -d --name web nginx:alpine
docker run --rm curlimages/curl curl --max-time 2 http://web/
```

```
Could not resolve host: web
```

Con la red propia, el mismo `curl` recibe la página de NGINX:

```bash
docker network create app-net
docker run -d --name web --network app-net nginx:alpine
docker run --rm --network app-net curlimages/curl curl http://web/
```

Y el aislamiento va con lo mismo. Con dos redes, `frontend` con `app-a` y
`db-a`, y `backend` con `app-b` y `db-b`, cada aplicación ve a su base por
nombre y no ve nada de la otra red. Para que un contenedor cruce hay que
conectarlo a las dos, con `docker network connect backend app-a`.

El puerto es otra decisión, independiente de la red:

```bash
docker run -d -p 8080:80 nginx:alpine              # publicado en todas las interfaces
docker run -d -p 127.0.0.1:8080:80 nginx:alpine    # solo desde la propia máquina
docker run -d --network host nginx:alpine          # sin red propia: la del anfitrión
```

La tercera forma quita el aislamiento de red por completo. El contenedor queda
con acceso a todos los puertos del anfitrión, incluido lo que solo escuche en
`localhost`, y eso que resulta cómodo para depurar es un agujero en una
máquina de producción.

## Una aplicación tiene varias piezas

El caso con el que se abrió Compose. Una aplicación web tiene un frontend, que
es lo que el usuario abre en el navegador; un backend, que atiende al frontend
y resuelve la lógica; y una base de datos, que guarda lo que tiene que durar,
con su volumen debajo.

Meter las tres en un contenedor sale caro. Cualquier cambio obliga a
redesplegar el conjunto, tocar el backend arrastra al frontend y a la base, la
imagen crece, y un proceso que muere se lleva por delante las tres piezas.

## El problema con `docker run` a mano

Tres contenedores, una red propia y un volumen para la base. Escrito a mano son
cinco órdenes:

```bash
docker network create app-net
docker volume create pgdata

docker run -d --name db --network app-net \
    -e POSTGRES_PASSWORD=ejemplo -v pgdata:/var/lib/postgresql/data postgres:16

docker run -d --name cache --network app-net redis:7-alpine

docker run -d --name web --network app-net -p 8080:5000 \
    -e DB_HOST=db -e DB_PASSWORD=ejemplo mi-app:1.0
```

Cinco órdenes en un orden que no está escrito en ninguna parte. Quien invierta
dos, o se salte la red, deja el sistema a medias y el error aparece en el
primer `curl`. No hay un archivo que diga qué es el sistema.

## La aplicación que se levantó

El proyecto tiene esta forma, y `docker compose` se ejecuta desde la carpeta
donde está el `compose.yml`:

```text
proyecto/
  app/
    app.py            # la aplicacion Flask
    Dockerfile        # como se construye su imagen
    requirements.txt  # dependencias de Python
  compose.yml         # los tres servicios, la red y el volumen
```

Todas las rutas del archivo se resuelven desde ahí, y por eso `build: ./app`
apunta a la carpeta que tiene el `Dockerfile` y no a un nombre de imagen.

La aplicación lee su configuración del entorno y abre las dos conexiones:

```python
DB_HOST = os.environ.get("DB_HOST", "db")
DB_USER = os.environ.get("DB_USER", "postgres")
DB_PASSWORD = os.environ.get("DB_PASSWORD", "ejemplo")
DB_NAME = os.environ.get("DB_NAME", "demo")

cache = redis.Redis(host="cache", port=6379, decode_responses=True)
```

`db` y `cache` no son constantes inventadas: son los nombres que van a tener
los servicios en el `compose.yml`, y el servicio de nombres de la red los
traduce. El valor por defecto de cada variable deja que la aplicación arranque
sin configuración extra.

El punto de entrada hace lo mínimo para dejar evidencia de las dos conexiones:

```python
@app.route("/")
def raiz():
    visitas = cache.incr("visitas")
    with psycopg2.connect(
        host=DB_HOST, user=DB_USER, password=DB_PASSWORD, dbname=DB_NAME
    ) as conn, conn.cursor() as cur:
        cur.execute("SELECT 1;")
        ok = cur.fetchone()[0]
    return jsonify(visitas=visitas, db_ok=ok == 1)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
```

`cache.incr` sube un contador en Redis y devuelve el valor nuevo, así que
mientras el contador crezca la caché responde. El bloque `with` de `psycopg2`
abre la conexión a PostgreSQL, lanza un `SELECT 1` y la cierra al salir. La
respuesta deja las dos evidencias juntas.

El `Dockerfile` del servicio web es el mismo del tema anterior, con las
dependencias arriba:

```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app.py .
EXPOSE 5000
CMD ["python", "app.py"]
```

Mientras `requirements.txt` no cambie, la capa del `pip install` sale de la
caché y reconstruir después de editar `app.py` cuesta segundos. Invertir las
dos líneas reinstala todo en cada cambio.

## El `compose.yml`

```yaml
services:
  web:
    build: ./app
    ports: ["8080:5000"]
    environment:
      DB_HOST: db
      DB_PASSWORD: ejemplo
      DB_NAME: demo
    depends_on: [db, cache]
    networks: [app-net]
  db:
    image: postgres:16
    environment:
      POSTGRES_DB: demo
      POSTGRES_PASSWORD: ejemplo
    volumes: [pgdata:/var/lib/postgresql/data]
    networks: [app-net]
  cache:
    image: redis:7-alpine
    networks: [app-net]

volumes:
  pgdata:

networks:
  app-net:
```

Cada bandera de la línea de órdenes tiene su clave. El `-p` pasó a `ports`, el
`-e` a `environment`, el `-v` a `volumes`, el `--network` a `networks` y el
`--name` desapareció, porque el nombre del servicio ya lo cumple. Lo que antes
eran cinco órdenes y un orden que nadie escribió es ahora un archivo que se
versiona en git al lado del código, y se levanta con `docker compose up -d
--build` y se baja con `docker compose down`.

## Levantar el sistema y leer el contador

```bash
docker compose up -d --build
docker compose ps
```

```
NAME               IMAGE            COMMAND                  SERVICE   CREATED          STATUS          PORTS
proyecto-cache-1   redis:7-alpine   "docker-entrypoint.s…"   cache     15 seconds ago   Up 14 seconds   6379/tcp
proyecto-db-1      postgres:16      "docker-entrypoint.s…"   db        15 seconds ago   Up 14 seconds   5432/tcp
proyecto-web-1     proyecto-web     "python app.py"          web       15 seconds ago   Up 14 seconds   0.0.0.0:8080->5000/tcp, [...]
```

La tabla no cabe en una terminal angosta, y con `--format` se recorta a lo que
interesa:

```bash
docker compose ps --format 'table {{.Service}}\t{{.Status}}\t{{.Ports}}'
```

```
SERVICE   STATUS          PORTS
cache     Up 14 seconds   6379/tcp
db        Up 14 seconds   5432/tcp
web       Up 14 seconds   0.0.0.0:8080->5000/tcp, [::]:8080->5000/tcp
```

Ahí está la columna que conviene mirar primero. `cache` y `db` muestran
`6379/tcp` y `5432/tcp` sin ninguna dirección delante, porque su puerto está
expuesto dentro de la red `app-net` y no en el anfitrión: nadie los alcanza
desde afuera. `web` sí, y es el único que declaró `8080:5000`.

Dos peticiones alcanzan para probar que cada pieza está donde se la espera:

```bash
curl -s localhost:8080
curl -s localhost:8080
docker compose logs --tail 3 web
```

```
{"db_ok":true,"visitas":1}
{"db_ok":true,"visitas":2}
web-1  |  * Running on http://127.0.0.1:5000
web-1  |  * Running on http://172.19.0.4:5000
web-1  | 172.19.0.1 - - [09/Sep/2026 00:57:39] "GET / HTTP/1.1" 200 -
```

El contador pasa de 1 a 2, así que `web` resolvió el nombre `cache` y Redis
guarda estado entre peticiones. El `db_ok` en verdadero confirma que el
`SELECT 1` llegó a PostgreSQL. Y la última línea del log trae `172.19.0.1`,
que es la puerta de enlace de la red: la petición entró desde el anfitrión, no
desde otro contenedor.

Si la primera petición falla con un error de conexión, el culpable es el
arranque. PostgreSQL tarda unos segundos en aceptar conexiones y `depends_on` a
secas no espera tanto, cosa que se arregla más abajo.

## Qué sobrevive a `docker compose down`

Se deja una marca en la base antes de bajar el sistema:

```bash
docker compose exec -T db psql -U postgres -d demo \
    -c "CREATE TABLE visitas_log (id serial PRIMARY KEY, marca timestamptz DEFAULT now());"
docker compose exec -T db psql -U postgres -d demo \
    -c "INSERT INTO visitas_log DEFAULT VALUES; INSERT INTO visitas_log DEFAULT VALUES;"
```

```
CREATE TABLE
INSERT 0 1
INSERT 0 1
```

Y ahora se baja todo y se vuelve a levantar:

```bash
docker compose down
docker volume ls | grep proyecto
docker compose up -d
curl -s localhost:8080
docker compose exec -T db psql -U postgres -d demo -c "SELECT count(*) FROM visitas_log;"
```

```
local     proyecto_pgdata
{"db_ok":true,"visitas":1}
 count
-------
     2
(1 row)
```

La misma corrida deja tres resultados distintos, uno por cada sitio donde
había algo guardado.

| Dato | Dónde vive | Tras `down` y `up` |
|---|---|---|
| contador `visitas` | Redis, sin volumen declarado | vuelve a 1 |
| filas de `visitas_log` | volumen `pgdata` | siguen las 2 |
| red `app-net` | la crea Compose al levantar | se rehace igual |

El contador delata al servicio sin volumen. `visitas` vuelve a 1 porque
`cache` no declaró ninguno y Redis arranca vacío al recrear el contenedor;
cambiarlo cuesta una línea, `volumes: [redisdata:/data]`, más la entrada del
volumen en la raíz. Las dos filas, en cambio, siguen ahí, y `docker volume ls`
muestra por qué: `proyecto_pgdata` sobrevivió al `down`.

**`down` no borra volúmenes y `down -v` sí.** La bandera elimina el volumen y
con él las dos filas, sin preguntar. Sobre el proyecto de una base en
producción, eso borra los datos.

El nombre del volumen trae pegado el del proyecto, y el del proyecto lo toma
Compose de la carpeta donde está el archivo. Por eso aquí es `proyecto_pgdata`
y los contenedores se llaman `proyecto-web-1`.

## Las cuatro secciones del archivo

En la raíz del `compose.yml` van cuatro bloques. `services` describe cada
servicio, un grupo de contenedores con la misma imagen y la misma
configuración. `networks` declara las redes, que Docker crea al levantar.
`volumes` declara los volúmenes nombrados. Y `configs` y `secrets` llevan los
archivos de configuración y los secretos que los servicios necesitan.

De ahí sale el error que más se comete al escribir el archivo. Las claves
`networks` y `volumes` dentro de un servicio son **listas de referencias**, y
la definición tiene que estar en la raíz. Un servicio que nombra `app-net` sin
que exista el bloque `networks: app-net:` abajo no levanta.

Dos convenciones más que conviene tener a mano. Un servicio es una imagen más
un número de réplicas, y sin decir nada la réplica es una. Cada servicio ve a
los demás por su nombre, pero solo dentro de las redes que comparten.

## `depends_on` y lo que de verdad espera

`depends_on` a secas ordena la creación de los contenedores y nada más. El de
la base arranca primero, PostgreSQL puede tardar segundos en aceptar
conexiones, y `web` ya está pidiendo. Hay tres condiciones para decir qué se
espera de verdad:

| Condición | Qué espera |
|---|---|
| `service_started` | que el contenedor arranque |
| `service_healthy` | que el `healthcheck` reporte `healthy` |
| `service_completed_successfully` | que el servicio termine con código 0 |

La tercera es la que sirve para una migración, que corre una vez y acaba. Y la
segunda pide declarar el sondeo:

```yaml
services:
  db:
    image: postgres:16
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d demo"]
      interval: 3s
      timeout: 2s
      retries: 10
      start_period: 5s
```

Las dos claves que deciden cuánto tarda en darse por caída son `interval` y
`retries`, y lo que las junta es el producto: un sondeo cada 3 segundos, 10
sondeos fallidos seguidos, 30 segundos. Medio minuto en que quien pidió algo
sigue esperando. Los 5 segundos de `start_period` no se suman: van antes, y en
esa ventana un sondeo que falla no cuenta.

Con el sondeo declarado, la cadena completa queda así:

```yaml
  migrate:
    image: postgres:16
    depends_on:
      db:
        condition: service_healthy
    environment:
      PGPASSWORD: ejemplo
    command: >
      psql -h db -U postgres -d demo
      -c "CREATE TABLE IF NOT EXISTS visitas (id serial primary key, ts timestamp default now());"

  web:
    image: nginx:alpine
    depends_on:
      db:
        condition: service_healthy
      migrate:
        condition: service_completed_successfully
    ports:
      - "8080:80"
```

`db` arranca y reporta `healthy` cuando `pg_isready` responde, `migrate` crea
la tabla y termina, y `web` no arranca hasta que las dos cosas pasaron. La otra
salida es envolver el arranque en un guion de espera tipo `wait-for-it.sh`, que
sondea el puerto antes de lanzar el proceso, y sirve cuando la imagen no trae
con qué sondearse a sí misma.

## El ciclo del día a día

```bash
docker compose up -d                # arranca todo en segundo plano
docker compose up -d --build        # reconstruye las imagenes locales
docker compose ps                   # estado de los servicios
docker compose logs -f web          # logs en vivo de un servicio
docker compose exec web sh          # interprete de ordenes dentro de la replica
docker compose restart web          # reinicio puntual
docker compose stop && docker compose start   # parar y reiniciar todo
docker compose down                 # baja contenedores y red
docker compose down -v              # ademas elimina los volumenes
```

Cuatro de esas nueve solo miran, y las otras cinco crean, paran o borran. Vale
saber de qué lado está cada una antes de escribirla en una máquina que no es la
propia.

Compose usa el nombre de la carpeta como nombre de proyecto, y con `-p` se
cambia: `docker compose -p staging up -d` levanta una segunda copia del mismo
archivo sin pisar la primera.

Después de editar el archivo o de reconstruir una imagen, `docker compose up
-d` compara lo que corre con lo que dice el archivo y recrea solo los servicios
cuyo bloque cambió. Los demás siguen en marcha.

## Escalar sin balanceador

```bash
docker compose up -d --scale web=3
```

La bandera solo toca el servicio que nombra, así que quedan cinco contenedores:
tres réplicas de `web` más la de `db` y la de `cache`. Y `web=3` es el total de
réplicas de ese servicio, no tres además de la que ya estaba. El nombre de cada
réplica lleva el proyecto por delante y el número al final, de modo que la
tercera queda como `proyecto-web-3`, mientras la columna `SERVICE` sigue
diciendo `web`.

La orden falla si el servicio fija un puerto del anfitrión. `ports:
["8080:5000"]` pide ese puerto para cada réplica, y la segunda ya no lo
encuentra libre: el puerto se reserva al crear el contenedor, y ahí mismo se
detiene la orden. Escalar pide que el servicio no publique puerto, y entonces
las réplicas quedan alcanzables dentro de la red del proyecto.

Lo que no resuelve es el reparto. **Compose levanta varias réplicas y no
balancea el tráfico entre ellas.** Para tráfico real hay que poner un
balanceador delante, NGINX o HAProxy, o cambiar de herramienta.

## Lo que empieza donde Compose se queda corto

| Compose plano | Swarm |
|---|---|
| Corre en una sola máquina | Clúster de varias máquinas con un mismo plano de control |
| Sin balanceo entre réplicas | Servicios con réplicas, balanceo y reprogramación automática |
| Sin política de reintento ni reprogramación | Reinicios y reubicación de tareas declarados en el archivo |
| Sin actualización progresiva ni vuelta atrás | Lotes, espera y regreso a la versión anterior |
| El orquestador es el `docker compose` que se está ejecutando | El plano de control replicado entre managers |

### Managers y workers

Los **managers** mantienen el estado del clúster y lo replican entre ellos con
Raft, el algoritmo de consenso que exige mayoría para decidir. Los **workers**
ejecutan las tareas que el líder les asigna. Un manager también puede ejecutar
tareas, y de hecho en un clúster chico es lo normal.

Lo que hace Raft es que el estado del clúster sobreviva a la caída de un
manager, siempre que quede mayoría viva. Con tres managers se aguanta la caída
de uno; con dos, ninguna, porque uno solo no es mayoría de dos. De ahí que los
clústeres de managers se armen en número impar.

### El clúster de un solo nodo

```bash
docker swarm init
```

```
Swarm initialized: current node (ibherjfz80z5j0k4ht3skp6i0) is now a manager.

To add a worker to this swarm, run the following command:

    docker swarm join --token SWMTKN-1-4vzt1fmxpd9mtgaiv3r7l4kyg2[...]0zsjoqh4ruu1dtfsqpnbh662z 192.168.18.52:2377

To add a manager to this swarm, run 'docker swarm join-token manager' and follow the instructions.
```

```bash
docker node ls
```

```
ID                            HOSTNAME         STATUS    AVAILABILITY   MANAGER STATUS   ENGINE VERSION
ibherjfz80z5j0k4ht3skp6i0 *   cardel-desktop   Ready     Active         Leader           29.7.2
```

Un clúster de un nodo ya es un clúster. El asterisco marca el nodo desde el que
se ejecutó la orden, y ese manager único aparece como `Leader`: ganó una
elección de un votante. Sin `--advertise-addr` el motor escogió por su cuenta
la dirección de la interfaz de salida, `192.168.18.52`, y la puso en la orden
de unión que imprime.

```bash
docker info --format 'Managers={{.Swarm.Managers}} Nodes={{.Swarm.Nodes}} Estado={{.Swarm.LocalNodeState}} PlanoDeControl={{.Swarm.ControlAvailable}}'
```

```
Managers=1 Nodes=1 Estado=active PlanoDeControl=true
```

Sumar nodos es correr la orden de unión en cada uno con el token que
corresponda. La bandera `-q` imprime el token a secas, listo para guardarlo en
una variable:

```bash
MTOK=$(docker swarm join-token -q manager)
docker swarm join --token "$MTOK" --advertise-addr 10.77.0.12 10.77.0.1:2377
```

```
This node joined a swarm as a manager.
```

Con dos nodos más dentro, el mismo listado de antes cambia de forma:

```bash
docker node ls
```

```
ID                            HOSTNAME         STATUS    AVAILABILITY   MANAGER STATUS   ENGINE VERSION
hsczzk07729uc56vubibj6bc2 *   cardel-desktop   Ready     Active         Leader           29.7.2
i799uoq3e72varnj9watp641w     nodo2            Ready     Active         Reachable        28.5.2
wuptzb12b4jmo7012k1wwh8vn     nodo3            Ready     Active         Reachable        28.5.2
```

Uno es `Leader` y los otros dos `Reachable`, que es el estado de un manager que
no lidera pero vota. Las versiones del motor no coinciden entre nodos y el
clúster funciona igual.

`--advertise-addr` es la dirección por la que los demás van a buscar a ese nodo
para replicar el estado. Un nodo que cambie de dirección después de unirse deja
a sus pares llamando a la vieja, y queda como `Unreachable` aunque el motor esté
vivo.

## Tres réplicas y un solo puerto

```bash
docker service create --name web --replicas 3 --publish 8080:80 nginx:alpine
```

```
verify: Waiting 1 seconds to verify that tasks are stable...
verify: Service 6cai30zq7r89l6w9hcts1xppr converged
```

```bash
docker service ls
docker service ps web --format 'table {{.Name}}\t{{.Node}}\t{{.CurrentState}}'
```

```
ID             NAME      MODE         REPLICAS   IMAGE          PORTS
6cai30zq7r89   web       replicated   3/3        nginx:alpine   *:8080->80/tcp

NAME      NODE             CURRENT STATE
web.1     nodo3            Running 15 seconds ago
web.2     cardel-desktop   Running 13 seconds ago
web.3     nodo2            Running 15 seconds ago
```

`3/3` son las réplicas activas sobre las pedidas, y mientras una tarea arranca
se lee `2/3` y el servicio todavía no ha convergido. `docker service ps` baja al
nivel de la tarea y nombra el nodo donde quedó cada una: el planificador
repartió `web.1`, `web.2` y `web.3` entre los tres nodos sin que nadie se lo
indicara.

La otra columna que importa es la de puertos. `*:8080->80/tcp` no está atado a
un nodo: el 8080 responde en los tres, y quien atienda enruta hacia alguna de
las réplicas. El puerto es del servicio y no de la réplica, que es justo lo
contrario de `--scale`, donde el segundo contenedor choca contra el puerto ya
tomado.

## Stacks: el mismo archivo con una sección `deploy`

Un stack es el `compose.yml` desplegado sobre el clúster, con un bloque nuevo
que Compose plano ignora:

```yaml
services:
  web:
    image: nginx:alpine
    ports: ["8080:80"]
    networks: [frontend]
    deploy:
      replicas: 4
      resources:
        limits: { cpus: "0.5", memory: 128M }
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
      placement:
        constraints: ["node.role == worker"]

networks:
  frontend:
    driver: overlay
```

`deploy` es lo que controla cuántas réplicas hay, cuánto puede consumir cada
una, qué se hace cuando una falla y en qué nodos puede caer. La restricción del
ejemplo manda las cuatro réplicas a los workers y deja el manager libre para el
plano de control. La red, en cambio, cambia de controlador: `overlay` es la que
atraviesa varias máquinas, mientras `bridge` solo existe dentro de una.

```bash
docker stack deploy -c stack.yml demo
docker stack services demo
docker stack ps demo
docker stack rm demo
```

## La actualización, lote por lote

```yaml
services:
  web:
    image: nginx:1.25-alpine
    deploy:
      replicas: 6
      update_config:
        parallelism: 2          # replicas por lote
        delay: 5s               # espera entre lotes
        order: start-first      # arranca la nueva antes de parar la vieja
        failure_action: rollback
        monitor: 10s            # ventana para detectar fallos
        max_failure_ratio: 0.34
      rollback_config:
        parallelism: 2
        delay: 3s
```

Con seis réplicas y dos por lote salen tres lotes, y entre ellos dos esperas de
cinco segundos. Lo que cambia según el orden es cuántas réplicas hay vivas
mientras entra cada lote:

| Momento | v1.25 | v1.27 | Activas |
|---|---|---|---|
| antes de `stack deploy` | 6 | 0 | 6 |
| lote 1, arranca la pareja nueva | 6 | 2 | 8 |
| lote 1, se detiene la pareja vieja | 4 | 2 | 6 |
| espera de 5 s | 4 | 2 | 6 |
| lote 2, arranca la pareja nueva | 4 | 4 | 8 |
| lote 2, se detiene la pareja vieja | 2 | 4 | 6 |
| espera de 5 s | 2 | 4 | 6 |
| lote 3, arranca la pareja nueva | 2 | 6 | 8 |
| lote 3, se detiene la pareja vieja | 0 | 6 | 6 |

La columna de activas no baja de 6 en ninguna fila, y el pico de 8 es el precio
de `start-first`: el clúster tiene que aguantar una pareja de más. Con
`stop-first` las mismas filas dan 4 en cada arranque, y esas dos réplicas que
faltan son peticiones que alguien no recibe.

La vuelta atrás tiene las dos formas:

```bash
docker stack deploy -c stack.v1.yml rolling    # version inicial
docker stack deploy -c stack.v2.yml rolling    # actualizar
docker service rollback rolling_web            # volver a la anterior, a mano
```

La automática la dispara `failure_action: rollback` cuando se supera
`max_failure_ratio` dentro de la ventana de `monitor`. Con 0,34 sobre un lote de
dos, basta que una de las dos réplicas nuevas falle para que Swarm deshaga la
actualización por su cuenta.

Lo que decide si eso funciona es el sondeo de salud. El `monitor` mide si la
réplica nueva queda `healthy`, según el `HEALTHCHECK` de la imagen o del
servicio. Sin sondeo, Swarm no tiene con qué saber si la versión nueva sirve y
da por buena cualquier réplica que arranque, de modo que una imagen rota se
despliega completa.

## Para seguir

- Las **ocho actividades** de la sesión están en la página de ejercicios, en el
  orden de los temas, y las dos de volúmenes y redes del tema anterior se
  vuelven a usar tal cual. En clase se hicieron las de Compose; las de Swarm
  quedaron para la casa.
- El [código de la sesión](./codigo/README.md) trae los cinco ejemplos que se
  levantaron, con las órdenes que los ponen en marcha y lo que imprimen.
- Lo que sigue es la orquestación sobre un clúster que no administra Docker:
  Kubernetes, donde el servicio, la red y el volumen vuelven a aparecer con
  otros nombres y con más piezas en medio.
- Para profundizar, la especificación de Compose está en
  <https://github.com/compose-spec/compose-spec>, la documentación de Swarm en
  <https://docs.docker.com/engine/swarm/>, y la visualización interactiva de una
  elección de Raft en <https://raft.github.io>. Los capítulos de coordinación,
  replicación y consenso de Tanenbaum y van Steen son la lectura de fondo.
