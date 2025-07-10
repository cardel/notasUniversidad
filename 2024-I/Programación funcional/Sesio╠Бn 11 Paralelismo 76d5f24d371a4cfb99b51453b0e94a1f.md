# Sesión 11: Paralelismo

## Paralelismo de tareas

---

Operación de scan como paralela

1. Se puede paralelizar porque es una operación ASOCIATIVA
2. Las operaciones que son CONMUTATIVAS pero no ASOCIATIVAS no se pueden paralelizar
3. Se puede paralelizar pero hay dependencia 

```scala
Array(1,2,3,4,5).scan(100)((x,y) => x+y)

[100,101,103,106,110,115]
```

1. Tenemos que generar un árbol de valores parciales, vamos llenamos hacia abajo para calcular los valores parciales y hacia para obtener el total.

---

## Paralelismo de datos

---

¿Cual es la diferencia con paralelismo de tareas?

¿Como la implementamos?

¿Que restricciones hay?

Las tareas se hacen por llamados de funciones de forma paralela, la de dato es de acuerdo a la estructura de datos

Scala nos ofrece la interfaz .par que nos da la versión paralela de la colección que estamos usando, automaticamente aplica los builders (constructor), los splitter (divide la colección) y combiner (mezcla los resultados) esto se hace forma genérica

Que el calculo de datos no dependa de resultados anteriores, ejemplo a(i) = a(i-1) + 1 ¿Cual es el problema? Podemos tener resultados INCORRECTOS

---

# Resumen

1. ¿Que buscamos con parelelismo? Mejorar el rendimiento en términos de tiempo de ejecución
2. ¿Que necesitamos para parelelismo? CPU multiprocesador - hilos
3. ¿Que restricciones tenemos? Dependencia entre resultados parciales, podemos atacar el problema usando árboles como estructura para paralelizar
4. ¿Hay restricciones con respecto a la mejora de rendimiento? Sí, si una operación especifica se hace mejor secuencial, paralelizarla EMPEORA el RENDIMIENTO, por uso incluimos un umbral
5. ¿Que estrategia usamos con los datos? Los partimos en segmentos, recordar que las listas no son apropiadas para esto (porque tiene cabeza, cola) partirlas es COSTOSO, por eso preferimos Vectores o Arreglos
6. La paralelización de tareas es por funciones y la de datos es por colecciónes, la de tareas DEBEMOS implementarlas a través de hilos (parallel)
7. La paralelizació de datos es propia de las colecciones paralelas usando .par