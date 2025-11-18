
Vamos a lanzar el minikube

```bash
 minikube start
```

Esto va a inicializar el cluster, para verificar que el nodo maestro está corriendo hacemos

```bash
docker ps
```

Con esto vemos corriendo el contenedor que hace de nodo maestro

```bash
5eeed819be57   gcr.io/k8s-minikube/kicbase:v0.0.46   "/usr/local/bin/entr…"   57 seconds ago   Up 56 seconds   127.0.0.1:32768->22/tcp, 127.0.0.1:32769->2376/tcp, 127.0.0.1:32770->5000/tcp, 127.0.0.1:32771->8443/tcp, 127.0.0.1:32772->32443/tcp   minikube

```

# Ejemplo de despliegue

Vamos a lanzar minikube

```bash
minikube start
```

Esto va a inicializar el cluster. Para verificar que el nodo maestro está corriendo hacemos:

```bash
docker ps
```

Con esto vemos corriendo el contenedor que hace de nodo maestro:

```bash
5eeed819be57   gcr.io/k8s-minikube/kicbase:v0.0.46   "/usr/local/bin/entr…"   57 seconds ago   Up 56 seconds   127.0.0.1:32768->22/tcp, 127.0.0.1:32769->2376/tcp, 127.0.0.1:32770->5000/tcp, 127.0.0.1:32771->8443/tcp, 127.0.0.1:32772->32443/tcp   minikube
```


- **127.0.0.1:32768→22/tcp**: Servicio SSH para acceso remoto al nodo de Minikube
- **127.0.0.1:32769→2376/tcp**: Puerto de Docker daemon para comunicación con el motor de contenedores
- **127.0.0.1:32770→5000/tcp**: Registry de Docker local para imágenes de contenedores
- **127.0.0.1:32771→8443/tcp**: Kubernetes API server (puerto principal para gestionar el cluster)
- **127.0.0.1:32772→32443/tcp**: Puerto adicional para servicios Kubernetes (NodePort services)

# Aplicación

Tenemos una aplicación que consulta una base de datos en mysql escrita en javascript (nodejs)


## Docker compose

```yaml
version: '3.8'

services:
  app:
    image: node:16
    working_dir: /usr/src/app
    volumes:
      - ./app:/usr/src/app
    ports:
      - "3000:3000"
    command: sh -c "npm install && npm start"
    depends_on:
      - db

  db:
    image: mysql:5.7
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: testdb
      MYSQL_USER: user
      MYSQL_PASSWORD: password
    ports:
      - "3306:3306"
    volumes:
      - db_data:/var/lib/mysql

  nginx:
    image: nginx:alpine
    ports:
      - "8080:80"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - app

volumes:
  db_data:


```

Como se puede observar vamos a lanzar
1. Aplicación en Nodejs puerto 3000
2. Proxy inverso (nginx) puerto 80
3. Base de datos en Mysql (3306

Nos ubicamos en la carpeta que tiene el docker-compose.yml y ejecutamos

```bash
docker compose up -d
```

Levanta el servidor de nginx en localhost:8080

Para parar 

```bash
docker compose down
```


# Kubernetes

## Deployments

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: app
  template:
    metadata:
      labels:
        app: app
    spec:
      containers:
        - name: app
          image: node:16
          workingDir: /usr/src/app
          command: ["sh", "-c", "npm install && npm start"]
          ports:
            - containerPort: 3000
          volumeMounts:
            - mountPath: /usr/src/app
              name: app-code
      volumes:
        - name: app-code
          hostPath:
            path: /app
            type: Directory


```

Aqui estamos indicando como se instala la aplicación

```yaml

apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: nginx
          image: nginx:alpine
          ports:
            - containerPort: 80
          volumeMounts:
            - name: nginx-config
              mountPath: /etc/nginx/conf.d/default.conf
              subPath: default.conf
      volumes:
        - name: nginx-config
          configMap:
            name: nginx-config


```

Aqui le estoy diciendo que ell archivo de configuración se debe copiar en el contenedor

## Services

```yaml

apiVersion: v1
kind: Service
metadata:
  name: app-service
spec:
  selector:
    app: app
  ports:
    - protocol: TCP
      port: 3000
      targetPort: 3000
  type: ClusterIP

```

El servicio de app se expone en el puerto 3000

```yaml
apiVersion: v1
kind: Service
metadata:
  name: mysql-service
spec:
  selector:
    app: mysql
  ports:
    - protocol: TCP
      port: 3306
      targetPort: 3306
  type: ClusterIP

```

El servicio de mysql se expone en el puerto 3306

```yaml

apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  selector:
    app: nginx
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
  type: NodePort

```

Aqui lo expongo en el puerto 80

## Statefulset y configmap

```yaml

apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mysql
spec:
  selector:
    matchLabels:
      app: mysql
  serviceName: "mysql"
  replicas: 1
  template:
    metadata:
      labels:
        app: mysql
    spec:
      containers:
        - name: mysql
          image: mysql:5.7
          env:
            - name: MYSQL_ROOT_PASSWORD
              value: root
            - name: MYSQL_DATABASE
              value: testdb
            - name: MYSQL_USER
              value: user
            - name: MYSQL_PASSWORD
              value: password
          ports:
            - containerPort: 3306
          volumeMounts:
            - name: mysql-data
              mountPath: /var/lib/mysql
  volumeClaimTemplates:
    - metadata:
        name: mysql-data
      spec:
        accessModes: ["ReadWriteOnce"]
        resources:
          requests:
            storage: 1Gi

```

Estoy especificando que hay un volumen de tamaño 1GB que contiene los archivos de la base de datos

```yaml

apiVersion: v1
kind: ConfigMap
metadata:
  name: nginx-config
data:
  default.conf: |
    upstream app {
        server app-service:3000;
    }

    server {
        listen 80;

        location / {
            proxy_pass http://app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
    }

```

Este config aplica la configuración default.conf esto permite cada vez que se inicia el servicio se aplica automaticamente esta configuracion.

## Desplegar

Va a ingresar a la carpeta kubernetes

```bash
kubectl apply -f .
```

Va aplicar las configuraciones de los archivos yaml

Para ver los pods

```bash
kubectl get pods
NAME                                READY   STATUS              RESTARTS       AGE
app-deployment-6994f5bd48-4nqc5     0/1     ContainerCreating   0              189d
app-deployment-6994f5bd48-m7c8l     0/1     ContainerCreating   0              189d
app-deployment-6994f5bd48-mgrtv     0/1     ContainerCreating   0              189d
hello-node-58dc948877-59r2s         0/1     ImagePullBackOff    0              189d
mysql-0                             1/1     Running             1 (188d ago)   189d
nginx-deployment-65d5b8cd9b-6mqx6   1/1     Running   
```

Nos dice el estado de los pods, deben estar en running

```bash
kubectl get services
NAME            TYPE           CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
app-service     ClusterIP      10.110.209.140   <none>        3000/TCP         189d
hello-node      LoadBalancer   10.105.166.183   <pending>     8080:30877/TCP   189d
kubernetes      ClusterIP      10.96.0.1        <none>        443/TCP          189d
mysql-service   ClusterIP      10.97.116.108    <none>        3306/TCP         189d
nginx-service   NodePort       10.108.217.246   <none>        80:30575/TCP     189d
```

Aqui nos dice que servicios están accesibles

```bash
minikube service nginx-service

```

Esto nos va a mostrar la url donde esta el servicio

```bash
┌───────────┬───────────────┬─────────────┬───────────────────────────┐
│ NAMESPACE │     NAME      │ TARGET PORT │            URL            │
├───────────┼───────────────┼─────────────┼───────────────────────────┤
│ default   │ nginx-service │ 80          │ http://192.168.49.2:30575 │
└───────────┴───────────────┴─────────────┴───────────────────────────
```
