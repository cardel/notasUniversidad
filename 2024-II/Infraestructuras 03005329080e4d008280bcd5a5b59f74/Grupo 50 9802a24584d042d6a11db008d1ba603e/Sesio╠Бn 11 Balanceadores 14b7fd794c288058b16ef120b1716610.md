# Sesión 11: Balanceadores

```bash
kubectl -f apply deployment.yaml
kubectl get pods

kubectl -f apply service.yaml
kubectl get services

#Exponer el puerto
kubectl port-forward services/my-nginx-service 8080:80
# visitar localhost:8080 en el navegador

minikube addons enable metrics-server

minikube dashboard
```

# Prueba

```bash
sh estres.sh
	
```

# Docker - swarm

```bash
docker swarm init
docker network create --driver overlay mi_redcita
docker network ls

docker service create --name servicio_nginx --network mi_redicta -p 80:80 nginx
docker service ls
docker service scale servicio_nginx=3
docker service ls

#Unerse
dockeXr swarm join --token SWMTKN-1-2zwfe4lgy2op2mkhoddy73wvnbeh47zi00thkrbod3x6oiugip-a12xk1bgjhc3rmrg23ydjso1s 10.38.3.52:2377

docker swarm join-token manager

http://pastebin/XkqyLUEF

docker node promote <hostname>

docker swarm leave --force
```