Valgrind es una herramienta que permite detectar errores de gestión de memoria y perfilar el rendimiento de programas escritos en C++. La herramienta más utilizada se llama callgrind, se utiliza.

1. Realizar mediciones en el código
2. El código ejecutado en valgrind es 10 veces más lento debido al profiling
3. Este genera archivos de salida con extension .pid

# Ejemplo

```c++
#include <cstdio>

long fib(int n) {
  if (n <= 1) {
    return n;
  }
  else {
    return fib(n-1)+fib(n-2);
  }
}

int main (int argc, char *argv[]) {
  printf("fib (12) %ld\n",fib(12));  
  return 0;
}
```

```bash
g++ -o exe <archivo>.cpp
```

Evaluación con valgrind

```bash
valgrind --tool=callgrind --dump-instr=yes --simulate-cache=yes --collect-jumps=yes ./exe
```

1. --tool: Herramienta estoy utilizando, callgrind
2. --dump-instr permite volcado de instrucciones
3. --simulate-cache simula el uso de la memoria cache
4. --collect-jumps Evalua los saltos de código

para este caso vamos a evaluar el acceso de memoria para recorrer un arreglo en 2D

```c++
//bueno
void initialize(int **arr, int n) {
  for(int i=0; i<n; i++) {
    arr[i] = new int[n];
  }

  for(int i=0; i<n; i++) {
    for(int j=0; j<n; j++){
      arr[i][j] = 0;
    }
  }
}
//malo
void initialize(int **arr, int n) {
  for(int i=0; i<n; i++) {
    arr[i] = new int[n];
  }

  for(int j=0; j<n; j++) {
    for(int i=0; i<n; i++){
      arr[i][j] = 0;
    }
  }
}

```
En el recorrido de bueno.cpp tenemos que el programa recorre secuecialmente las estructuras de memoria, en su lugar malo.cpp recorre mediante saltos, esto nos da el problema de localidad espacial (predicción del siguiente a ser leido, que en el caso de un arreglo 2D es la fila)

```bash
valgrind --tool=callgrind --dump-instr=yes --
simulate-cache=yes --collect-jumps=yes ./malo
```

Aqui le estoy diciendo que evalue el programa ./malo (recordar que este es el ejecutable)

```bash
#bueno
==3744== D1  misses:        6,288,342  (     20,337 rd +   6,268,005 wr)
==3744== LLd misses:        6,276,773  (      9,953 rd +   6,266,820 wr)
==3744== D1  miss rate:           0.8% (        0.0%   +         3.1%  )
==3744== LLd miss rate:           0.8% (        0.0%   +         3.1%  )
==3744== 
==3744== LL refs:           6,290,165  (     22,160 rd +   6,268,005 wr)
==3744== LL misses:         6,278,551  (     11,731 rd +   6,266,820 wr)
==3744== LL miss rate:            0.3% (        0.0%   +         3.1%  )

#malo

==3886== D   refs:        801,663,815  (601,143,081 rd + 200,520,734 wr)
==3886== D1  misses:      112,544,390  ( 12,529,071 rd + 100,015,319 wr)
==3886== LLd misses:       98,122,419  (     29,955 rd +  98,092,464 wr)
==3886== D1  miss rate:          14.0% (        2.1%   +        49.9%  )
==3886== LLd miss rate:          12.2% (        0.0%   +        48.9%  )
==3886==
==3886== LL refs:         112,546,215  ( 12,530,896 rd + 100,015,319 wr)
==3886== LL misses:        98,124,199  (     31,735 rd +  98,092,464 wr)
==3886== LL miss rate:            4.3% (        0.0%   +        48.9%  )
```

En el caso de malo se aprecia un incremento de los fallos de lectura de cache (sobreescritura), es evidencia de mal manejo de memoria, que sucede en la operación wr (write)

En este punto tenemos un problema, no sabemos exactamente donde está el problema

# Medición partes del código


```c++
#include <cstdio>
#include <valgrind/callgrind.h>

using namespace std;

void initialize(int **arr, int n) {
  for(int i=0; i<n; i++) {
    arr[i] = new int[n];
  }

  for(int i=0; i<n; i++) {
    for(int j=0; j<n; j++){
      arr[i][j] = 1;
    }
  }
}

long suma(int ** arr, int n) {
  long suma = 0L; 
  for(int i=0; i<n; i++) {
    for(int j=0; j<n; j++){
      suma += arr[j][i];
    }
  }
  return suma;
}

int main (int argc, char *argv[]) {
  int size = 10000;
  int **arr = new int*[size];
  
  CALLGRIND_START_INSTRUMENTATION; //iniciar instrumentacion
  CALLGRIND_TOGGLE_COLLECT; //iniciar medicion
  initialize(arr,size);
  CALLGRIND_TOGGLE_COLLECT; //parar medicion
  CALLGRIND_STOP_INSTRUMENTATION; //parar instrumentacion
  
  long res = suma(arr,size);


  printf("Suma: %ld\n", res);|
  

  return 0;
}
```
En este caso con las directivas

```c++
  CALLGRIND_START_INSTRUMENTATION; //iniciar instrumentacion
  CALLGRIND_TOGGLE_COLLECT; //iniciar medicion
  funcion_a_evaluar(...)
  CALLGRIND_TOGGLE_COLLECT; //parar medicion
  CALLGRIND_STOP_INSTRUMENTATION; //parar instrumentacion
```

Compilar

```bash
g++ -g -o programa programa.cpp
```

Dado que valgring es una herramienta de profiling (debug) debe usarse el modificador -g


```bash
valgrind --tool=callgrind --dump-instr=yes --
simulate-cache=yes --collect-jumps=yes --collect-atstart=no --instr-atstart=no ./bipolar
```

Tomar en cuenta que bipolar es el ejecutable

En el primer caso, obtengo lo siguiente

```bash
==5775== D   refs:        800,720,015  (600,456,682 rd + 200,263,333 wr)
==5775== D1  misses:        6,266,403  (      1,323 rd +   6,265,080 wr)
==5775== LLd misses:        6,266,139  (      1,265 rd +   6,264,874 wr)
==5775== D1  miss rate:           0.8% (        0.0%   +         3.1%  )
==5775== LLd miss rate:           0.8% (        0.0%   +         3.1%  )
==5775== 
==5775== LL refs:           6,266,496  (      1,416 rd +   6,265,080 wr)
==5775== LL misses:         6,266,232  (      1,358 rd +   6,264,874 wr)
==5775== LL miss rate:            0.3% (        0.0%   +         3.1%  )
```

Ahora hago este cambio

```c++
  CALLGRIND_START_INSTRUMENTATION; //iniciar instrumentacion
  CALLGRIND_TOGGLE_COLLECT; //iniciar medicion
  long res = suma(arr,size);
  CALLGRIND_TOGGLE_COLLECT; //parar medicion
  CALLGRIND_STOP_INSTRUMENTATION; 
```

Obtengo lo siguiente

```bash
==5930== D   refs:        900,060,014  (700,040,007 rd + 200,020,007 wr)
==5930== D1  misses:      112,509,998  (112,509,997 rd +           1 wr)
==5930== LLd misses:       98,100,731  ( 98,100,730 rd +           1 wr)
==5930== D1  miss rate:          12.5% (       16.1%   +         0.0%  )
==5930== LLd miss rate:          10.9% (       14.0%   +         0.0%  )
==5930== 
==5930== LL refs:         112,510,001  (112,510,000 rd +           1 wr)
==5930== LL misses:        98,100,734  ( 98,100,733 rd +           1 wr)
==5930== LL miss rate:            3.8% (        4.1%   +         0.0%  )

```
Esto nos dice que la función sumar esta haciendo mal uso de la memoria


# Kcachegrind

Esta herramienta permite visualizar graficamente los reportes de Valgrind

![](attachments/Pasted%20image%2020251007155304.png)

En este caso estamos comparando bueno.cpp (buen manejo de memoria), con malo.cpp (mal manejo de memoria) el reporte nos muestra que se incrementa los fetch miss en la memoria cache (carga de datos) lo que nos esta indicando que hay problema en gestión de memoria.