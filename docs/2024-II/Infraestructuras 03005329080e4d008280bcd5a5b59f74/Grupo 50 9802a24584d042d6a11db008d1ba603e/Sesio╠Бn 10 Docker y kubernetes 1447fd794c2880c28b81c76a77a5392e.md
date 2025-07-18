# Sesión 10: Docker y kubernetes

# Docker

```bash
docker system prune -a #Limpiar todo el docker accion recomendada en PC publico
docker stop <nombre> #Detetener un docker en ejecución
docker stop $(docker ps -q -a) #Detener todos los contenedores
docker ps #Todos los contenedores disponibles
docker image ls #Todas imagenes
docker image rm <tag> #Borrar una imagen
docker build -t <tag> . #Crear una imagen

#Lanzar contenedor
 docker run -d -p 8080:3000 -p 3306:3306 miapp:latest
 docker ps
 
 #COn nombre
  docker run -d -p 8080:3000 -p 3306:3306 --name miapp-contenedor miapp:latest
 
 #COnsultar
 """
 localhost:8080/clients
 localhost:8080/invoices/id  id es 1 o 2
 
 docker ps -a #Todos los que están
```

# Docker compose

```bash
docker compose up -d .
docker compose down
```

# Kubernetes

```bash
kubectl apply -f <archivo>.yml
kubectl get pods
kubectl get services
```