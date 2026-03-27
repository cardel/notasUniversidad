Esta herramienta nos permite evaluar programas en C++, sin embargo agrega overhead, nos permite analizar lo que sucede en la memoria cache

D1 misses: Numero de fallos cache L1
C1 miss rate: Porcentaje de fallo cache L1
LLd miss rate: Suma de acceso a memoria + fallos cache L1

Esto nos permite analizar si nuestras funciones tienen mal manejo de memoria

Invocar a la tool

```bash
 valgrind --tool=callgrind --dump-in
str=yes  --simulate-cache=yes --collect-jumps=yes .
/programa
```

Esto nos permite analizar el programa y va generar un archivo .out.pid que nos permite mediante programas Kcachegrind analizar las trazas y detectar donde hay problemas

Archivo bueno.cpp
```c++
#include <cstdio>

int SIZE = 10000;

long sumaMatriz(int **matriz) {
  long suma = 0;
  for (int i = 0; i < SIZE; i++) {
    for (int j = 0; j < SIZE; j++) {
      suma += matriz[i][j]; 
    }
  }
  return suma;
}

int main(int argc, char *argv[]) {
  int **arr = new int *[SIZE];
  for (int i = 0; i < SIZE; i++) {
    arr[i] = new int[SIZE];
    for (int j = 0; j < SIZE; j++) {
      arr[i][j] = i + j;
    }
  }
  long res = sumaMatriz(arr);
  printf("%ld\n", res);
  return 0;
}
```

Aqui se suman las columnas por filas y luego columnas (forma correcta)


malo.cpp

Va hacer la suma por columnas y luego por filas (patron incorrecto)


```c++
#include <cstdio>

int SIZE = 10000;

long sumaMatriz(int **matriz) {
  long suma = 0;
  for (int i = 0; i < SIZE; i++) {
    for (int j = 0; j < SIZE; j++) {
      suma += matriz[j][i]; // Suma por columnas
    }
  }
  return suma;
}

int main(int argc, char *argv[]) {
  int **arr = new int *[SIZE];
  for (int i = 0; i < SIZE; i++) {
    arr[i] = new int[SIZE];
    for (int j = 0; j < SIZE; j++) {
      arr[i][j] = i + j;
    }
  }
  long res = sumaMatriz(arr);
  printf("%ld\n", res);
  return 0;
}
```

Debemos compilar con la opción -g para habilitar debug y así el instrumentador pueda analizar el código


```bash
g++ -g -o bueno Bueno.cpp
g++ -g -o malo Malo.cpp
```

Y posteriormente hacer instrumentación

```bash
 valgrind --tool=callgrind --d
ump-instr=yes  --simulate-cache=yes --collect-jumps=yes ./bueno

 valgrind --tool=callgrind --d
ump-instr=yes  --simulate-cache=yes --collect-jumps=yes ./malo
```

Va a generar dos archivos out

```bash
 ls *.out*             
callgrind.out.45187  callgrind.out.46257
```

Estos dos archivos los podemos cargar con la herramienta Kcachegrind

Para el caso de Bueno.cpp

![](attachments/Pasted%20image%2020260326111306.png)

Aqui el L1 DataWrite Miss es 0%

Para el caso de Malo.cpp

![](attachments/Pasted%20image%2020260326111403.png)

El L1 DataWrite Miss es del 99.06% clara evidencia de sobreescritura de memoria cache

Observar que la Write es el factor que indica que hay mal uso de memoria