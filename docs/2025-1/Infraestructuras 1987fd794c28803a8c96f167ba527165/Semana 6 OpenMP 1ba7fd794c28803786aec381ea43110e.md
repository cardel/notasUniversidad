# Semana 6: OpenMP

# Acceso memoria cache

Aspectos

- La memoria cache el cuello de botella
- Importa como accedemos a la memoria, hay que hacerlo de forma secuencial, tener en cuenta que los arrays n dimensionales son siempre 1D solo que hay capa lógica de manejo [i][j] = [i*j + j]

```cpp
#include <chrono>
#include <cstdio>

using namespace std;

const int N = 10000;
// arreglo bidimensional de N x N
int arr[N][N];

void llenar() {
  for (int i = 0; i < N; i++) {
    for (int j = 0; j < N; j++) {
      arr[i][j] = 1; // arr[i*j+j] = 1
    }
  }
}

void llenarv2() {
  for (int i = 0; i < N; i++) {
    for (int j = 0; j < N; j++) {
      arr[j][i] = 1;
    }
  }
}

int main() {
  auto start = chrono::steady_clock::now();
  llenar();
  auto end = chrono::steady_clock::now();
  auto diff = end - start;
  printf("%s : %f\n", "Duración en milisegundos: ",
         chrono::duration<double, milli>(diff).count());

  auto start2 = chrono::steady_clock::now();
  llenarv2();
  auto end2 = chrono::steady_clock::now();
  auto diff2 = end2 - start2;
  printf("%s : %f\n", "Duración en milisegundos: ",
         chrono::duration<double, milli>(diff2).count());
}
```

```
Duración en milisegundos:  : 108.878309
Duración en milisegundos:  : 163.521305
```

# OpenMP

Librería

- Nos ofrece un API para paralelizar
- Funciona a través de anotaciones #pragma
- Tiene funciones avanzadas para la gestión memoria, variables, etc

```cpp
#include <chrono>
#include <cstdio>
#include <omp.h>
#include <vector>

using namespace std;

const int SIZE = 1e9;
vector<int> v(SIZE);

void llenar() {
#pragma omp parallel for
  for (int i = 0; i < SIZE; i++)
    v[i] = 1;
}

void llenarv2() {
#pragma omp parallel for schedule(static, 5000)
  for (int i = 0; i < SIZE; i++)
    v[i] = 1;
}

void critica() {
#pragma omp critical
  for (int i = 1; i < SIZE; ++i) {
    v[i] = v[i - 1] + 1;
  }
}

void sumar(int &res) {
  int sum = 0;
#pragma omp parallel for reduction(+ : sum)
  for (int i = 0; i < SIZE; i++)
    sum += v[i];
  res = sum;
}

int main() {
  auto start = chrono::high_resolution_clock::now();
  llenar();
  auto end = chrono::high_resolution_clock::now();
  // Duración en milisegundos
  auto diff = end - start;

  printf("Tiempo: %f\n", chrono::duration<double, milli>(diff).count());

  auto start2 = chrono::high_resolution_clock::now();
  llenarv2();
  auto end2 = chrono::high_resolution_clock::now();
  // Duración en milisegundos
  auto diff2 = end2 - start2;
  printf("Tiempo dynamic: %f\n",
         chrono::duration<double, milli>(diff2).count());

  int sum = 0;
  sumar(ref(sum));
  printf("Suma: %d\n", sum);

  auto start3 = chrono::high_resolution_clock::now();
  critica();
  auto end3 = chrono::high_resolution_clock::now();
  // Duración en milisegundos
  auto diff3 = end3 - start3;
  printf("Tiempo crítica: %f\n",
         chrono::duration<double, milli>(diff3).count());

  // Imprimir los primeros 20 elementos
  for (int i = SIZE - 20; i < SIZE; ++i)
    printf("%d ", v[i]);
}
```

```makefile
compilar:
	g++ -o exe *.cpp -fopenmp
	./exe
	rm ex
```

[https://www.openmp.org/wp-content/uploads/OpenMP-RefGuide-6.0-OMP60SC24-web.pdf](https://www.openmp.org/wp-content/uploads/OpenMP-RefGuide-6.0-OMP60SC24-web.pdf)

# Ejercicio en clase

Ejercicio

Dados dos vectores u y v de tamaño 10000000

- Llenar con datos constantes
- Calcular abs(u - v) guardar en un vector w
- Sumar vector w

```cpp
#include <cmath>
#include <cstdio>
#include <omp.h>
#include <vector>

using namespace std;

const int SIZE = 10000000;
vector<int> u(SIZE);
vector<int> v(SIZE);
vector<int> w(SIZE);

void llenar() {
#pragma omp parallel for
  for (int i = 0; i < SIZE; i++) {
    u[i] = 1;
    v[i] = 3;
  }
}
void restaabs() {
#pragma omp parallel for
  for (int i = 0; i < SIZE; i++) {
    w[i] = abs(u[i] - v[i]);
  }
}

void sumaw(int &sum) {
#pragma omp parallel for reduction(+ : sum)
  for (int i = 0; i < SIZE; i++) {
    sum += w[i];
  }
}

int main() {
  int sum = 0;
  llenar();
  restaabs();
  sumaw(sum);
  printf("Suma: %d\n", sum);
  return 0;
}Ejercicio

Dados dos vectores u y v de tamaño 10000000

- Llenar con datos constantes
- Calcular abs(u - v) guardar en un vector w
- Sumar vector w
```