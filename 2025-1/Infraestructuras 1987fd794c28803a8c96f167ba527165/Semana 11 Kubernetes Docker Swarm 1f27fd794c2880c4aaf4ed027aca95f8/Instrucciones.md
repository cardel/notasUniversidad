# Crear un Deployment

Un Pod en Kubernetes es un grupo de uno o más contenedores, asociados con propósitos de administración y redes. El Pod en este tutorial tiene solo un contenedor. Un Deployment en Kubernetes verifica la salud del Pod y reinicia su contenedor si este es eliminado. Los Deployments son la manera recomendada de manejar la creación y escalación.

Ejecutar el comando `kubectl create` para crear un Deployment que maneje un Pod. El Pod ejecuta un contenedor basado en la imagen proveida por Docker.

```bash
kubectl create deployment hello-node --image=registry.k8s.io/echoserver:1.4
```

Ver el Deployment:

```bash
kubectl get deployments
```

El resultado es similar a:

```
NAME         READY   UP-TO-DATE   AVAILABLE   AGE
hello-node   1/1     1            1           1m
```

Ver el Pod:

```bash
kubectl get pods
```

El resultado es similar a:

```
NAME                          READY     STATUS    RESTARTS   AGE
hello-node-5f76cf6ccf-br9b5   1/1       Running   0          1m
```

Ver los eventos del clúster:

```bash
kubectl get events
```

Ver la configuración kubectl:

```bash
kubectl config view
```

**Nota:**  
Para más información sobre el comando `kubectl`, ver [kubectl overview](#).

# Crear un Service

Por defecto, el Pod es accedido por su dirección IP interna dentro del clúster de Kubernetes, para hacer que el contenedor `hello-node` sea accesible desde afuera de la red virtual Kubernetes, se debe exponer el Pod como un Service de Kubernetes.

Exponer el Pod a la red pública de internet utilizando el comando `kubectl expose`:

```bash
kubectl expose deployment hello-node --type=LoadBalancer --port=8080
```

El flag `--type=LoadBalancer` indica que se quiere exponer el Service fuera del clúster.

Ver el Service creado:

```bash
kubectl get services
```

El resultado es similar a:

```
NAME         TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
hello-node   LoadBalancer   10.108.144.78   <pending>     8080:30369/TCP   21s
kubernetes   ClusterIP      10.96.0.1       <none>        443/TCP          23m
```

Para los proveedores Cloud que soportan balanceadores de carga, una dirección IP externa será provisionada para acceder al servicio, en Minikube, el tipo `LoadBalancer` permite que el servicio sea accesible a través del comando `minikube service`.

Ejecutar el siguiente comando:

```bash
minikube service hello-node
```

**Solo en el entorno de Katacoda:**  
Hacer clic sobre el símbolo `+`, y luego en `Select port to view on Host 1`.

**Solo en el entorno de Katacoda:**  
Anotar el puerto de 5 dígitos ubicado al lado del valor de `8080` en el resultado de servicios. Este número de puerto es generado aleatoriamente y puede ser diferente al indicado en el ejemplo. Escribir el número de puerto en el cuadro de texto y hacer clic en `Display Port`. Usando el ejemplo anterior, usted escribiría `30369`.

Esto abre una ventana de navegador que contiene la aplicación y muestra el mensaje "Hello World".

# Habilitar Extensiones

Minikube tiene un conjunto de Extensiones que pueden ser habilitados y desahabilitados en el entorno local de Kubernetes.

Listar las extensiones soportadas actualmente:

```bash
minikube addons list
```

El resultado es similar a:

```
addon-manager: enabled
dashboard: enabled
default-storageclass: enabled
efk: disabled
freshpod: disabled
gvisor: disabled
helm-tiller: disabled
ingress: disabled
ingress-dns: disabled
logviewer: disabled
metrics-server: disabled
nvidia-driver-installer: disabled
nvidia-gpu-device-plugin: disabled
registry: disabled
registry-creds: disabled
storage-provisioner: enabled
storage-provisioner-gluster: disabled
```

Habilitar una extensión, por ejemplo, `metrics-server`:

```bash
minikube addons enable metrics-server
```

El resultado es similar a:

```
metrics-server was successfully enabled
```

Ver el Pod y Service creados:

```bash
kubectl get pod,svc -n kube-system
```

El resultado es similar a:

```
NAME                                        READY     STATUS    RESTARTS   AGE
pod/coredns-5644d7b6d9-mh9ll                1/1       Running   0          34m
pod/coredns-5644d7b6d9-pqd2t                1/1       Running   0          34m
pod/metrics-server-67fb648c5                1/1       Running   0          26s
pod/etcd-minikube                           1/1       Running   0          34m
pod/influxdb-grafana-b29w8                  2/2       Running   0          26s
pod/kube-addon-manager-minikube             1/1       Running   0          34m
pod/kube-apiserver-minikube                 1/1       Running   0          34m
pod/kube-controller-manager-minikube        1/1       Running   0          34m
pod/kube-proxy-rnlps                        1/1       Running   0          34m
pod/kube-scheduler-minikube                 1/1       Running   0          34m
pod/storage-provisioner                     1/1       Running   0          34m

NAME                           TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)             AGE
service/metrics-server         ClusterIP   10.96.241.45    <none>        80/TCP              26s
service/kube-dns               ClusterIP   10.96.0.10      <none>        53/UDP,53/TCP       34m
service/monitoring-grafana     NodePort    10.99.24.54     <none>        80:30002/TCP        26s
service/monitoring-influxdb    ClusterIP   10.111.169.94   <none>        8083/TCP,8086/TCP   26s
```

Deshabilitar `metrics-server`:

```bash
minikube addons disable metrics-server
```

El resultado es similar a:

```
metrics-server was successfully disabled
```

# Limpieza

Ahora se puede eliminar los recursos creados en el clúster:

```bash
kubectl delete service hello-node
kubectl delete deployment hello-node
```

**Opcional**, detener la máquina virtual de Minikube:

```bash
minikube stop
```

**Opcional**, eliminar la máquina virtual de Minikube:

```bash
minikube delete
```
