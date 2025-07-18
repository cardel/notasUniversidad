# Sesión 07: OpenMP

# OpenMP

Que es

API: Application programming interface. C++

AProvechar la existencia de sistema multiprocesador

Procesos que son facilmente paralelizables: Suma de dos vectores w[i] = v[i]+u[i] 

Procesos que dificilmente paralelizables, producto punto

w[i] = v[i]*u[i]  —> x = w[0]+w[1]+…+w[n]

En estos casos es necesario reorganizar las operaciones

---

Acceso a memoria

La idea es trabajar la cache de forma optima

El acceso secuencial direccion + 0,1,2,3,…. está optimizado, por el acceso aleatorio direccion + random() requiere procesamiento adicional

No es lo mismo acceder a una matriz filas por columnas que columnas por filas (5x)

---

NUMA

Cada procesador tiene su banco de memoria, agiliza el uso de la memoria cache

Pasa con la cache LP

---

Trabajar con OPENMP

- Instalada la librería
- Establecemos el número de procesadores (usualmente se hace forma automática)

```bash
g++ -o ejemplo1 ejemplo1.cpp -fopenmp
```

---

Que tipos de bloques tenemos

- OpenMP gestiona variables compartidas y las privadas, ya que cada hilo tiene su propia pila

```cpp
#pragma omp parallel for reduction (+:c)
//Operaciones de reducción

#pragma omp parallel private(<var>) shared(<var)
//Variables que son privadas solo existen en cada hilo
//Shared son aquellas que son compartidas en varios

#pragma omp critical
//Para evitar condiciones de carrera, es cuando dos hilos intentar acceder a la misma variable

```

---

Schedule

1. Static: Divide las interaciones en bloques de tamaño fijo
2. Dynamic: Asigna bloques dinamicamente a cada hilo
3. guided: Es como dynamic pero los bloques son mas pequeños
4. auto: Decisión del compilador o S.O
5. runtime: Decisión del schedule se hace en tiempo de ejecución

```cpp
#pragma omp parallel for schedule(dynamic)
```