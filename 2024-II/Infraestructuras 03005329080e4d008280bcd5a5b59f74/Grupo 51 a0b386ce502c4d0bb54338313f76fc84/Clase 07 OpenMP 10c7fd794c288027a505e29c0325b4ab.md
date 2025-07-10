# Clase 07 OpenMP

---

¿Que es?

API: Application Programming Interface

Enfocada a sistemas multinucleo

Eficiente para paralelizar diferentes procesos

Es ampliamente configurable e incluye directivas para paralelización de tareas, iteradores, ciclos, entre otros

Nos permite controlar como iteramos

Sin embargo, en este curso sólo abordaremos los **fundamentos**

---

Paralelización

- Tareas faciles de parelelizar: Suma de vectores, operaciones **independientes**
- Tareas dificiles de pararelizar: Interoperables (producto punto)
    - Multiplicación 1 a 1 w[i] = v[i]*u[i]
    - Suma de los resultados  $\sum \limits_{i=0}^{n}w[i]$

---

# Acceso a la memoria Cache

Limitaciones

El acceso esta optimizado para operaciones secuenciales en memoria, el acceso aleatorio o salteado produce latencias

---

cache fault

Es cuando un core intenta actualizar la memoria cache utilizada por otro core

La solución es utilizar diferentes niveles L1 (que cada core una independiente) L2 y L3 que son compartidos

---

NUMA

SIstema multicore (un solo procesador multiples nucleos), cada procesador tiene su propia memoria cache

---

# OpenMP

Paralelización basada en hilos

1. Deben instalar openmp / libopenmp
2. Vamos a utilizar unos bloques para indicar que queremos para parelizar

```cpp
#pragma omp <instrucciones>
{

}
```

```cpp
g++ -o prog archivo.cpp -fopenmp
```

---

Gestión variables

- Privada: Para cada hilo
- COmpartida: Compartida entre todos los hilos

---

Scheduling

Gestión de hilos

- Static: lanza los hilos en bloques de tamaño fijo
- Dynamic: Asigna bloques dinamicamente
- guided: Es lo mismo que dynamic pero los bloques mas pequeños
- auto: Lo selecciona el compilador o S.O
- runtime: Tiempo de ejecución

---

Evitar condiciones de carrera

Condición critical que fuerza a que una instrucción sea ejecuta por un sólo hilo