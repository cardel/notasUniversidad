# Código de la sesión

El servicio que se construyó y se levantó en clase, con su `Dockerfile`.

| Carpeta | Qué hace |
|---|---|
| `01-hola-mundo` | Servicio Flask mínimo que responde el nombre del contenedor y la versión |

## Construir y levantar

```bash
cd 01-hola-mundo
docker build -t hola-mundo .
docker run -d -p 8080:5000 --name hola hola-mundo
curl http://localhost:8080
```

```
{"host":"9058e5d763be","mensaje":"Hola desde el contenedor","version":"0.1.0"}
```

El `host` que devuelve es el nombre de máquina dentro del contenedor, que es
el identificador corto de ese contenedor y cambia cada vez que se levanta uno
nuevo.

## Limpiar

```bash
docker stop hola && docker rm hola
docker rmi hola-mundo
```
