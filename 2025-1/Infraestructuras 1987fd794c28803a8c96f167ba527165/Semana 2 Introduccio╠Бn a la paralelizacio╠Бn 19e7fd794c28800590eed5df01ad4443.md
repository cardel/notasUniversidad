# Semana 2: Introducción a la paralelización

# Introducción a la paraelización

¿Porque paralelizamos?

Mejorar el rendimiento de la ejecución de un proceso

---

¿Que limitaciones presenta la parealización?

- Maquina capacidad limitada de procesadores
- Hay una sola memoria
- Hay latencias relacionadas con la escritura a memoria caches (misses)

---

¿Como paralelizamos?

- map: División de tareas
- reduce: resultado de cada tarea que unimos al resultado final

---

Recursos compartido

- Una sola memoria
- Por más procesadores que tengamos la memoria nos representa un cuello de botella

---

¿En terminos de independencia como podemos paralelizar?

Las subtareas debe ser **independientes**

---

Ley ahmdal

No da un estimado teórico de hasta punto podemos acelerar un proceso usando paralelización

La Ley de Amdahl nos permite calcular la ganancia teórica en tiempo al paralelizar un proceso. La fórmula es:

```
T(p,s) = T * (1-p + p/s)

Donde:
T = Tiempo total de la tarea secuencial
p = Porcentaje paralelizable
s = Número de tareas generadas (división)
```

Por ejemplo: Si tenemos un proceso donde el 60% se puede paralelizar (p=0.6) y utilizamos 4 hilos (s=4), el tiempo de ejecución sería:

```
T(0.6, 4) = T * (0.4 + 0.6/4)
T(0.6, 4) = T * (0.4 + 0.15)
T(0.6, 4) = T * 0.55
```

Esto significa que el tiempo de ejecución sería aproximadamente 1.43 veces más rápido que la versión secuencial. Incluso con infinitos procesadores, el tiempo más rápido posible estaría limitado por la parte secuencial del código.

Localidad

Recursos compartidos

- Memoria: localidad temporal: Acceso a las posiciones de memoria compartidas por hilos. Condición de carrera
- Memoria: localidad espacial: Cantidad de memoria gestionada por cada hilo (secuencialidad de los datos)