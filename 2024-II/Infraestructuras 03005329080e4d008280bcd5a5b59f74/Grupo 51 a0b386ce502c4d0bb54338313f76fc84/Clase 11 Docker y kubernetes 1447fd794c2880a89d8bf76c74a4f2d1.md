# Clase 11: Docker y kubernetes

# Docker

```bash
#Problemas con el PULL
docker logout
docker login

docker stop $(docker ps -q -a)
docker system prune -a

#COnstruir la imagen
docker image build -t <tag-imagen> .

#Ejecutar
docker run -d --name <tag-app> -p <host>:<contenedor> <tag-imagen>
```

Acceder 

- [localhost:8080/clients](http://localhost:8080/clients)
- [localhost:8080/invoices/1](http://localhost:8080/invoices/1)
- [localhost:8080/invoices/2](http://localhost:8080/invoices/2)

## Docker compose

```bash
docker compose up -d
docker compose down
```

Acceder

- [localhost:8080](http://localhost:8080)
- [localhost:3000](http://localhost:3000)

## Kubernetes

```bash
minikube delete
minikube start

#Seguir guia de clase

docker logout #para salir de computador publico
```