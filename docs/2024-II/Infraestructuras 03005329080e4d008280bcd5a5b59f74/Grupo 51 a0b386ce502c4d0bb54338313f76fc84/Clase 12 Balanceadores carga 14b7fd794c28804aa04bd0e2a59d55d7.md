# Clase 12: Balanceadores carga

```bash
#Limpiar (PC publicos)
minikube stop
docker stop $(docker ps -a -q)
docker system prune -a
minikube delete

#Arrancar el servidor de kubernetes
minikube start
docker ps

#LEvantar los servicios
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml

kubectl get pods
kubectl get services

kubectl port-forward services/my-nginx-service 8080:80

#Web 
minikube addons enable metrics-server
minikube dashboard

bash estres.sh
```

# Docker swarm

```bash
docker swarm leave
docker swarm init
docker network create --driver overlay mi_red

docker service ls
docker node ls

docker swarm join --token SWMTKN-1-5eujnetstzwyes4ea4ic6rpod59svgajvuzdpfhh77srywdrpt-97oyh4ikczf2emr2a7byu555o 172.16.0.49:2377

```