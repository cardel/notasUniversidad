# Semana 11: Kubernetes / Docker Swarm

# Recursos

[Instrucciones.md](Instrucciones.md)

# Kubernetes

Un **Servicio** en Kubernetes es una abstracción que define una forma lógica de acceder a un conjunto de Pods. Sirve como un punto de entrada estable para acceder a aplicaciones distribuidas, incluso si la cantidad de Pods cambia debido a escalado o actualizaciones. Por ejemplo, un Servicio puede exponer una aplicación web que corre en varios Pods a través de un único IP y puerto.

Un **ConfigMap** es un objeto que permite separar la configuración de una aplicación del código. Sirve para almacenar datos de configuración en pares clave-valor, como variables de entorno o configuraciones específicas. Por ejemplo, un ConfigMap puede contener el nombre de un archivo de configuración que la aplicación debe usar para funcionar correctamente.

Un **StatefulSet** se utiliza para gestionar aplicaciones con estado, donde los Pods tienen identidades únicas y persistentes. Sirve para casos como bases de datos o sistemas distribuidos que requieren almacenamiento persistente. Por ejemplo, un StatefulSet puede ser útil para implementar un clúster de base de datos MySQL donde cada nodo debe tener un almacenamiento persistente asignado.

Un **Deployment** es un objeto que permite desplegar y gestionar réplicas de Pods de manera declarativa. Sirve para garantizar que un número deseado de Pods esté corriendo en todo momento y permite actualizaciones controladas. Por ejemplo, un Deployment puede ser utilizado para desplegar una aplicación web con tres réplicas y realizar actualizaciones sin tiempo de inactividad.

El comando `kubectl get pods` se utiliza para listar todos los Pods que están corriendo en un clúster de Kubernetes. Proporciona información como los nombres de los Pods, su estado, el tiempo que llevan corriendo y el nodo en el que están asignados.

El comando `kubectl get services` se utiliza para listar todos los Servicios definidos en el clúster. Muestra detalles como el nombre del Servicio, el tipo (ClusterIP, NodePort, LoadBalancer), la dirección IP asignada y los puertos expuestos.

El comando `kubectl port-forward` permite redirigir el tráfico desde un puerto local de tu máquina a un puerto específico en un Pod. Esto es útil para acceder a aplicaciones en un clúster de manera temporal sin exponer un Servicio. Por ejemplo, puedes usar `kubectl port-forward pod-name 8080:80` para acceder a una aplicación en el puerto 80 del Pod desde el puerto 8080 de tu máquina local.

```bash
minikube service <nombre> #Lanzar el servicio
minikube service list #Listas los servicios
```

# Balancerador de carga

## Balanceador de carga

Un balanceador de carga en Kubernetes es una forma de distribuir automáticamente el tráfico de red hacia múltiples Pods, asegurando alta disponibilidad y escalabilidad para las aplicaciones. Kubernetes utiliza diferentes tipos de Servicios para habilitar el balanceo de carga, dependiendo de las necesidades específicas.

### Configuración detallada

La configuración de un Servicio en Kubernetes implica el uso de un archivo YAML que define el tipo de Servicio que deseas crear. Aquí hay dos ejemplos de configuración detallada:

### Ejemplo 1: Servicio ClusterIP

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: MyApp
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376

```

- **apiVersion**: Especifica la versión de la API de Kubernetes.
- **kind**: Define el tipo de objeto que estás creando, en este caso, un `Service`.
- **metadata**: Contiene metadatos como el nombre del Servicio (`my-service`).
- **spec**: Define las especificaciones del Servicio.
    - **selector**: Indica qué Pods serán seleccionados por este Servicio, en este caso, aquellos con la etiqueta `app: MyApp`.
    - **ports**: Configura los puertos que el Servicio utilizará.
        - **port**: El puerto expuesto por el Servicio (80 en este caso).
        - **targetPort**: El puerto en los Pods al que se redirige el tráfico (9376 en este caso).

Este tipo de Servicio (`ClusterIP`) es el predeterminado en Kubernetes y expone el Servicio dentro del clúster, lo cual es útil para comunicación interna entre aplicaciones.

### Ejemplo 2: Servicio NodePort

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-nodeport-service
spec:
  type: NodePort
  selector:
    app: MyApp
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376
      nodePort: 30007

```

- **type: NodePort**: Este tipo de Servicio expone el puerto no solo dentro del clúster, sino también en cada nodo del clúster. Esto permite que el Servicio sea accesible desde fuera del clúster usando la dirección IP de cualquier nodo y el `nodePort`.
- **nodePort**: Define un puerto fijo (30007) que será expuesto en cada nodo para acceder al Servicio.

### Ejemplo práctico de funcionamiento

Supongamos que tienes una aplicación web llamada "MyApp" que corre en varios Pods en tu clúster de Kubernetes.

1. **Con un Servicio ClusterIP:**
    - Puedes exponer la aplicación internamente dentro del clúster. Esto significa que otras aplicaciones o componentes dentro del clúster pueden acceder a "MyApp" utilizando el nombre del Servicio (`my-service`) y el puerto (80).
2. **Con un Servicio NodePort:**
    - La aplicación será accesible desde fuera del clúster. Por ejemplo, si el nodo tiene la IP `192.168.1.100`, puedes acceder a la aplicación visitando `http://192.168.1.100:30007`.

### Beneficios del balanceo de carga

- **Alta disponibilidad**: Si un Pod falla, el balanceador de carga redirige el tráfico a otros Pods en buen estado.
- **Escalabilidad**: Al agregar más réplicas de Pods, el balanceador de carga distribuye automáticamente el tráfico entre los nuevos Pods.
- **Flexibilidad**: Con Servicios como `NodePort` o `LoadBalancer`, puedes exponer tu aplicación tanto dentro como fuera del clúster.

Estos mecanismos hacen que Kubernetes sea una herramienta poderosa para gestionar aplicaciones distribuidas y garantizar su rendimiento y disponibilidad.

### Ejemplo: Servicio LoadBalancer

La siguiente configuración YAML define un Servicio de tipo `LoadBalancer` en Kubernetes, que se utiliza para exponer una aplicación al tráfico externo mediante un balanceador de carga.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-loadbalancer-service
spec:
  type: LoadBalancer
  selector:
    app: MyApp
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376

```

### Desglose de la configuración:

1. **apiVersion**:
    - Especifica la versión de la API de Kubernetes que se está utilizando. En este caso, `v1`.
2. **kind**:
    - Define el tipo de recurso que se está creando. Aquí es un `Service`.
3. **metadata**:
    - Contiene información sobre el Servicio, como su `name`. Aquí, el Servicio se llama `my-loadbalancer-service`.
4. **spec**:
    - Define las especificaciones del Servicio.
    - **type: LoadBalancer**: Este tipo de Servicio crea automáticamente un balanceador de carga externo (dependiendo de tu proveedor de nube, como AWS, GCP o Azure) para dirigir el tráfico al Servicio.
    - **selector**: Indica qué Pods serán gestionados por este Servicio. En este caso, se seleccionan los Pods que tienen la etiqueta `app: MyApp`.
    - **ports**: Configura los puertos que el balanceador de carga manejará.
        - **protocol**: El protocolo utilizado, como `TCP`.
        - **port**: Define el puerto que el balanceador de carga expondrá (80 en este ejemplo).
        - **targetPort**: Especifica el puerto en los Pods al que el tráfico será redirigido (9376 en este caso).

### Ejemplo práctico:

Supongamos que tienes una aplicación web llamada "MyApp" que se ejecuta en varios Pods en tu clúster de Kubernetes. Esta aplicación necesita ser accesible desde internet utilizando un balanceador de carga.

1. **Configuración inicial**:
    - Crea el archivo YAML anterior y aplícalo al clúster con el comando:
        
        ```bash
        kubectl apply -f my-loadbalancer-service.yaml
        
        ```
        
2. **Resultado**:
    - Kubernetes creará un balanceador de carga externo. Según el proveedor de nube, esto podría ser:
        - En AWS: Un Elastic Load Balancer (ELB).
        - En GCP o Azure: Un balanceador de carga configurado automáticamente.
    - Este balanceador de carga recibirá tráfico en el puerto 80 y lo redirigirá a los Pods que ejecutan "MyApp" en el puerto 9376.
3. **Acceso a la aplicación**:
    - Kubernetes asignará una dirección IP externa al balanceador de carga. Puedes usar esa IP para acceder a la aplicación desde internet. Por ejemplo:
        
        ```
        http://<external-ip>:80
        
        ```
        

### Ventajas de este enfoque:

- **Alta disponibilidad**:
    - Si uno de los Pods falla, el balanceador de carga redirigirá automáticamente el tráfico a los Pods restantes.
- **Escalabilidad**:
    - Si agregas más réplicas de Pods para "MyApp", el tráfico se distribuirá automáticamente entre ellos.
- **Simplicidad**:
    - La configuración es declarativa y fácil de implementar, adaptándose a cualquier proveedor de nube compatible con Kubernetes.

Este ejemplo muestra cómo Kubernetes simplifica la exposición de aplicaciones distribuidas al tráfico externo, garantizando alta disponibilidad y escalabilidad con un balanceador de carga.

### Ejemplo práctico de balanceo de carga en Kubernetes con una aplicación frontend, backend replicado y base de datos

Supongamos que tienes una arquitectura de tres capas:

1. **Frontend**: Una aplicación web que sirve la interfaz de usuario.
2. **Backend**: Una API que maneja la lógica de negocio, replicada en 3 Pods.
3. **Base de datos**: Un único Pod que almacena los datos persistentes.

### Configuración del balanceador de carga

En Kubernetes, puedes implementar el balanceo de carga en diferentes puntos de la arquitectura:

1. **Balanceador de carga antes del frontend**:
    - Se utiliza un balanceador de carga de tipo `LoadBalancer` para exponer el servicio frontend al tráfico externo.
    - El frontend redirige las solicitudes de los usuarios hacia el backend.
2. **Balanceador de carga detrás del frontend**:
    - El frontend se comunica con el backend a través de un Servicio de tipo `ClusterIP` o `NodePort`, que distribuye el tráfico entre los Pods del backend.

### Ejemplo de configuración YAML

### Servicio para el Frontend (LoadBalancer)

```yaml
apiVersion: v1
kind: Service
metadata:
  name: frontend-service
spec:
  type: LoadBalancer
  selector:
    app: frontend
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000

```

- **type: LoadBalancer**: Expondrá el servicio frontend con una IP pública para recibir tráfico externo.
- **targetPort**: El puerto donde la aplicación frontend escucha solicitudes (3000 en este caso).

### Servicio para el Backend (ClusterIP)

```yaml
apiVersion: v1
kind: Service
metadata:
  name: backend-service
spec:
  selector:
    app: backend
  ports:
    - protocol: TCP
      port: 8080
      targetPort: 8080

```

- **type: ClusterIP**: Este servicio distribuye el tráfico internamente entre los Pods del backend.

### Servicio para la Base de Datos (ClusterIP)

```yaml
apiVersion: v1
kind: Service
metadata:
  name: database-service
spec:
  selector:
    app: database
  ports:
    - protocol: TCP
      port: 5432
      targetPort: 5432

```

- **type: ClusterIP**: La base de datos es accesible solo dentro del clúster.

### Flujo de tráfico

1. Los usuarios acceden a la aplicación a través de la IP del balanceador de carga (`frontend-service`).
2. El frontend procesa las solicitudes y las envía al backend a través del servicio `backend-service`.
3. El backend maneja la lógica de negocio y, si es necesario, consulta o actualiza los datos en la base de datos utilizando el servicio `database-service`.

### Ventajas y desventajas de colocar el balanceador de carga

1. **Antes del Frontend**:
    - **Ventajas**:
        - Exposición directa del frontend al tráfico externo.
        - La carga entre múltiples réplicas del frontend (si es necesario) se distribuye automáticamente.
    - **Desventajas**:
        - Puede no ser óptimo si la lógica del balanceo de carga debe adaptarse a diferentes rutas o flujos de tráfico.
2. **Después del Frontend**:
    - **Ventajas**:
        - Mayor control interno sobre el tráfico entre el frontend y el backend.
        - Menor exposición de puntos críticos, como el backend y la base de datos, al público.
    - **Desventajas**:
        - Agrega complejidad en la configuración del balanceo de carga interno.

### Conclusión

La elección de dónde colocar el balanceador de carga depende de los requisitos específicos de la aplicación. Generalmente, se utiliza un balanceador de carga antes del frontend para exponer la aplicación al público y servicios internos (`ClusterIP`) para gestionar la comunicación entre las capas de la arquitectura. Kubernetes facilita la implementación de ambas estrategias de manera eficiente y escalable.

# Docker swarm

Tener un sistema distribuido de Contenedores

```bash
#Nodo maestro 
docker swarm init

#La salida va tener un comando de este estilo (variar)
docker swarm join --token SWMTKN-1-42122jdhp8tb8ntpgplxb8ke35nwaei9je5dprj45kfhhlezc1-dat1flbotrywj9q66xbh798iq 172.16.0.191:2377
```

Para ver los nodos conectados al nodo maestro en Docker Swarm, utiliza el siguiente comando:

```bash
docker node ls

```

Este comando mostrará una lista de todos los nodos en el clúster, incluyendo el nodo maestro y los nodos trabajadores, junto con información como el ID, el estado, el rol y la disponibilidad.

Este archivo de configuración define un servicio en Docker utilizando la versión 3 del formato de Docker Compose. A continuación, se explica cada una de las secciones:

### Versión

```yaml
version: "3"

```

- Define la versión del esquema de configuración de Docker Compose que se está utilizando. Aquí es la versión 3, adecuada para trabajar con Docker Swarm.

### Servicios

```yaml
services:
  web:

```

- Define los servicios que se desplegarán. En este caso, hay un único servicio llamado `web`.

### Configuración del servicio `web`

```yaml
    image: nginx

```

- Especifica la imagen de Docker que se utilizará para crear los contenedores. Aquí se utiliza la imagen oficial de Nginx.

```yaml
    deploy:

```

- Contiene opciones específicas de despliegue para Docker Swarm.

```yaml
      replicas: 5

```

- Define el número de réplicas del servicio que se ejecutarán. Aquí se crearán 5 réplicas del servicio `web`.

```yaml
      update_config:
        parallelism: 2
        delay: 10s

```

- Configura cómo se manejarán las actualizaciones del servicio:
    - **parallelism**: Especifica cuántas tareas (contenedores) se actualizarán al mismo tiempo. Aquí se actualizan 2 contenedores en paralelo.
    - **delay**: Define el tiempo de espera entre cada conjunto de actualizaciones. Aquí se espera 10 segundos entre cada actualización.

```yaml
    networks:
      - webnet

```

- Asigna el servicio a una red llamada `webnet`. Esto permite que los contenedores del servicio se comuniquen entre sí u otros servicios dentro de la misma red.

### Redes

```yaml
networks:
  webnet:

```

- Define la red llamada `webnet`. Esta red será utilizada por el servicio `web` para la comunicación interna entre los contenedores.

### Resumen

Este archivo configura un servicio `web` basado en Nginx con 5 réplicas. Durante una actualización, se actualizarán 2 contenedores al mismo tiempo con un retraso de 10 segundos entre cada grupo de actualizaciones. Además, los contenedores del servicio están conectados a una red personalizada llamada `webnet`, permitiendo la comunicación entre ellos. Este archivo está diseñado para ser utilizado en un despliegue de Docker Swarm.

Para invocar el archivo `service.yml` con Docker Swarm, utiliza el siguiente comando:

```bash
docker stack deploy -c service.yml <nombre_del_stack>

```

Reemplaza `<nombre_del_stack>` con el nombre que desees asignar al stack. Este comando desplegará los servicios definidos en el archivo `service.yml` en el clúster de Docker Swarm.

The command `docker service ls` does not directly work on worker nodes in Docker Swarm because worker nodes are not responsible for managing services. This command is used on the manager node to list the services running in the Swarm cluster.

On worker nodes, you can inspect the tasks running on the node using the command:

```bash
docker ps

```

This will show the containers (tasks) assigned to the worker node as part of the services deployed in the Swarm.

Para exponer el servicio de Nginx en el clúster con Docker Swarm y accederlo desde una URL, asegúrate de mapear un puerto público al servicio. Por ejemplo, puedes exponer el puerto 80 en el archivo de configuración:

```yaml
ports:
  - "80:80"

```

De esta forma, podrás acceder al servicio utilizando la dirección IP pública o privada de cualquier nodo del clúster a través de `http://<ip_del_nodo>`. Si estás en un entorno local, utiliza la IP del nodo maestro o cualquiera de los nodos del clúster.172.16.0.191 

Para cambiar el `index.html` y copiar un archivo llamado `imagen.png` al servicio, puedes utilizar un volumen para montar un directorio local con los archivos personalizados en el contenedor. Aquí tienes el archivo de configuración actualizado:

```yaml
version: "3"
services:
  web:
    image: nginx
    deploy:
      replicas: 5
      update_config:
        parallelism: 2
        delay: 10s
    networks:
      - webnet
    ports:
      - "80:80"
    volumes:
      - ./html:/usr/share/nginx/html
networks:
  webnet:

```

### Explicación de los cambios:

1. **`volumes`**:
    - Se añadió un volumen que monta un directorio local (`./html`) en el directorio `/usr/share/nginx/html` del contenedor, que es donde Nginx busca el archivo `index.html` por defecto.
    - Asegúrate de que en el directorio `./html` existan los archivos `index.html` y `imagen.png`.

### Pasos adicionales:

1. Crea un directorio llamado `html` en el mismo nivel donde está este archivo `docker-compose.yml`.
2. Coloca el archivo `index.html` y `imagen.png` dentro del directorio `html`.
3. Aplica la configuración al clúster con el comando:
    
    ```bash
    docker stack deploy -c service.yml <nombre_del_stack>
    
    ```
    

Esto desplegará el servicio con el contenido personalizado del `index.html` y permitirá que `imagen.png` esté disponible para ser servida por Nginx.