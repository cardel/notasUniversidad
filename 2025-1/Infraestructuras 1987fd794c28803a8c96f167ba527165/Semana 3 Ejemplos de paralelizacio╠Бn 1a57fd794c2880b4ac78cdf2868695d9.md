# Semana 3: Ejemplos de paralelización

# Ejemplos de clase

https://github.com/cardel/infra-2025

# Threads

¿Que es?

Nos permite especificar el numero de hilos a los cuales vamos a partir un proceso

El número depende de:

- Capacidad de la maquina
- Si estamos en una virtualización o no
- Del tamaño de la tarea (tareas pequeñas es mejor hacerlas secuencial)
- De la gestión de procesos del S.O

---

Aspectos

```makefile
rutina:
	g++ -o <exe> <archivo.cpp> -lpthread
		
```

```cpp
#include <thread>

thread nombre(funcion, args.....); //Sin retorno
thread nombre([&salida](){salida = funcion(args...)}); //Un solo retorno
thread nombre(funcion, arg1, ref(argn),...);
```

Aquí tienes un ejemplo de cómo calcular la norma de un vector usando 4 hilos en C++:

```cpp
#include <iostream>
#include <vector>
#include <thread>
#include <cmath>
#include <chrono>

using namespace std;

const int VECTOR_SIZE = 10000000; // Vector grande para mejor demostración
vector<double> v(VECTOR_SIZE, 2.0); // Inicializamos con 2.0 para ejemplo
double partial_results[4] = {0,0,0,0};

void calculatePartialNorm(int start, int end, int thread_id) {
    double sum = 0.0;
    for(int i = start; i < end; i++) {
        sum += v[i] * v[i];
    }
    partial_results[thread_id] = sum;
}

int main() {
    // Crear 4 hilos para calcular la norma
    thread t1(calculatePartialNorm, 0, VECTOR_SIZE/4, 0);
    thread t2(calculatePartialNorm, VECTOR_SIZE/4, VECTOR_SIZE/2, 1);
    thread t3(calculatePartialNorm, VECTOR_SIZE/2, 3*VECTOR_SIZE/4, 2);
    thread t4(calculatePartialNorm, 3*VECTOR_SIZE/4, VECTOR_SIZE, 3);

    // Esperar a que todos los hilos terminen
    t1.join();
    t2.join();
    t3.join();
    t4.join();

    // Sumar resultados parciales y calcular raíz cuadrada
    double final_result = sqrt(partial_results[0] + partial_results[1] + 
                             partial_results[2] + partial_results[3]);

    cout << "La norma del vector es: " << final_result << endl;
    return 0;
}

```

Para compilar el programa, usa el siguiente comando:

```bash
g++ -o norma norma.cpp -lpthread
```

Este ejemplo divide el vector en 4 partes igualesy cada hilo procesa su parte correspondiente. La división se hace en segmentos de 0 a n/4, n/4 a n/2, n/2 a 3n/4, y 3n/4 a n.

# TBB

```cpp
#include <iostream>
#include <tbb/parallel_for.h>
#include <tbb/blocked_range.h>
#include <tbb/parallel_reduce.h>
```

Paralelización

- No definimos un número dado de hilos
- Vamos utilizar las estructuras que nos brinda la librería

---

For paralelo

```cpp
    tbb::parallel_for(tbb::blocked_range<int>(start, end), [&](tbb::blocked_range<int> r) {

```

- Genera un rango entre o y size
- Se crea un iterador r el cual va realizar la partición

---

Reduce paralelo

```cpp
void sumaTBB(int start, int end, long &sum) {
    sum = tbb::parallel_reduce(tbb::blocked_range<int>(start, end), 0L, [&](tbb::blocked_range<int> r, long init) {
        long sum = init;
        for (int i = r.begin(); i < r.end(); i++) {
            sum += v[i];
        }
        return sum;
    },std::plus<long>());
```

1. Se genera un rango entre 0 y size

2.. Se tiene el iterador r tal cual en el for paralelo

1. Vamos a hacer resultados parciales
2. Con 

```cpp
std::plus<long>());
```

Vamos a reducir los valores parciales (sumando)

# Resumen

Esta página describe dos métodos principales de paralelización:

**1. Threads (Hilos)**

- Son una forma de dividir un proceso en múltiples hilos
- La elección del número de hilos depende de factores como la capacidad de la máquina, virtualización, tamaño de la tarea y gestión del SO
- Se implementa en C++ usando la librería thread y requiere la flag -lpthread para compilar

**2. TBB (Thread Building Blocks)**

- No requiere definir un número específico de hilos
- Utiliza estructuras propias de la librería
- Ofrece herramientas como parallel_for y parallel_reduce para paralelización

La página incluye ejemplos prácticos de implementación, incluyendo un caso detallado de cálculo de la norma de un vector usando threads.