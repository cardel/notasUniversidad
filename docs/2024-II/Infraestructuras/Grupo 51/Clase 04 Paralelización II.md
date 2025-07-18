# Clase 04: Paralelización II

Limitaciones

- Trampa serial: No se puede paraelizar suponiendo que las tareas van a tardar 1/n veces (n hilos), por que hay tareas que no se pueden paralelizar
- Recursos compartidos
    - Memoria: localidad temporal: Acceso a las posiciones de memoria compartidas por hilos
    - Memoria: localidad espacial: Cantidad de memoria gestionada por cada hilo (secuencialidad de los datos)
- Herramientas de profiling: Nos permiten estudiar cómo se comporta en memoria y en ejecución los programas

---

Rendimiento de la cache

- h la tasa de acierto (HitRatio)
- Tm Tiempo de acceso memoria RAM
- Tc Tiempo de acceso memoria cache

Acceso paralelo

$$
T_{avg} = hT_c+(1-h)T_m
$$

Acceso jeraquico/Secuencia

$$
T_{avg} = hT_c+(1-h)(T_m+T_c)
$$

---

Dependencias

- Numeros de procesadores disponibles
- Dependencias de tareas
- Ley de Amdahl
    - p es la parte del código que se puede paralelizar
    - s es el número de hilos que puedo lanzar
    - T es el tiempo secuencial

$$
L = \frac{T}{(1-p)+\frac{p}{s}}
$$

---

Elementos a tener en cuenta

- La cantidad total de trabajo: Para resolver una tarea al menos vamos a tener que realizar TODAS las operaciones que la involucran (profiling)
- El span: El tiempo de la tarea secuencial que se demora más
- La cantidad total de comunicación (Gestión de hilos y memoria en el programa)

---

Limitaciones con respecto al crecimiento de la capacidad

1. Ley de moore: Cada dos años tenemos el doble de transitores (propuesta en los años 70) pero que se cumplio hasta los años 2000
2. Tasas de reloj se estabilizaron (no tienen un crecimiento significativo) 3GHz

---

Tasa de reloj

1. Power all: Entre más frecuencia se consume más energia (relación es exponencial) es necesario usar refrigeración especial cuando un procesador se overclockea
2. Memory wall: La memoria y la CPU no tienen la misma frecuencia
3. Restricciones de bajo nivel sobre paralelismo

---

---

Estrategias para paralelizar

- Formas: Paralelización de tareas y de datos
- Pipeline: Ejecutar las tareas en paralelo
- Ejecución especulativa: Adelantar ejecuciones no dependientes (hay que predecir)

---

## Resumen

- La velocidad de algoritmo no depende directamente la tasa de reloj (hay limitaciones)
- El paralelismo por hardware está en sus limites
- Debe reducirse el acceso a memoria
- Los procesadores tienen instrucciones de paralelización pero el Kernel debe de proveerlas para aprovecharlas

---

Patrones de software en paralelismo

1. Son a base de la experiencia (carecen de un marco teorico que los respalde 100%)
2. Nos permiten construir aplicaciones de alto nivel para problemas complejos nos preocupamos en cómo se paraleliza ni por el hardware, si no lo que queremos paralelizar
3. Muchos patrones. Pipeline (tareas), map→reduce (datos)
4. Tener en cuenta las dependencias entre los datos y las operaciones (caso de addme)