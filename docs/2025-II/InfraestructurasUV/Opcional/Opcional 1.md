
# Punto 1 Estudio de herramienta

Este punto vale 25 puntos  
Durante la evaluación del rendimiento, el ingeniero utiliza la herramienta `Valgrind` con el modo `cachegrind` para analizar el comportamiento de la memoria caché.  
La ejecución de una de las versiones del programa produce la siguiente salida simplificada:

```bash
==12345== Cachegrind, a cache and branch-prediction profiler
==12345==
--12345-- D1  misses:      4,201,235
--12345-- LLd misses:        812,345
--12345-- D1  miss rate:      35.2%
--12345-- LLd miss rate:      12.3%
--12345-- LLi misses:              0
--12345-- I1  miss rate:       0.1%
==12345==
==12345== ERROR SUMMARY: 1 errors from 1 contexts (suppressed: 0)
==12345== Invalid read of size 4
==12345==    at 0x401234: main (suma_matriz.cpp:25)
==12345==  Address 0x6040508 is 8 bytes after a block of size 8000000 alloc'd
==12345==    at 0x4C2F1A3: operator new[](unsigned long) (vg_replace_malloc.c:431)
````

**Pregunta:**  
Explique qué indica la salida anterior con respecto al uso de memoria y la caché.  
Describa cuál podría ser la causa del error y qué modificaciones deberían realizarse en el programa para corregir el acceso inválido y mejorar el aprovechamiento de la memoria caché.

# Solucion

La salida indica que el programa está generando una cantidad elevada de fallos de caché, especialmente en la caché de datos de primer nivel (D1), con una tasa de fallos del 35.2%. Esto sugiere que el acceso a memoria no está siguiendo un patrón que favorezca la localidad espacial o temporal, lo cual suele ocurrir con estructuras grandes o recorridos de memoria desalineados con el orden en que están almacenados los datos.

El número de fallos en la caché de último nivel (LLd misses = 812,345) también es significativo, lo que confirma que muchas de las direcciones requeridas no se encuentran en niveles superiores de la jerarquía y deben cargarse desde memoria principal, aumentando el tiempo de ejecución.

El error reportado (`Invalid read of size 4`) indica que el programa está intentando leer memoria fuera del rango asignado. Valgrind reporta que la dirección accedida se encuentra **8 bytes después** del bloque reservado de 8,000,000 bytes. Esto es consistente con un acceso que sobrepasa el límite de un arreglo dinámico, normalmente causado por un índice que excede su rango válido.

La causa más probable es un error en los índices de una matriz, por ejemplo un desbordamiento del tipo:

```cpp
for (int i = 0; i <= n; i++)
```
O bien se esta recorriendo mal una matriz, por ejemplo por columnas
```cpp
for (int j = 0; j <= n; j++) {
	for(int i = 0; i<=n; i++) {
		arr[i][j] = ...
```


---

# Punto 2 Analisis de caso

Este punto vale 25 puntos

Un ingeniero de software está realizando un experimento de rendimiento con matrices en C++.  
Para una matriz cuadrada $n \times n$ de números enteros, implementa dos versiones del mismo cálculo con el siguiente código base:

```cpp
long long suma = 0;
for (int i = 0; i < n; ++i)
    for (int j = 0; j < n; ++j)
        suma += M[i][j];
```

y

```cpp
long long suma = 0;
for (int j = 0; j < n; ++j)
    for (int i = 0; i < n; ++i)
        suma += M[i][j];
```

Tras realizar un análisis de rendimiento (_profiling_) con matrices grandes, se obtienen los siguientes resultados:

|Versión A|0.1 ms|1% de cache misses|
|---|---|---|
|Versión B|10 ms|40% de cache misses|

Explique a qué se debe la diferencia en los tiempos y en los fallos de caché.

## Solución

La diferencia proviene del **orden en que se accede a la memoria** y de cómo las matrices están almacenadas físicamente en C++.

En C y C++, una matriz bidimensional se almacena en **row-major order**:  
los elementos de una misma **fila** están contiguos en memoria, y las filas están una después de la otra.

---
### Versión A

```cpp
for (int i = 0; i < n; ++i)
    for (int j = 0; j < n; ++j)
        suma += M[i][j];
```

Este recorrido avanza por **filas**, respetando el orden natural de la memoria:

```
M[0][0], M[0][1], M[0][2], ..., M[1][0], M[1][1], ...
```

- Accesos **contiguos** en memoria.
- Excelente **localidad espacial**: cada vez que se carga una línea de caché, varios elementos siguientes también sirven.
- Menos fallos de caché → **1%**.
- El procesador aprovecha mejor la precarga (**prefetching**).
- Tiempo muy bajo: **0.1 ms**.
    

---

### Versión B

```cpp
for (int j = 0; j < n; ++j)
    for (int i = 0; i < n; ++i)
        suma += M[i][j];
```

Aquí el recorrido es **por columnas**:

```
M[0][0], M[1][0], M[2][0], ..., M[0][1], M[1][1], ...
```


- Se salta grandes bloques de memoria en cada incremento de `i`.
- Pésima localidad espacial: cada acceso cae casi siempre en otra línea de caché.
- Aumentan drásticamente los fallos de caché → **40%**.
- Mucho tiempo de espera por cargas desde memoria principal.
- Tiempo alto: **10 ms**.
    
---

# Punto 3 Resolución de problema

Este punto vale 50 puntos

Un investigador está desarrollando una biblioteca científica en C++ que requiere realizar operaciones intensivas con matrices.  
En particular, necesita implementar la **multiplicación de matrices cuadradas $n \times n$** de forma eficiente, aprovechando el paralelismo mediante el uso de **hilos (threads)**.

La multiplicación de dos matrices $A$ y $B$ genera una matriz $C$, donde cada elemento se define como:

$$
C_{ij} = \sum_{k=1}^{n} A_{ik} \times B_{kj}  
$$

Por ejemplo, para $n = 2$:

$$
A =  
\begin{bmatrix}  
1 & 2 \\  
3 & 4  
\end{bmatrix},  
\quad  
B =  
\begin{bmatrix}  
5 & 6 \\  
7 & 8  
\end{bmatrix},  
\quad  
C = A \times B =  
\begin{bmatrix}  
19 & 22 \\  
43 & 50  
\end{bmatrix}  
$$

Dado que la multiplicación de matrices requiere $O(n^3)$ operaciones, se desea paralelizar el cálculo para aprovechar los núcleos disponibles del procesador.

## Preguntas (razonamiento + práctica)

### Análisis de dependencias

Vale 10 puntos

- Analice si el cálculo del elemento $C_{ij}$ depende de otros elementos de  $C$.


#### Diseño del paralelismo
 puntos  
Suponga que dispone de $T$ hilos de ejecución.

- Explique cómo dividiría el trabajo entre los hilos (por filas, columnas o submatrices).
    
- Describa qué precauciones deben tomarse para evitar condiciones de carrera o conflictos de escritura en la matriz resultante.
    

### Implementación conceptual

Vale 20 puntos  
Escriba un fragmento de código en C++ donde cada hilo calcule una parte de la matriz $C$.  
Debe usar la clase `std::thread` y asegurar que los resultados se almacenen correctamente en una estructura compartida.

### Ejemplo de ejecución

Vale 5 puntos  
Suponga:

$$
n = 4, \quad T = 2  
$$

- Indique qué filas o columnas procesa cada hilo.
    
- Muestre la matriz resultante $C$ para el caso de matrices con valores pequeños y enteros.

## Análisis de dependencias (10 puntos)

El cálculo de cada elemento $C_{ij}$ depende únicamente de:
- la fila $i$ de la matriz $A$,
- la columna $j$ de la matriz $B$.

No depende de ningún otro elemento de la matriz resultante $C$.  
Cada posición de $C$ es un cálculo **independiente** y no requiere conocer valores previamente computados.  
Por tanto, no existen dependencias entre elementos de $C$.  
Esto permite que múltiples hilos calculen distintas filas, columnas o bloques sin interferencia, siempre que no escriban en la misma posición.

---

## Diseño del paralelismo (15 puntos)

### División del trabajo

Una estrategia eficiente consiste en repartir **filas completas** de la matriz $C$ entre los hilos.  
Si se tienen $T$ hilos, se pueden asignar:

- Rango de filas $[i_{\text{ini}}, i_{\text{fin}})$ para cada hilo.
- Cada hilo calcula únicamente los elementos $C_{ij}$ donde $i$ pertenece a su rango asignado.

Motivos:
- Las filas de $A$ están contiguas en memoria (row-major), lo que mejora el uso de caché.
- No hay riesgo de que dos hilos escriban en la misma posición.
- Fácil de implementar y de balancear.

También es válido dividir por columnas o por submatrices, pero la división por filas suele ser la más eficiente por la organización de la memoria.

### Precauciones para evitar condiciones de carrera

- Cada hilo debe escribir en **zonas distintas** de la matriz $C$.  
  Mientras cada hilo tenga asignado un conjunto exclusivo de filas o columnas, no habrá conflictos.
- La matriz de entrada $A$ y $B$ deben ser **solo lectura**, compartidas sin modificación.
- No se requieren mutex ni bloqueos si cada hilo escribe únicamente en su región.

---

## Implementación conceptual (20 puntos)

```cpp
#include <vector>
#include <thread>

void multiplicar_rango(
    const std::vector<std::vector<int>>& A,
    const std::vector<std::vector<int>>& B,
    std::vector<std::vector<int>>& C,
    int fila_ini, int fila_fin, int n)
{
    for (int i = fila_ini; i < fila_fin; ++i) {
        for (int j = 0; j < n; ++j) {
            int suma = 0;
            for (int k = 0; k < n; ++k) {
                suma += A[i][k] * B[k][j];
            }
            C[i][j] = suma;
        }
    }
}

int main() {
    int n = 4;
    int T = 2;

    std::vector<std::vector<int>> A(n, std::vector<int>(n));
    std::vector<std::vector<int>> B(n, std::vector<int>(n));
    std::vector<std::vector<int>> C(n, std::vector<int>(n, 0));

    std::vector<std::thread> hilos;
    int filas_por_hilo = n / T;

    for (int t = 0; t < T; ++t) {
        int ini = t * filas_por_hilo;
        int fin = (t == T-1) ? n : ini + filas_por_hilo;
        hilos.emplace_back(multiplicar_rango, std::ref(A), std::ref(B), std::ref(C), ini, fin, n);
    }

    for (auto& h : hilos) h.join();
}
````

Características importantes:

- Cada hilo recibe un **rango exclusivo** de filas.
    
- La estructura `C` es compartida pero accesada en regiones independientes.
    

---
## Ejemplo de ejecución (5 puntos)

Suponga:

$$ 
n = 4, \quad T = 2  
$$

### Distribución de trabajo

- **Hilo 1:** filas 0 y 1
    
- **Hilo 2:** filas 2 y 3
    

Cada hilo calcula por completo sus filas de la matriz $C$.

### Ejemplo con matrices pequeñas

Sea:

$$ 
A =  
\begin{bmatrix}  
1 & 1 & 1 & 1 \\  
2 & 2 & 2 & 2 \\  
3 & 3 & 3 & 3 \\  
4 & 4 & 4 & 4  
\end{bmatrix},  
\quad  
B =  
\begin{bmatrix}  
1 & 2 & 3 & 4 \\  
1 & 2 & 3 & 4 \\  
1 & 2 & 3 & 4 \\  
1 & 2 & 3 & 4  
\end{bmatrix}  
$$

Cada elemento de $C$ cumple:

$$ 
C_{ij} = \sum_{k=0}^{3} A_{ik} \cdot B_{kj}  
$$

Como cada fila de $A$ tiene valores constantes:

- Fila 0: suma de 4 elementos → $1+1+1+1 = 4$
    
- Fila 1: suma → $8$
    
- Fila 2: suma → $12$
    
- Fila 3: suma → $16$
    

Y cada columna de $B$ tiene valores:

$$ 
[1,1,1,1], [2,2,2,2], [3,3,3,3], [4,4,4,4]  
$$

Entonces:

$$ 
C =  
\begin{bmatrix}  
4 & 8 & 12 & 16 \\  
8 & 16 & 24 & 32 \\  
12 & 24 & 36 & 48 \\  
16 & 32 & 48 & 64  
\end{bmatrix}  
$$

Hilo 1 produce las dos primeras filas; hilo 2, las dos últimas.

---