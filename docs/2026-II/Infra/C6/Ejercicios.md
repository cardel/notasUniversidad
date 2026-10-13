# Ejercicios · Infra C6

Clase 6 — Herramientas de profiling en Linux (13 y 15 de octubre). Los apartados
van en el orden de la sesión y todos se resuelven en el navegador. Casi todos
parten de la misma pareja de programas: dos versiones que suman la misma matriz
de 10.000 × 10.000 enteros y se diferencian en el orden de dos índices. Esa
pareja atraviesa la sesión entera, medida cada vez con otra herramienta. Antes
de ver un número hay que escribirlo, y cada respuesta equivocada dice por qué no.

## Motivación: ¿por qué perfilar?

### [Dos programas que hacen la misma cuenta](widgets/dosprogramas.html){ target=_blank rel=noopener }

Mismo resultado, mismas instrucciones hasta el sexto dígito, el doble de ciclos.
Prediga cuánto tarda cada uno y cuántas instrucciones retira por ciclo, destape
los contadores y decida qué explica la diferencia cuando el código solo cambia
en el orden de dos índices. Cierra con las cuatro familias de perfiladores y
cuál responde en qué línea se va el tiempo.

## Monitoreo de procesos: `top`, `htop` y `ps`

### [Un programa paralelo visto desde afuera](widgets/procesos.html){ target=_blank rel=noopener }

Un proceso marca 919,1 % de CPU y 1,2 % de memoria. Calcule el techo de la
máquina y a cuántos núcleos equivale esa cifra, destape los doce hilos con su
núcleo asignado y lea qué significa que dos compartan el mismo mientras otros
dos quedan libres. Termina con el síntoma que delata un binario compilado sin
la bandera de OpenMP.

### [Contar llamadas al sistema](widgets/llamadas.html){ target=_blank rel=noopener }

Dos programas escriben las mismas 200.000 líneas: uno con una llamada por línea
y otro con un búfer. Prediga la diferencia en llamadas y en tiempo dentro del
núcleo, y vea por qué el reloj apenas se mueve en comparación. El cierre es un
caso donde la herramienta no encuentra nada, y eso también es un resultado.

## Análisis de memoria caché con Valgrind

### [Contar los fallos de caché](widgets/cache.html){ target=_blank rel=noopener }

Cuántos enteros entran en una línea de caché y cuántas lecturas aprovechan cada
una. Prediga la razón de fallos entre las dos versiones, averigüe por qué los
fallos de escritura coinciden hasta el último dígito y por qué una tasa del
6,3 % no es poca cosa. La función que tiene la mitad de las instrucciones y casi
todos los fallos queda señalada sin leer una línea del programa.

## Profiling de hardware con `perf`

### [Los contadores del procesador](widgets/contadores.html){ target=_blank rel=noopener }

Instrucciones por ciclo calculadas a mano antes de destapar la tabla, la
diferencia entre los fallos del primer nivel y los del último, y qué dice un IPC
por debajo de uno en un programa paralelo que solo suma. Incluye el mensaje que
aparece cuando el permiso del núcleo, y no el procesador, es lo que falta.

## Comparativa y flujo de trabajo

### [La misma diferencia, medida de cuatro formas](widgets/herramientas.html){ target=_blank rel=noopener }

El mismo par de programas da 1,4, 9,4, 18,0 y 415 veces según con qué se mida.
Ordene las cuatro razones, explique por qué crecen a medida que se baja de
nivel y empareje cinco preguntas de la vida real con la herramienta que las
responde.
