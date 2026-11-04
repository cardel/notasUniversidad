# Clase 7. Introducción a los sistemas distribuidos

**Semana del 3 de noviembre de 2026.**

Hasta aquí todo el cómputo cabía en una máquina: varios hilos, una memoria y un
reloj. Esta sesión sale de la máquina. Cruzar la red cuesta medio millón de
veces lo que leer la RAM, cada nodo lleva su propio reloj y cualquiera puede
caerse sin avisar. La sesión recorre lo que cambia por eso: cuándo conviene
repartir el trabajo entre máquinas, cuántos nueves le quedan a un servicio, y
qué contesta un sistema cuando la red se parte en dos.

<div class="grid cards" markdown>

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
