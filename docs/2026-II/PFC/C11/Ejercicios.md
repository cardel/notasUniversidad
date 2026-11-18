# Ejercicios · PFC C11

Seis actividades para trabajar en el navegador los temas de la sesión de
complejidad de la concurrencia. Van en el orden de la clase y las cifras se
calculan en la página: el trabajo y la profundidad salen de contar las
operaciones del recorrido que genera el propio código, la tabla de Amdahl de
evaluar la fórmula para cada fracción secuencial y cada cantidad de núcleos, y
las medias y las medianas de las listas de tiempos que reporta la sesión sobre
una máquina de cuatro núcleos.

Cada una cierra con un ejercicio que se resuelve solo, sin solución ni pistas
en la página.

## Por qué medir y por qué analizar

### [analizarOmedir](../../../actividades/pfc/benchmarking-en-la-jvm/analizarOmedir.html){ target=_blank rel=noopener }

Qué pregunta responde el análisis y qué pregunta la medición, sobre seis
situaciones de las que aparecen al cerrar un taller. Los niveles de la suma en
árbol dan el trabajo y la profundidad, y la razón entre las dos es el
paralelismo que el conteo de operaciones totales no ve. Cierra con diez tiempos
del mismo programa en la misma máquina, donde la media, la mediana y el
descarte del peor valor no coinciden, y con un equipo que decidió retirar su
versión paralela midiendo una sola vez cada lado.

## Trabajo y profundidad

### [sumar8](../../../actividades/pfc/trabajo-y-profundidad/sumar8.html){ target=_blank rel=noopener }

Sumar ocho enteros en dos órdenes, el encadenado y el de árbol, recorridos paso
a paso. El trabajo sale 7 en los dos y la profundidad 7 y 3, así que el tope de
la ganancia es 2,33 y no sube ni con mil núcleos. Termina en las reglas de
composición, donde `parallel` cambia la suma de las profundidades por el
máximo.

### [escala](../../../actividades/pfc/trabajo-y-profundidad/escala.html){ target=_blank rel=noopener }

El mismo cómputo al crecer n, con el trabajo en n - 1 y la profundidad en n - 1
contra log2 n: el tope pasa de 1,50 con cuatro elementos a 102,30 con mil
veinticuatro, de modo que los problemas grandes reparten mejor que los
pequeños. Lo que lo frena está en el primer nivel, que pide la mitad de las
operaciones al mismo tiempo, y en el umbral, con el que la profundidad vuelve a
depender del tamaño de la hoja.

## Tiempo de ejecución y ley de Amdahl

### [tiempoP](../../../actividades/pfc/ley-de-amdahl/tiempoP.html){ target=_blank rel=noopener }

Las dos cotas del tiempo con P núcleos, la profundidad y el trabajo repartido,
y la estimación `D + W/P` sobre la suma en árbol, con presets de tamaño y de
núcleos y la pregunta de cuál de las dos manda en cada uno. Termina en el
arreglo de diez millones de elementos con cuatro núcleos, donde el término del
trabajo supera al del camino crítico por un factor de cinco cifras.

### [amdahl](../../../actividades/pfc/ley-de-amdahl/amdahl.html){ target=_blank rel=noopener }

La cuenta del speedup línea por línea, con la fracción secuencial que se queda
intacta y la paralela que se divide. La tabla se calcula desde la fórmula y deja
tapada la celda del preset para escogerla entre opciones, y las barras muestran
cómo la curva se aplana contra 1/f. Cierra con la decisión: de los 42 ms
secuenciales y los 15 ms con cuatro hilos se despeja una fracción serial del
14 por ciento, y con ella se comparan comprar dieciséis núcleos y reescribir esa
parte a la mitad.

## Benchmarking en la JVM

### [calentamiento](../../../actividades/pfc/benchmarking-en-la-jvm/calentamiento.html){ target=_blank rel=noopener }

Las diez repeticiones de `measure` en barras, antes y después de envolverlas en
`withWarmer(new Warmer.Default)`: la media baja de 32,20 a 25,81 ms y la primera
medición de 59,77 a 24,93. Las cuatro etapas de la JVM explican el desfase, el
descarte del peor diez por ciento se queda corto cuando los atípicos son dos, y
los tres warmers reparten tres situaciones distintas, entre ellas el arranque en
frío que el calentamiento borra.
