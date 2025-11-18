# Qué es

Es una aplicación para la orquestación de contenedores que permite desplegar aplicaciones distribuidas.

Permite múltiples entornos: local, en la nube o híbrido.

# Ventajas

1. Escalabilidad automática: Podemos aumentar el número de nodos de cómputo
2. Resiliencia: Si un componente se cae, se levanta automáticamente (en algunas ocasiones se requiere intervención manual)
3. Despliegue continuo: Una vez se han hecho cambios, se puede subir todo con un solo comando
4. Portabilidad: La especificación de archivos YAML (configuraciones) permite utilizarlo en diferentes entornos

# Componentes de Kubernetes

- **Nodo maestro**: Gestiona el cluster y coordina las tareas
  - **API Server**: Punto de comunicación para gestionar el cluster
  - **Scheduler**: Asigna los recursos a los pods
  - **Controller manager**: Supervisa y mantiene el estado deseado
  - **etcd**: Base de datos para almacenar configuración y métricas

- **Nodos trabajadores**: Ejecutan los contenedores y se comunican con el nodo maestro
  - **Kubelet**: Ejecuta los pods
  - **Kube proxy**: Gestiona el enrutamiento y balanceo de carga
  - **Runtime de los contenedores**: Docker o containerd

# Elementos de Kubernetes

1. **Pod**: Es la unidad básica de Kubernetes, puede tener uno o más contenedores que comparten el mismo almacenamiento o red y se ejecutan como una sola instancia. Los pods son efímeros y deben ser administrados por los Deployments y los StatefulSets.

2. **Service**: Permite exponer un conjunto de pods como un servicio de red (IP y puerto). Existen 3 tipos:
   - **ClusterIP**: Una IP independiente dentro del cluster
   - **NodePort**: Un puerto accesible por los contenedores de su propia red
   - **LoadBalancer**: Balanceador de carga, cumple la función de redirigir tráfico

3. **Deployments**: Se utiliza para gestionar la implementación y ciclo de vida de los pods. Permite restauración automática en caso de fallos.

4. **StatefulSet**: Es un controlador que gestiona aplicaciones con estado. También permite tener un esquema de almacenamiento, despliegue y eliminación predecible.

5. **ConfigMap**: Permite almacenar valores de configuración no sensibles.

6. **Secret**: Similar a ConfigMap pero con valores encriptados para información sensible.

# Conceptos Teóricos Adicionales

**Orquestación de contenedores**: Proceso de automatizar el despliegue, gestión, escalado y networking de contenedores. Kubernetes es el estándar de facto en la industria para esta tarea.

**Cluster de Kubernetes**: Conjunto de nodos (máquinas físicas o virtuales) que ejecutan aplicaciones en contenedores. Un cluster típico tiene al menos un nodo maestro y múltiples nodos trabajadores.

**Estado deseado**: Concepto fundamental en Kubernetes donde se declara el estado objetivo del sistema (número de réplicas, recursos, configuraciones) y Kubernetes trabaja automáticamente para mantener ese estado.

**Aplicaciones con estado vs sin estado**: Las aplicaciones con estado (stateful) mantienen datos persistentes entre sesiones (bases de datos), mientras que las sin estado (stateless) no mantienen datos de sesión (servicios web).