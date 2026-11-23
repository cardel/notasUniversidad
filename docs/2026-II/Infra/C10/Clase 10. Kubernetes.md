# Clase 10. Kubernetes

**Semana del 23 de noviembre de 2026.**

Swarm reparte réplicas entre varias máquinas y reprograma lo que se cae,
siempre que el manager siga vivo y alguien le haya dicho qué quiere. Esta
sesión cambia la forma de pedirlo: en vez de una orden que crea algo, un
archivo que describe el estado al que el clúster tiene que llegar, y un ciclo
que lo compara contra lo que hay y corrige la diferencia mientras el clúster
exista. De ahí salen el Pod, el Deployment que lo repone, la actualización que
avanza por lotes con su techo y su piso, y el Service, que le da a un conjunto
de réplicas que nacen y mueren una dirección que no cambia.

<div class="grid cards" markdown>

-   :material-format-list-checks:{ .lg .middle } **Ejercicios**

    ---

    Ocho actividades en el navegador, en el orden de la sesión: el contenedor y
    los cinco puertos que deja `minikube start` y cuál de ellos atiende a
    `kubectl`, la traza de las tres pruebas diciendo quién repara en cada una,
    el estado deseado contra el real con la diferencia que toca el controlador
    en la pasada siguiente, los siete componentes del clúster y el camino de un
    `apply` hasta el contenedor corriendo, las seis filas de `kubectl get pods`
    donde solo dos atienden y dónde está el mensaje de cada fallo, los
    milicores que reserva un Deployment y cuántas réplicas caben en dos
    núcleos, los ocho pasos de una actualización progresiva con el rollout que
    se detiene cuando la versión nueva no pasa la sonda, y el selector
    evaluado término a término sobre cuatro Pods con la columna externa que se
    queda pendiente para siempre.

    [:octicons-arrow-right-24: Entrar](../../../actividades/infra/kubernetes/index.md)

</div>

## Antes de entrar

De [Docker Compose y Swarm](../C9/Clase%209.%20Docker%20Compose%20y%20Swarm.md)
vuelven tres cosas que aquí cambian de nombre pero no de idea: el archivo que
describe el sistema completo en vez de una orden por pieza, el servicio con sus
réplicas repartidas entre nodos, y la actualización que avanza por lotes sin
tumbar lo que atiende. Lo que se agrega es quién vigila que eso siga siendo
cierto cuando nadie está mirando.

## Lo que cubre la sesión

**Por qué un orquestador.** El clúster local con Minikube y lo que queda
corriendo en la máquina después de arrancarlo. Después, el mismo escenario
sometido a tres pruebas: matar una réplica, apagar el host donde corre y
repetirlo sobre Swarm. La traza de las tres, momento a momento, deja ver quién
repara en cada caso y qué queda sin reparar.

**El modelo declarativo.** El estado deseado y el estado real como dos cosas
distintas, y el ciclo que compara uno con otro y corrige la diferencia. El
manifiesto se arma línea por línea, empezando por `kind` y `metadata` y
terminando en el contenedor, y al aplicarlo aparece lo que el clúster añade por
su cuenta, que es la parte que nadie escribió.

**Arquitectura del clúster.** El plano de control y el nodo trabajador, con lo
que hace cada componente y el camino que recorre un `kubectl apply` hasta que
hay un contenedor corriendo. Y la pieza que concentra el riesgo, `etcd`, con su
quórum.

**Pod y Deployment.** El Pod como unidad de despliegue, con lo que comparten
los contenedores que van dentro. Leer una salida real de `kubectl get pods`,
distinguir el que atiende del que arrancó pero todavía no, y encontrar el
mensaje que explica por qué uno no levanta, que no está en el mismo sitio
cuando la imagen nunca bajó que cuando el proceso muere al arrancar. Encima, el
Deployment con su ReplicaSet, la actualización progresiva con `maxSurge` y
`maxUnavailable`, y la vuelta a la versión anterior.

**Servicios.** Las etiquetas y el selector que las lee, que es como el clúster
decide qué réplicas forman un servicio. El problema que resuelve un Service,
que es que la dirección de un Pod no sirve de destino, y los tres tipos con lo
que alcanza cada uno desde fuera.

## Material

Las diapositivas, el material de lectura previa y el chequeo del tema están en
el Campus Virtual, junto con los manifiestos de los ejemplos que se aplican en
clase.
