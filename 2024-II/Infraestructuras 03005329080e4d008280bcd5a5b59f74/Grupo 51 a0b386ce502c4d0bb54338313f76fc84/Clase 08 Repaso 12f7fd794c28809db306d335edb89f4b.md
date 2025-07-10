# Clase 08: Repaso

# Acuerdos

Parcial 1 13 de Nov

# Introducción al paralelismo

Motivación

$$
\forall i \in S, c[i] = a[i]+b[i]
$$

a = [1,2,3,4,5,6]

b = [2,4,6,8,10,12]

c = [3, 6,9,12,15,18]

Independientes

Aprovechar la capacidad de computo multinucleo para hacer tareas más rapido

---

Limitaciones

v = [1,2,3,4,5,6]

v[i] = v[i]+v[i-1]

v = [1,3,6,10,15,21]

1,2,3,4,5,6

2,4,1,3,6,5

v = [1,3,6,7,12,11]

Dependencia, este es un de los problemas del paralelismo

Dado el tamaño de la memoria cache no podemos saturarla con datos de procesos concurrentes

Dado el número de procesadores que no es infinito no podemos tener un número ilimitado de procesos

- Localidad temporal
- Localidad especial

---

Ley ahmdal

Esta ley nos dice que podemos tener una ganancia en tiempo en la ejecución de programas

1. Programas tienen partes secuenciales que no se pueden paralelizar
2. Supone que la capacidad de paralelizar es ilimitada (no es real)

Nos da un indicio de cómo podemos obtener ganancia en tiempo paralelizando

---

# Recursos

```bash
#Visualizar esquema del procesador
lstopo 

#Ver tasas de fallo y escritura a la cache
perf stat -B dd if=/dev/zero of=/dev/null count=1000000 
```

# Profiling

¿Que es?

- Medir recursos de uso de una aplicación
    - Tiempo de ejecución
    - Uso de memoria
    - uso de Disco
    - Operaciones en memoria cache
    - etc

---

Librerias

- time
- timeit
- pyinstrument
- cprofile
- perf: Es una utilidad de Linux
- hpy

# Multithreading vs Multiprocessing

¿Cual es la diferencia?

- Un proceso esta compuesto por uno o más hilos
- Cada proceso de INDEPENDIENTE en memoria, los hilos comparten la memoria del proceso
- Podemos tener procesos en diferentes de nodos de cómputo