# Docker: imágenes y contenedores · Infra C8

Lo que se vio en la sesión: por qué una aplicación que funciona en un portátil
falla en el servidor, qué es de verdad un contenedor cuando se lo mira desde el
sistema operativo, cómo se escribe un `Dockerfile` que no repita la instalación
en cada cambio, y qué pasa con los datos cuando el contenedor se borra. Las
diapositivas están en el Campus Virtual; aquí quedan las órdenes, las trazas que
devolvieron y lo que salió en el salón.

## La aplicación no es solo el código

El caso con el que se abrió: un equipo termina una interfaz en Python, funciona
en el portátil de quien la escribió y falla al instalarla en el servidor. La
versión era 3.10 en el portátil y 3.8 en el servidor. Lo mismo pasa con dos
aplicaciones que necesitan Java 8 y Java 17 en la misma máquina, donde la salida
casera es cambiar el `PATH` a mano cada vez.

Lo que hay que mover junto con el código son las bibliotecas, las variables de
entorno, el sistema de archivos y las versiones. De ahí la pregunta de la
sesión: cómo se empaca una aplicación con su entorno para moverla a cualquier
máquina sin reconfigurar nada.

Hay dos respuestas. La **máquina virtual** lleva un sistema operativo completo
sobre un hipervisor, con su propio núcleo. El **contenedor** comparte el núcleo
del anfitrión y empaca solo la aplicación y sus bibliotecas. Por eso un
contenedor arranca en milisegundos y una máquina virtual tarda segundos o
minutos y reserva la memoria como si fuera un equipo aparte.

Eso se apoya en dos mecanismos del núcleo de Linux, los namespaces y los
cgroups, que no existen en el núcleo de Windows. Ahí Docker corre sobre WSL,
que es un sistema sobre otro, con la latencia que eso cuesta.

## Un contenedor es un proceso del anfitrión

El ejemplo de la sesión es un servicio Flask de doce líneas que responde el
nombre de máquina y la versión. Se construye y se levanta así:

```bash
docker build -t hola-mundo .
docker run -d -p 8080:5000 --name hola hola-mundo
curl http://localhost:8080
```

```
{"host":"9058e5d763be","mensaje":"Hola desde el contenedor","version":"0.1.0"}
```

```bash
docker ps
```

```
NAMES     IMAGE        STATUS         PORTS
hola      hola-mundo   Up 2 seconds   0.0.0.0:8080->5000/tcp, [::]:8080->5000/tcp
```

Lo que importa de ese contenedor es que no es una máquina pequeña. Es un
proceso más en la tabla del anfitrión, y se puede mirar desde los dos lados a
la vez:

```bash
PID=$(docker inspect -f '{{.State.Pid}}' hola)
ps -o pid,ppid,comm -p "$PID"
docker exec hola sh -c 'cat /proc/1/comm; tr "\0" " " < /proc/1/cmdline'
```

```
    PID    PPID COMMAND
  24110   24087 python

python
python app.py
```

El mismo programa es el proceso 24110 para el anfitrión y el proceso 1 para el
contenedor. Un solo proceso, dos numeraciones, y eso es exactamente lo que hace
un namespace:

```bash
readlink /proc/self/ns/pid
docker exec hola readlink /proc/self/ns/pid
```

```
pid:[4026531836]
pid:[4026532905]
```

Dos identificadores distintos, uno por cada árbol de procesos. Dentro del
contenedor se pueden usar las mismas herramientas de siempre, `ps`, `top`,
`hostname`, y todas contestan sobre lo que el namespace deja ver.

El anfitrión, en cambio, no ve un bulto: ve cada proceso del contenedor por
separado, con su propio número en la numeración de la máquina. Un contenedor
que arranque tres procesos aparece como tres procesos en el `ps` del anfitrión,
y el que adentro es el número uno es el que `docker inspect` devuelve en
`.State.Pid`. Eso funciona porque en Linux los procesos también son archivos,
bajo `/proc`, y el namespace solo cambia qué parte de ese árbol se alcanza
desde dentro.

De ahí sale la idea que conviene no perder: **Docker no inventa el
aislamiento**, lo pide prestado al núcleo. Cuando alguien se escapa de un
contenedor, la falla no está en Docker, está en el núcleo de Linux.

### Aislado no es seguro

El aislamiento separa, pero no blinda. El namespace de usuarios es el mismo a
los dos lados mientras no se diga otra cosa, así que `root` dentro del
contenedor es `root` de la máquina, y un proceso que se salga del namespace de
montaje sale con esos permisos. De ahí tres costumbres.

La primera es no correr la aplicación como `root`. En el `Dockerfile` se crea
una cuenta sin privilegios y se cambia a ella antes del `CMD`:

```dockerfile
RUN useradd --create-home appuser
USER appuser
```

La segunda es no montar el sistema de archivos del anfitrión dentro de un
contenedor ni pasarle el socket de Docker, porque cualquiera de las dos le
entrega la máquina entera a quien esté adentro.

La tercera es de instalación, y conviene saber qué significa. Pertenecer al
grupo `docker` evita escribir `sudo` en cada orden, pero quien puede hablarle
al demonio puede levantar un contenedor que monte todo el disco, así que ese
grupo equivale a `root` en esa máquina. Lo que de verdad baja el privilegio es
el modo sin raíz, donde el propio demonio corre sin ser `root`.

## Lo que el contenedor ve y lo que puede consumir

Si los namespaces deciden qué ve el proceso, los cgroups deciden cuánto
consume. Se fijan al levantarlo:

```bash
docker run --rm --cpuset-cpus=0-11 --cpus=1.5 --memory=256m --pids-limit=64 \
    python:3.12-slim sh -c 'echo "nproc:      $(nproc)"
                            echo "cpu.max:    $(cat /sys/fs/cgroup/cpu.max)"
                            echo "memory.max: $(cat /sys/fs/cgroup/memory.max)"
                            echo "pids.max:   $(cat /sys/fs/cgroup/pids.max)"'
```

```
nproc:      12
cpu.max:    150000 100000
memory.max: 268435456
pids.max:   64
```

Ahí está la trampa que más cuesta en este curso. El contenedor tiene asignado
**1,5 núcleos**, que es lo que dice `cpu.max`: 150.000 microsegundos de cómputo
por cada 100.000 de reloj. Pero `nproc` contesta **12**, porque `/proc/cpuinfo`
y `/proc/meminfo` no están aislados y siguen siendo los del anfitrión. Un
programa que dimensione su conjunto de hilos con `nproc` crea doce hilos para
turnarse 1,5 núcleos, y pierde en cambios de contexto lo que creía ganar. La
cifra correcta está en `cpu.max`.

El consumo real se mira con `docker stats`, que da el porcentaje de CPU y la
memoria usada frente a la disponible, contenedor por contenedor.

## La imagen y el contenedor

La imagen es la receta y el contenedor es el plato cocinado: de una sola receta
salen muchos platos, y cada uno puede terminar distinto. Las imágenes viven en
un registro, y el público es Docker Hub.

```bash
docker pull nginx:alpine     # traerla
docker images                # las que hay en la máquina
docker push usuario/imagen   # subir la propia
```

Las imágenes oficiales traen variantes, `slim`, `alpine` y las completas, que
se diferencian en lo que viene preinstalado; cuál sirve se decide leyendo la
documentación de esa imagen. Las más livianas son las que menos traen, y eso se
nota cuando hace falta una biblioteca del sistema.

Una imagen se descarga una sola vez. Varios contenedores comparten sus capas,
que son de solo lectura, y cada uno añade encima su propia capa escribible con
su configuración. Por eso dos contenedores del mismo servidor web no ocupan el
doble de disco.

## El `Dockerfile`

El de la sesión, entero:

```dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app.py .

ENV APP_VERSION=0.1.0
EXPOSE 5000

CMD ["python", "app.py"]
```

Las instrucciones que se usaron y lo que hace cada una:

| Instrucción | Qué hace |
|---|---|
| `FROM` | De qué imagen se parte. El vacío es el punto de partida sin sistema de archivos |
| `WORKDIR` | El directorio de trabajo dentro de la imagen |
| `COPY` | Copia del contexto de construcción hacia la imagen |
| `RUN` | Ejecuta una orden durante la construcción y deja el resultado en una capa |
| `ENV` | Variable de entorno |
| `EXPOSE` | Documenta el puerto en que escucha. No lo publica |
| `USER` | Con qué cuenta corre el proceso |
| `VOLUME` | Declara una ruta que debe salir de la capa escribible |
| `CMD` | La orden por defecto |
| `ENTRYPOINT` | El ejecutable fijo, al que `CMD` le pasa los argumentos |

**La orden del `CMD` tiene que ser persistente.** Si el proceso termina, el
contenedor se detiene, porque ese proceso es el número uno del contenedor y
cuando muere no queda nadie dentro.

Sobre `CMD` y `ENTRYPOINT` hay dos cosas distintas que conviene no mezclar. Una
es el reparto de papeles: con `ENTRYPOINT` el ejecutable queda fijo y `CMD` pasa
a ser la lista de argumentos por defecto, que se puede reemplazar al levantar el
contenedor. La otra es la **forma de escribirlos**, y la tienen las dos
instrucciones por igual. Escritos como una cadena, `CMD python app.py`, la orden
se lanza bajo `/bin/sh`, y el intérprete queda como proceso número uno y se
traga las señales, de modo que un `docker stop` espera los diez segundos
completos antes de matar a todo el mundo. Escritos como lista, `CMD ["python",
"app.py"]`, el programa queda como proceso número uno y recibe la señal él
mismo. Por eso el ejemplo usa la segunda forma.

### Dónde se rompe la caché

Cada instrucción produce una capa, y Docker reutiliza las capas anteriores
mientras nada haya cambiado. De ahí que el orden decida cuánto tarda una
reconstrucción. Con las dependencias arriba, una edición del código solo invalida
el `COPY app.py` y lo que viene después; con un `COPY . /app` en el paso tres,
invalida también la instalación de las dependencias:

| Construcción | Tiempo |
|---|---|
| Dependencias arriba, editando el código | 2,374 s |
| `COPY . /app` en el paso tres, editando el código | 7,274 s |

Tres veces más, por el orden de dos líneas. Y hay un efecto de arrastre: `COPY .`
sube todo lo que haya en la carpeta, incluidos binarios compilados y entornos
locales que no sirven dentro de la imagen. Lo que no debe entrar se escribe en
un archivo `.dockerignore`, igual que se hace con `.gitignore`.

Agregar una instrucción **al final** del `Dockerfile` no invalida nada de lo de
arriba: se ejecuta esa sola y el resto sigue viniendo de la caché. Y cuando hay
que comprobar que la imagen se construye de cero, `docker build --no-cache`
ignora todas las capas guardadas y vuelve a ejecutar cada instrucción.

### Errores que se pagan después

- **Fijar la imagen base en `latest`.** Es un tag móvil: la próxima construcción
  puede traer una versión mayor incompatible.
- **Correr la aplicación como `root`.** Dentro del contenedor `root` es `root`,
  y si alguien se escapa, se escapa con esa cuenta.
- **Guardar contraseñas en `ENV` o dentro de la imagen.** Quedan en la capa y
  viajan con ella a donde vaya la imagen. Para eso están los secretos.
- **Copiar el código antes de instalar las dependencias.** Es la caché rota de
  arriba.
- **Separar `apt-get update` y `apt-get install` en dos `RUN`.** Quedan en capas
  distintas, y la instalación puede terminar usando un índice viejo que vino de
  la caché.
- **No limpiar la caché de paquetes.** Los instaladores descargados se quedan en
  la capa y engordan la imagen. Por eso el ejemplo usa `pip install
  --no-cache-dir`.

## Ejecutar y operar

Un contenedor se crea, arranca, se puede pausar, se detiene y se elimina:

```bash
docker create   docker start   docker stop   docker pause   docker rm
docker ps       # los que están corriendo
docker ps -a    # todos, incluidos los detenidos
```

Parar y pausar no son lo mismo: el detenido termina sus procesos y los vuelve a
arrancar con el siguiente `docker start`, mientras que el pausado los deja
congelados donde estaban.

`docker ps -a` lista los contenedores que existen, corriendo o detenidos. Los
que se borraron no salen, porque dejaron de existir:

```bash
docker rm -f db
docker ps -a --filter name=db --filter name=efimero --format 'table {{.Names}}\t{{.Status}}'
```

```
NAMES     STATUS
efimero   Up 9 seconds
db2       Up 32 seconds
```

Las banderas de `docker run` que se usaron:

| Bandera | Para qué |
|---|---|
| `-d` | Lo deja corriendo en segundo plano y devuelve la terminal |
| `-it` | Entrada interactiva con terminal, para meterse dentro |
| `-p 8080:5000` | Puerto del anfitrión hacia el puerto del contenedor |
| `-v datos:/var/datos` | Monta un volumen |
| `-e CLAVE=valor` | Variable de entorno |
| `--name` | Nombre legible, para no andar con identificadores |
| `--rm` | Lo borra al salir |
| `--network` | Lo conecta a una red concreta |
| `--restart` | Política de reinicio |

Para saber qué está pasando dentro hay dos órdenes que se usan todo el tiempo,
`docker logs <nombre>`, que saca lo que el proceso escribió, y `docker port`,
que dice por dónde está publicado:

```bash
docker port hola
```

```
5000/tcp -> 0.0.0.0:8080
5000/tcp -> [::]:8080
```

Y entrar al contenedor se hace con `docker exec -it <nombre> sh`, siempre que la
imagen traiga un intérprete de órdenes: las imágenes más recortadas no lo
incluyen, y ahí la inspección se hace desde fuera con `docker inspect`.

### Qué significa escuchar en `0.0.0.0`

El servicio del ejemplo arranca con `app.run(host="0.0.0.0", port=5000)`, y esa
dirección es la que decide si el mapeo de puertos sirve de algo.

`0.0.0.0` como dirección de escucha quiere decir **todas las direcciones de la
máquina**: la aplicación acepta conexiones por cualquiera de sus interfaces. Es
lo contrario de `127.0.0.1`, que es solo la propia máquina y deja al servicio
inalcanzable desde fuera del contenedor por bien mapeado que esté el puerto. No
es una dirección de difusión; la de difusión en IPv4 es `255.255.255.255`.

En la salida de `docker port` aparece también `[::]`, que es la forma de IPv6
de lo mismo, la dirección sin especificar, equivalente a `0.0.0.0`. IPv6 no
tiene difusión: lo que en IPv4 se hacía con una dirección de difusión, aquí se
hace con multidifusión.

## Lo que sobrevive al contenedor

Cada contenedor escribe sobre una capa propia que nace con él y muere con él:

```bash
docker run --rm python:3.12-slim sh -c 'echo "una nota" > /tmp/nota.txt; cat /tmp/nota.txt'
docker run --rm python:3.12-slim sh -c 'cat /tmp/nota.txt'
```

```
una nota
cat: /tmp/nota.txt: No such file or directory
```

El segundo contenedor es otro y no ve nada de lo que escribió el primero.

Lo que mata esa capa es borrar el contenedor, no detenerlo. El mismo
contenedor parado y vuelto a arrancar encuentra lo suyo donde lo dejó:

```bash
docker exec efimero sh -c 'echo "una nota" > /tmp/nota.txt'
docker stop efimero && docker start efimero
docker exec efimero cat /tmp/nota.txt
```

```
una nota
```

Recreado desde la imagen, no:

```bash
docker rm -f efimero
docker run -d --name efimero python:3.12-slim sleep 300
docker exec efimero cat /tmp/nota.txt
```

```
cat: /tmp/nota.txt: No such file or directory
```

Lo que tenga que durar va en un **volumen**, que se comporta como un disco que
se conecta al contenedor:

```bash
docker volume create datos
docker run --rm -v datos:/var/datos python:3.12-slim sh -c 'echo "una nota" > /var/datos/nota.txt'
docker run --rm -v datos:/var/datos python:3.12-slim sh -c 'cat /var/datos/nota.txt'
```

```
datos
una nota
```

El primer contenedor escribió y desapareció; el segundo encontró el archivo. Los
volúmenes se listan con `docker volume ls`, se miran con `docker volume inspect`
y los que no use nadie se borran con `docker volume prune`.

Un volumen es una carpeta del disco del anfitrión, y `docker volume inspect`
dice cuál:

```bash
docker volume inspect datos --format '{{.Mountpoint}}'
```

```
/var/lib/docker/volumes/datos/_data
```

De ahí se sigue algo que hay que tener claro antes de confiarle datos: el
volumen vive en esa máquina y no viaja con la imagen. Cambiar de computador
deja los datos atrás, y moverlos es un trabajo aparte.

El caso que obliga a entenderlos es una base de datos. PostgreSQL guarda lo
suyo en `/var/lib/postgresql/data`, así que basta montar un volumen ahí para
que la base sobreviva al contenedor:

```bash
docker volume create pgdata
docker run -d --name db -e POSTGRES_PASSWORD=ejemplo \
    -v pgdata:/var/lib/postgresql/data postgres:16
docker exec db psql -U postgres -c "create table nota (texto text);"
docker exec db psql -U postgres -c "insert into nota values ('persiste');"
docker rm -f db
docker run -d --name db2 -e POSTGRES_PASSWORD=ejemplo \
    -v pgdata:/var/lib/postgresql/data postgres:16
docker exec db2 psql -U postgres -c "select * from nota;"
```

```
CREATE TABLE
INSERT 0 1
  texto
----------
 persiste
(1 row)
```

El contenedor que creó la tabla ya no existe y la fila sigue ahí. Sin el
volumen, el segundo contenedor inicializa la base desde cero y la consulta
falla con `relation "nota" does not exist`. El proyecto final pide volúmenes
justamente por esto.

## Redes

Una red de Docker es un puente virtual con su propio espacio de nombres de red,
que decide quién alcanza a quién. Una instalación nueva trae tres:

```bash
docker network ls
```

```
NETWORK ID     NAME      DRIVER    SCOPE
3348fa7ac315   bridge    bridge    local
cafd577edf74   host      host      local
04a729d115d0   none      null      local
```

`bridge` es la de por defecto y por ahí los contenedores salen a internet por
NAT; `host` pone al contenedor en la pila de red del anfitrión, sin aislarlo;
y `none` lo deja sin más red que su propio bucle local.

NAT es lo que evitó que las direcciones IPv4 se acabaran: un grupo de máquinas
comparte una dirección pública y se distinguen por el puerto. Con unos 65.535
puertos, de los cuales los primeros 1.024 están reservados, quedan más de 63.000
conversaciones por dirección. Migrar a IPv6 resuelve el problema de raíz, pero
hay enrutadores de veinte años que solo hablan IPv4 y cambiarlos cuesta.

Lo que cambia al crear una red propia es el nombre:

```bash
docker network create app
docker run -d --name db --network app postgres:16
docker run -d --name api --network app -p 8080:8080 mi-api
```

Dentro de una red creada a mano, Docker levanta un servicio de resolución de
nombres que traduce el nombre del contenedor a su dirección. Por eso la cadena
de conexión de la API puede decir `db:5432` y seguir siendo válida aunque el
contenedor se reinicie con otra dirección. En la red `bridge` por defecto eso no
ocurre y hay que andar con direcciones.

Y ahí aparece el otro uso, que es aislar: si la base de datos vive solo en la
red `app` y únicamente la API publica un puerto hacia fuera, la base no es
alcanzable desde la máquina ni desde internet. Un contenedor que ya está
corriendo se suma a una red con `docker network connect app <contenedor>`, sin
volver a crearlo.

## Publicar una imagen

```bash
docker tag hola-mundo usuario/hola-mundo:1.0.0
docker login
docker push usuario/hola-mundo:1.0.0
```

El nombre completo de una imagen es `registro/usuario/imagen:tag`, y Docker
completa lo que falte: si no se escribe el registro asume Docker Hub, y si no se
escribe el tag asume `latest`.

`latest` no es un número de versión, es un tag móvil que apunta a lo último que
se subió. Dos despliegues de la misma línea pueden bajar imágenes distintas, así
que para desplegar va el número de versión, o el digest `sha256`, que es la suma
de verificación de la imagen y señala una y solo una.

Esto mismo es lo que se va a usar para subir las imágenes al registro de Google
Cloud en el proyecto: cambia el registro del nombre, no el procedimiento.

## Lo que Docker solo no resuelve

Con lo visto se levanta un servicio. Lo que no alcanza empieza cuando son
varios:

- Levantar varios servicios con dependencias entre ellos, como una API con su
  base de datos y su caché, pide muchas órdenes manuales.
- Las redes y los volúmenes se crean y se conectan uno por uno.
- Si un contenedor falla, hay que levantarlo a mano.
- Escalar un servicio a varias instancias y repartirles la carga es trabajo
  aparte.
- Coordinar un despliegue sobre más de una máquina queda fuera de lo que Docker
  hace.

De ahí salen las dos piezas que siguen, Docker Compose para describir el
conjunto en un archivo, y Kubernetes para la orquestación sobre varias
máquinas. La palabra viene de donde parece: en una orquesta cada músico sabe
tocar lo suyo y con eso no basta, porque alguien tiene que decidir quién entra,
cuándo y en qué orden para que aquello suene.

## Para seguir

- Las **once actividades** de la sesión están en la página de ejercicios, en el
  mismo orden de los temas. En clase se hicieron las de fundamentos y
  construcción de imágenes; las de ejecución y operación y las de distribución
  quedaron para la casa.
- El [código de la sesión](./codigo/README.md) está completo, con el
  `Dockerfile` y las órdenes para construir, levantar y limpiar.
- Lo que se vio aquí es la base. Quien quiera profundizar tiene por dónde:
  seguridad de imágenes, construcción para varias arquitecturas y el examen de
  capas son los caminos naturales desde este punto.
