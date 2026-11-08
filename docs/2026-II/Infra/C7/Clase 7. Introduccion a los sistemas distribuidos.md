# Clase 7. Introducción a los sistemas distribuidos

**Semana del 3 de noviembre de 2026.**

Hasta aquí todo el cómputo cabía en una máquina: varios hilos, una memoria y un
reloj. Esta sesión sale de la máquina. Cruzar la red cuesta medio millón de
veces lo que leer la RAM, cada nodo lleva su propio reloj y cualquiera puede
caerse sin avisar. La sesión recorre lo que cambia por eso: cuándo conviene
repartir el trabajo entre máquinas, cuántos nueves le quedan a un servicio, y
qué contesta un sistema cuando la red se parte en dos.

<div class="grid cards" markdown>

-   :material-lan:{ .lg .middle } **Introducción a los sistemas distribuidos**

    ---

    Lo que se vio en la sesión, con las mediciones que se hicieron en vivo: la
    latencia contra dos destinos y la traza de saltos, el ancho de banda contra
    la propia máquina, los nueves de disponibilidad y lo que cuesta
    encadenarlos, el consenso por mayoría, los relojes que no coinciden, y el
    teorema CAP contado desde los 43 segundos que le costaron a GitHub un día
    entero.

    [:octicons-arrow-right-24: Entrar](./Introduccion%20a%20los%20sistemas%20distribuidos.md)

-   :material-sitemap:{ .lg .middle } **Estilos de arquitectura y diagnóstico de red**

    ---

    Los siete estilos con los que se describe un sistema distribuido, dónde
    vive el estado en cada uno y qué cuesta, con la ley de Conway y la
    observabilidad; y las dos medidas con las que se diagnostica un enlace,
    con lo que se espera de cada tipo de red y por qué una transferencia real
    siempre queda por debajo.

    [:octicons-arrow-right-24: Entrar](./Estilos%20de%20arquitectura%20y%20diagnostico%20de%20red.md)

-   :material-format-list-checks:{ .lg .middle } **Ejercicios**

    ---

    Diez actividades en el navegador: lo que cuesta cruzar la red y el orden de
    los eventos sin un reloj común, escalar a lo alto o a lo ancho y repartir
    claves entre nodos, los nueves de disponibilidad y la cadena de servicios,
    el teorema CAP con los quórums y dos réplicas que divergen y vuelven a
    juntarse, y los siete estilos de arquitectura sobre diez sistemas
    conocidos.

    [:octicons-arrow-right-24: Entrar](../../../actividades/infra/sistemas-distribuidos/index.md)

</div>

## Antes de entrar

De la introducción a la programación paralela vuelve la ley de Amdahl, que
ahora se aplica a máquinas en lugar de núcleos y sigue poniendo el mismo techo.
De hilos y procesos en Python vuelve la memoria separada: dos procesos que no
comparten memoria solo se coordinan con mensajes, y un sistema distribuido es
eso mismo con una red de por medio que a veces no entrega.
