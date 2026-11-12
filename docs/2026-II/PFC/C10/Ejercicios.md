# Ejercicios · PFC C10

Nueve actividades para trabajar en el navegador los temas de la sesión de
principios y abstracciones de la concurrencia. Van en el orden de la clase y
cada una corre el código que se escribió en ella: las intercalaciones, los
valores finales y los recorridos del árbol de llamadas se generan ejecutando
ese código, no están escritos a mano. Los tiempos y los speedup son los que se
reportaron en clase, sobre una máquina de cuatro núcleos.

Cada una cierra con un ejercicio que se resuelve solo, sin solución ni pistas
en la página.

## Paralelismo, concurrencia e hilos

### [hilos](../../../actividades/pfc/concurrencia-hilos-y-carrera/hilos.html){ target=_blank rel=noopener }

Un servidor de un núcleo que atiende cuatro conexiones por turnos, para
separar los dos conceptos. Después, el mapa de pilas y heap, y los dos
mensajes con que se maneja un hilo: `start` lanza y sigue, `join` espera y
además garantiza ver lo que el otro escribió.

## Intercalación y no determinismo

### [intercalaciones](../../../actividades/pfc/concurrencia-hilos-y-carrera/intercalaciones.html){ target=_blank rel=noopener }

Cuántas salidas distintas admite el programa del `join`. Se predice el número,
se decide sobre seis candidatas cuáles puede producir el programa, y se revisa
qué ordena el `join` y qué deja sin decidir.

## Condiciones de carrera

### [carrera](../../../actividades/pfc/concurrencia-hilos-y-carrera/carrera.html){ target=_blank rel=noopener }

El generador de identificadores con un contador compartido. La traza de los dos
hilos avanza fila por fila hasta el paso en que los dos retornan el mismo
valor, y sigue con la atomicidad, con lo que el cerrojo quita y con la razón
por la que el estilo funcional no lo necesita.

### [valorFinal](../../../actividades/pfc/concurrencia-hilos-y-carrera/valorFinal.html){ target=_blank rel=noopener }

Dos hilos que suman 1 y 10 sobre la misma variable. Seis intercalaciones y tres
valores posibles, con los dos números pedidos por separado porque no coinciden.
Cada valor final delata qué lectura llegó primero.

## Midiendo el beneficio: speedup

### [speedup](../../../actividades/pfc/concurrencia-hilos-y-carrera/speedup.html){ target=_blank rel=noopener }

El cociente entre el tiempo secuencial y el paralelo sobre los tiempos de la
clase. Qué significa un speedup de 1, qué pasó cuando baja de 1, y de dónde
sale la pérdida entre el 2,80 medido y el 4 que se esperaba con cuatro
núcleos.

## La abstracción parallel

### [porNombre](../../../actividades/pfc/paralelismo-parallel-y-task/porNombre.html){ target=_blank rel=noopener }

El contrato de `parallel` y los dos caracteres de la firma que deciden si hay
paralelismo. Incluye el caso de dos tareas desiguales, donde el tiempo lo pone
la más lenta, y qué pasa cuando una expresión que llegó por nombre se menciona
dos veces.

## Divide y vencerás con umbral

### [umbral](../../../actividades/pfc/paralelismo-parallel-y-task/umbral.html){ target=_blank rel=noopener }

El árbol de llamadas de `segmentRec` paso a paso, con un contador por línea
para las sumas secuenciales y las llamadas a `parallel`. La condición del
umbral es estricta, y de ahí salen el segmento que se parte aunque mida
exactamente el umbral y el umbral con el que la recursión no termina.

## La abstracción task

### [task](../../../actividades/pfc/paralelismo-parallel-y-task/task.html){ target=_blank rel=noopener }

Dos cuentas de tiempo sobre la norma con cuatro tareas, una con los `join` al
final y otra con cada `join` pegado a su `task`. Cierra con tres formas de
escribir `parallel` sobre `task`, de las que solo dos paralelizan.

## Estimar pi con Monte Carlo

### [montecarlo](../../../actividades/pfc/paralelismo-parallel-y-task/montecarlo.html){ target=_blank rel=noopener }

Cuatro tareas, ningún `synchronized` y ningún `var`. El tamaño del cuarto
pedazo con `iter = 10`, por qué dos invocaciones paralelas no se estorban
aunque cada una use un objeto mutable por dentro, y por qué este speedup queda
más cerca del ideal que el de la suma del arreglo.
