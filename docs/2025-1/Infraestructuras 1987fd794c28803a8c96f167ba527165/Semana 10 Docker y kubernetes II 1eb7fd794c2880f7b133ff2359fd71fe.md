# Semana 10: Docker y kubernetes II

# Ejercicio

[kube.zip](kube.zip)

# Volumenes

- Permite conectar una carpeta en el equipo host (local) con una del contenedor
- Util para intercambiar archivos con el container

```jsx
services:
  nginx:
    image: nginx:1.27.5-alpine
    volumes:
      - ./www/:/usr/share/nginx/html/

    ports:
      - "8080:80"
```

# Docker compose

Docker Compose es una herramienta que permite definir y ejecutar aplicaciones multi-contenedor utilizando un archivo YAML. En este archivo, puedes describir los servicios que componen tu aplicación, sus imágenes, volúmenes, redes y dependencias. Esto facilita la orquestación de aplicaciones complejas con múltiples contenedores. A continuación, se presenta un ejemplo con tres servicios que tienen dependencias y volúmenes, seguido de una explicación detallada:

```yaml
version: '3.9'
services:
  db:
    image: postgres:15.3-alpine
    volumes:
      - db_data:/var/lib/postgresql/data
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: mydatabase

  backend:
    image: node:18-alpine
    working_dir: /app
    volumes:
      - ./backend:/app
    command: ["npm", "run", "start"]
    environment:
      DATABASE_URL: postgres://user:password@db:5432/mydatabase
    depends_on:
      - db

  frontend:
    image: nginx:1.27.5-alpine
    volumes:
      - ./frontend:/usr/share/nginx/html
    ports:
      - "8080:80"
    depends_on:
      - backend

volumes:
  db_data:

```

### Explicación de componentes:

1. **`db` (Base de datos):**
    - **Imagen:** Utiliza la imagen oficial de PostgreSQL.
    - **Volumenes:** Monta el volumen `db_data` para persistir los datos de la base de datos entre reinicios del contenedor.
    - **Variables de entorno:** Define credenciales para el usuario, contraseña y nombre de la base de datos.
    - Este servicio actúa como la base de datos central para la aplicación.
2. **`backend` (Servidor backend):**
    - **Imagen:** Usa una imagen oficial de Node.js para ejecutar el código del servidor.
    - **Volumenes:** Monta el directorio local `./backend` en el contenedor para facilitar el desarrollo.
    - **Comando:** Ejecuta el servidor con `npm run start`.
    - **Variables de entorno:** Se configura la URL de la base de datos para que el backend pueda conectarse al servicio `db`.
    - **Dependencia:** Depende de `db`, lo que asegura que la base de datos esté lista antes de que este servicio se inicie.
3. **`frontend` (Servidor web):**
    - **Imagen:** Utiliza una imagen de Nginx para servir los archivos estáticos del frontend.
    - **Volumenes:** Monta el directorio local `./frontend` en el contenedor para servir la aplicación web.
    - **Puertos:** Expone el puerto `8080` del host y lo mapea al puerto `80` del contenedor.
    - **Dependencia:** Depende de `backend`, asegurando que el backend esté en funcionamiento antes de iniciar.
4. **Volúmenes:**
    - Se define un volumen llamado `db_data` para la persistencia de datos de la base de datos. Esto asegura que los datos no se pierdan al detener o eliminar el contenedor.

Este ejemplo demuestra cómo usar Docker Compose para conectar servicios con dependencias, configurar volúmenes para persistencia y servir distintos componentes de una aplicación de manera coordinada.

### Componentes teóricos de Docker Compose

Docker Compose es una herramienta poderosa que permite la definición y orquestación de aplicaciones multicontenedor. A continuación, se explican los principales componentes teóricos de Docker Compose:

1. **Versión (`version`):**
    - Especifica la versión del formato del archivo `docker-compose.yml`.
    - Determina las características disponibles para la configuración de los servicios.
    - Ejemplo: `version: '3.9'` es una de las versiones más recientes y ampliamente utilizadas.
2. **Servicios (`services`):**
    - Define los contenedores que componen la aplicación.
    - Cada servicio representa un contenedor con su propia configuración, como la imagen base, comandos, puertos, volúmenes y variables de entorno.
    - Los servicios pueden depender entre sí, lo que asegura un orden de inicio específico.
3. **Imágenes (`image`):**
    - Indica la imagen de Docker que se usará para crear el contenedor.
    - Puede ser una imagen oficial de Docker Hub o una imagen personalizada.
4. **Volúmenes (`volumes`):**
    - Permiten persistir datos entre reinicios o eliminaciones de contenedores.
    - Pueden usarse para compartir datos entre el host y los contenedores, o entre múltiples contenedores.
    - Se define tanto en los servicios como en el nivel global del archivo Compose.
5. **Redes (`networks`):**
    - Configuran la conectividad entre los contenedores.
    - Por defecto, Docker Compose crea una red para conectar todos los servicios, pero también se pueden definir redes personalizadas.
6. **Comandos (`command`):**
    - Especifica el comando que se ejecutará al iniciar el contenedor.
    - Permite personalizar el comportamiento de las imágenes base.
7. **Variables de entorno (`environment`):**
    - Define configuraciones específicas del entorno, como credenciales, URLs o valores de configuración.
    - Estas variables se exponen a los contenedores como parte de su entorno de ejecución.
8. **Puertos (`ports`):**
    - Configuran el mapeo de puertos entre el host y los contenedores.
    - Permiten exponer servicios dentro de los contenedores al sistema anfitrión.
9. **Dependencias (`depends_on`):**
    - Establece el orden de inicio de los servicios.
    - Asegura que un servicio no se inicie hasta que sus dependencias estén listas.
10. **Construcción (`build`):**
    - Define cómo construir una imagen personalizada desde un archivo `Dockerfile`.
    - Es útil cuando necesitas crear una imagen con configuraciones específicas para tu aplicación.

Docker Compose simplifica la gestión de aplicaciones complejas con múltiples contenedores, proporcionando una forma clara y estructurada de definir todos los aspectos necesarios para su ejecución.

# Kubernetes

### Componentes principales de Kubernetes y su explicación:

1. **Nodo (Node):**
    - Es una máquina física o virtual que ejecuta las aplicaciones en contenedores. Cada nodo contiene los componentes necesarios para ejecutar pods y está controlado por el plano de control (control plane).
    - Componentes principales en un nodo:
        - **Kubelet:** Agente que gestiona los pods y asegura que los contenedores estén funcionando.
        - **Kube-proxy:** Gestiona las reglas de red para permitir la comunicación dentro y fuera del clúster.
        - **Contenedor runtime:** Software que ejecuta los contenedores, como Docker o containerd.
2. **Pod:**
    - Es la unidad más pequeña e indivisible en Kubernetes. Un pod puede contener uno o varios contenedores que comparten red y almacenamiento.
    - Los pods son efímeros, lo que significa que están diseñados para ser reemplazados automáticamente en caso de fallos.
3. **Cluster:**
    - Es un conjunto de nodos que trabajan juntos para ejecutar aplicaciones en contenedores. Un clúster incluye tanto nodos de trabajo como los componentes del plano de control.
4. **Plano de control (Control Plane):**
    - Es el cerebro de Kubernetes y es responsable de administrar el clúster.
    - Componentes principales:
        - **API Server:** Proporciona la interfaz para interactuar con Kubernetes. Todas las solicitudes (ya sea desde usuarios, herramientas o componentes internos) pasan por aquí.
        - **Etcd:** Base de datos distribuida que almacena toda la información del clúster, incluyendo el estado deseado del sistema.
        - **Controller Manager:** Monitorea el estado del clúster y asegura que los recursos cumplan con el estado deseado (por ejemplo, reiniciar pods fallidos).
        - **Scheduler:** Asigna pods a nodos según los recursos disponibles y las necesidades de los pods.
5. **Namespace:**
    - Permite dividir el clúster en espacios lógicos para organizar y gestionar recursos. Es útil para separar entornos (como desarrollo, pruebas y producción) dentro de un mismo clúster.
6. **Servicios (Services):**
    - Proporcionan una forma estable de acceder a un conjunto de pods. Los servicios abstraen la ubicación de los pods, asegurando que las aplicaciones puedan comunicarse incluso si los pods cambian de nodo o son reemplazados.
    - Tipos de servicios:
        - **ClusterIP:** Acceso interno dentro del clúster.
        - **NodePort:** Expone el servicio en un puerto específico del nodo.
        - **LoadBalancer:** Utiliza un balanceador de carga externo para exponer el servicio fuera del clúster.
7. **Volúmenes (Volumes):**
    - Proporcionan almacenamiento persistente a los contenedores en los pods. A diferencia del almacenamiento temporal de los contenedores, los volúmenes pueden sobrevivir a reinicios de los pods.
8. **ConfigMaps y Secrets:**
    - **ConfigMaps:** Almacenan configuraciones no sensibles en forma de pares clave-valor.
    - **Secrets:** Almacenan información sensible como contraseñas o claves API, de forma segura.
9. **Deployments:**
    - Son objetos que gestionan la implementación y el ciclo de vida de los pods. Permiten actualizaciones controladas y garantizan que el número deseado de pods esté siempre ejecutándose.
10. **Ingress:**
    - Gestiona el acceso externo a los servicios dentro del clúster, proporcionando funcionalidades como balanceo de carga, enrutamiento basado en nombres de host y manejo de certificados SSL.
11. **ReplicaSets:**
    - Aseguran que un número específico de réplicas de un pod esté en ejecución en todo momento. Los ReplicaSets son gestionados automáticamente por los Deployments.
12. **DaemonSets:**
    - Aseguran que un pod específico se ejecute en todos los nodos (o en un subconjunto de nodos) del clúster. Esto es útil para tareas como monitoreo o registro.
13. **StatefulSets:**
    - Gestionan aplicaciones con estado, asegurando que cada pod tenga una identidad persistente y acceso a almacenamiento dedicado.
14. **Jobs y CronJobs:**
    - **Jobs:** Ejecutan tareas específicas una vez y aseguran su finalización.
    - **CronJobs:** Programan la ejecución de Jobs en intervalos definidos, similar a las tareas cron en sistemas Unix.
15. **Horizontal Pod Autoscaler (HPA):**
    - Ajusta automáticamente el número de pods en función de métricas como el uso de CPU o memoria.
16. **Network Policies:**
    - Definen reglas para controlar el tráfico de red entre los pods y otros recursos dentro del clúster.

Estos componentes trabajan juntos para proporcionar una plataforma robusta y escalable para la administración de aplicaciones en contenedores. Kubernetes automatiza tareas como la implementación, el escalado y la recuperación ante fallos, proporcionando una solución integral para la orquestación de contenedores.

## Lanzar kubernetes

```bash
minikube stop
minikube delete #Borrar todo si es necesario
minikube start
docker ps 

kubectl get pods
kubectl get services
```

Debe aparecer

```bash
309318ce815b   gcr.io/k8s-minikube/kicbase:v0.0.45   "/usr/local/bin/entr…"   4 months ago   Up About a minute   127.0.0.1:32768->22/tcp, 127.0.0.1:32769->2376/tcp, 127.0.0.1:32770->5000/tcp, 127.0.0.1:32771->8443/tcp, 127.0.0.1:32772->32443/tcp   minikub
```

Este es un resultado que se obtiene al ejecutar el comando `docker ps` después de iniciar Minikube. A continuación, se desglosa y explica cada parte de esta salida:

1. **`309318ce815b` (Container ID):**
    - Este es el identificador único del contenedor que Minikube está utilizando. Cada contenedor en Docker tiene un ID único que lo identifica dentro del sistema.
2. **`gcr.io/k8s-minikube/kicbase:v0.0.45` (Imagen):**
    - Representa la imagen utilizada para crear el contenedor. En este caso, la imagen `kicbase:v0.0.45` está alojada en el registro de Google Container Registry (`gcr.io`) bajo el proyecto de Minikube (`k8s-minikube`).
3. **`"/usr/local/bin/entr…"` (Comando):**
    - Este es el comando que el contenedor está ejecutando al iniciarse. En este caso, el comando está truncado, pero hace referencia al binario principal que controla el comportamiento del contenedor.
4. **`4 months ago` (Creación):**
    - Indica cuándo se creó el contenedor (hace 4 meses, en este caso). Esto puede referirse al momento en que se descargó y preparó la imagen para su uso.
5. **`Up About a minute` (Estado):**
    - Este estado indica que el contenedor está en ejecución (activo) y que ha estado funcionando durante aproximadamente un minuto.
6. **`127.0.0.1:32768->22/tcp, 127.0.0.1:32769->2376/tcp, 127.0.0.1:32770->5000/tcp, 127.0.0.1:32771->8443/tcp, 127.0.0.1:32772->32443/tcp` (Puertos):**
    - Estos son los puertos expuestos por el contenedor y cómo están mapeados al host local (`127.0.0.1`):
        - **`127.0.0.1:32768->22/tcp`:** El puerto `22` (generalmente utilizado para SSH) del contenedor está mapeado al puerto `32768` del host.
        - **`127.0.0.1:32769->2376/tcp`:** El puerto `2376` (frecuentemente utilizado para la API de Docker segura) del contenedor está mapeado al puerto `32769` del host.
        - **`127.0.0.1:32770->5000/tcp`:** El puerto `5000` (usado típicamente para registros Docker locales) del contenedor está mapeado al puerto `32770` del host.
        - **`127.0.0.1:32771->8443/tcp`:** El puerto `8443` (usado para servicios HTTPS) del contenedor está mapeado al puerto `32771` del host.
        - **`127.0.0.1:32772->32443/tcp`:** El puerto `32443` del contenedor está mapeado al puerto `32772` del host. Este puerto puede estar relacionado con un servicio Kubernetes específico, como el plano de control.
7. **`minikub` (Nombre del contenedor):**
    - Este es el nombre asignado al contenedor por Docker. En este caso, el contenedor se llama `minikub`, lo que indica que está relacionado con el entorno de Minikube.

En resumen, esta salida describe un contenedor en ejecución que utiliza la imagen `kicbase:v0.0.45` y que está configurado para exponer varios puertos para comunicación entre el host y el contenedor. Este contenedor es parte del entorno de Minikube, que se utiliza para ejecutar un clúster de Kubernetes local.

Existen varias alternativas a Minikube para ejecutar Kubernetes en entornos locales o de desarrollo. Algunas de las más populares incluyen:

- **Kind (Kubernetes IN Docker):** Usa contenedores Docker para ejecutar clústeres de Kubernetes. Es una herramienta ligera y fácil de configurar, ideal para pruebas y desarrollo.
- **MicroK8s:** Una solución ligera y de instalación rápida para ejecutar Kubernetes localmente, desarrollada por Canonical. Es adecuada tanto para entornos de desarrollo como de producción.
- **K3s:** Una versión simplificada y optimizada de Kubernetes, ideal para dispositivos con recursos limitados o aplicaciones edge.
- **Docker Desktop Kubernetes:** Incluye una opción para habilitar Kubernetes directamente en Docker Desktop, simplificando la configuración para entornos locales.
- **Rancher Desktop:** Una herramienta de escritorio que permite ejecutar Kubernetes localmente, con soporte para múltiples versiones de Kubernetes y configuraciones personalizables.
- **OpenShift Local (anteriormente CRC - CodeReady Containers):** Proporciona una versión local de OpenShift, que incluye Kubernetes junto con características adicionales de OpenShift.

Estas alternativas ofrecen diferentes enfoques para ejecutar Kubernetes, dependiendo de las ne[http://127.0.0.1:35759/api/v1/namespaces/kubernetes-dashboard/services/http:kubernetes-dashboard:/proxy/](http://127.0.0.1:35759/api/v1/namespaces/kubernetes-dashboard/services/http:kubernetes-dashboard:/proxy/)cesidades específicas del usuario y los recursos disponibles.

```bash
minikube addons enable metrics-server
minikube dashboard --url
```

Un proxy inverso es un servidor que actúa como intermediario entre los clientes y uno o varios servidores backend. A diferencia de un proxy tradicional que gestiona las solicitudes de los clientes hacia servidores externos, el proxy inverso recibe las solicitudes de los clientes y las redirige a los servidores internos adecuados. Además, puede realizar tareas como balanceo de carga, enrutamiento, almacenamiento en caché y seguridad, como la terminación de conexiones SSL.

### Ejemplo práctico:

Imagina que tienes una aplicación web con múltiples servicios backend (por ejemplo, un servicio para la API, otro para el servidor de archivos estáticos y otro para un sistema de autenticación). Un proxy inverso, como Nginx o Apache, puede configurarse para redirigir las solicitudes según la ruta o el subdominio:

1. **Configuración del proxy inverso con Nginx:**

```
server {
    listen 80;

    server_name ejemplo.com;

    location /api/ {
        proxy_pass <http://backend-api:5000>;
    }

    location /static/ {
        proxy_pass <http://static-server:8080>;
    }

    location /auth/ {
        proxy_pass <http://auth-service:3000>;
    }
}

```

En este ejemplo:

- Las solicitudes a `http://ejemplo.com/api/` se redirigen al servicio de API (`http://backend-api:5000`).
- Las solicitudes a `http://ejemplo.com/static/` se redirigen al servidor de archivos estáticos (`http://static-server:8080`).
- Las solicitudes a `http://ejemplo.com/auth/` se redirigen al servicio de autenticación (`http://auth-service:3000`).

El proxy inverso simplifica la gestión de los servicios internos, mejora la seguridad al ocultar los detalles de las aplicaciones backend y ofrece una única entrada para los clientes.