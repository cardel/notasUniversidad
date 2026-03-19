
# Secuencial
```c++
#include <chrono>
#include <cstdio>
#include <vector>

using namespace std;

const int SIZE = 1e9;
vector<int> u(SIZE);
vector<int> v(SIZE);

void initialize(int value) {
  for (int i = 0; i < SIZE; i++) {
    u[i] = value;
    v[i] = value;
  }
}

long producto() {
  long suma = 0L;
#pragma parallel reduce(suma : +)
  for (int i = 0; i < SIZE; i++) {

    suma += u[i] * v[i];
  }
  return suma;
}

int main() {
  // Tomar tiempo de inicio
  //
  auto start = chrono::high_resolution_clock::now();
  initialize(10);
  long res = producto();
  printf("%ld \n", res);
  auto end = chrono::high_resolution_clock::now();
  long duracion =
      chrono::duration_cast<chrono::milliseconds>(end - start).count();
  printf("El tiempo de ejecucion secuencial es %lld", duracion);
}
```

# Paralelo

```c++
#include <chrono>
#include <cstdio>
#include <omp.h>
#include <vector>

using namespace std;

const int SIZE = 1e9;
vector<int> u(SIZE);
vector<int> v(SIZE);

void initialize(int value) {
#pragma omp parallel for
  for (int i = 0; i < SIZE; i++) {
    u[i] = value;
    v[i] = value;
  }
}

long producto() {
  long suma = 0L;
#pragma omp parallel reduction(+ : suma)
  for (int i = 0; i < SIZE; i++) {

    suma += u[i] * v[i];
  }
  return suma;
}

int main() {
  // Tomar tiempo de inicio
  //
  auto start = chrono::high_resolution_clock::now();
  initialize(10);
  long res = producto();
  printf("%ld \n", res);
  auto end = chrono::high_resolution_clock::now();
  long duracion =
      chrono::duration_cast<chrono::milliseconds>(end - start).count();
  printf("El tiempo de ejecucion paralelo es %lld", duracion);
}
```