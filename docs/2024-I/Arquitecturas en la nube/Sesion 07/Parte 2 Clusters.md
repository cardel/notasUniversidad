# Parte 2: Clusters

# Kubernetes

- Plataforma que permite implementar, escalar y administrar aplicaciones contenedores
- Ofrece la posibilidad de aislar grupos de contenedores en redes virtual

### Cluster

- Es un conjunto de máquinas que ejecutan aplicaciones en contenedores
- Nodo maestro: Gestiona el cluster y coordina las operaciones. API, Programador de tareas, administrador de controlar, etcd (almacenar los datos del cluster de forma persistente)
- Nodo de trabajo: Se comunica con el nodo maestro. Kubelet que se comunica con el nodo maestro y proxy que hace el balanceo de carga

### Pods

Una unidad de despliegue que puede contener uno o más contenedores que comparten recursos y almacenamiento

### Servicios

Es una unidad que define una política de acceso a los pods, encapsula los pods.

### Deployments

Es un recurso que administra los pods.

### Volúmenes

Un directorio en el cual se monta un contenedor y permite acceder a una unidad física (local o en la nube)

![kubernetes-cluster-architecture.svg](kubernetes-cluster-architecture.svg)

- api server es el punto de entrada al cluster
- Scheduler Asignar las políticas de acceso a los clústeres
- controller manager: Maneja controladores para los pods, ofrece replicaciones, etc
- etcd: Es una base de datos distribuida que almacena los datos del cliente
- kubelet recibe las instrucciones del API server y gestiona los pods
- Kube proxy: Balanceo de carga y maneja la red interna del nodo
- CRI: Container runtime: Ejecuta los contenedores del nodo (docker)

### Instalación

[https://kubernetes.io/es/docs/tasks/tools/included/install-kubectl-windows/](https://kubernetes.io/es/docs/tasks/tools/included/install-kubectl-windows/) 

[https://minikube.sigs.k8s.io/docs/](https://minikube.sigs.k8s.io/docs/)

## Instalación

### Requisitos

- **Sistema Operativo**: Minikube es compatible con Linux, macOS y Windows.
- **Virtualización**: Necesitas un hipervisor compatible, como VirtualBox o Docker. Para macOS y Windows, puedes usar HyperKit o Hyper-V.

### Pasos de Instalación

1. **Instalar Minikube**
    - **En macOS**: Utiliza Homebrew para instalar Minikube.
        
        ```bash
        brew install minikube
        
        ```
        
    - **En Linux**: Descarga el binario desde la página de lanzamientos de Minikube.
        
        ```bash
        curl -LO <https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64>
        sudo install minikube-linux-amd64 /usr/local/bin/minikube
        
        ```
        
    - **En Windows**: Usa el instalador de Minikube desde la página de lanzamientos de Minikube.
        
        ```powershell
        choco install minikube
        
        ```
        
2. **Instalar kubectl**
    
    `kubectl` es la herramienta de línea de comandos para interactuar con Kubernetes. Puedes instalarlo usando el siguiente comando:
    
    - **En macOS**:
        
        ```bash
        brew install kubectl
        
        ```
        
    - **En Linux**:
        
        ```bash
        curl -LO "<https://dl.k8s.io/release/v1.27.1/bin/linux/amd64/kubectl>"
        chmod +x ./kubectl
        sudo mv ./kubectl /usr/local/bin/kubectl
        
        ```
        
    - **En Windows**:
        
        ```powershell
        choco install kubectl
        ```
        

### Iniciar Minikube

Para iniciar un clúster de Minikube, utiliza el siguiente comando:

```bash
minikube start
```

[https://gist.github.com/cardel/4242426fd70d4d92ef5622b543707063](https://gist.github.com/cardel/4242426fd70d4d92ef5622b543707063)

### Ejemplos de uso

- https://docs.aws.amazon.com/es_es/eks/latest/userguide/sample-deployment.html
- [https://learn.microsoft.com/en-us/azure/aks/tutorial-kubernetes-deploy-cluster?tabs=azure-cli](https://learn.microsoft.com/en-us/azure/aks/tutorial-kubernetes-deploy-cluster?tabs=azure-cli)
- [https://cloud.google.com/kubernetes-engine/docs/deploy-app-cluster](https://cloud.google.com/kubernetes-engine/docs/deploy-app-cluster)