
La multiplicación escalar entre dos vector u y v está definida así:

$i \in [0,n],w[i]=u[i]∗v[i]$

Utilizando thread como librería haga:

- Llenado de u y v con un valor constante pequeño (menor que 10)
- Calcular la multiplicación entre los dos vectores de forma paralelización
- Calcular la suma del vector resultante
- Imprimir el resultado
- Imprimir el tiempo de ejecución

El classroom sólo valida que el programa compile, el docente revisará manualmente la implementación de cada estudiante

```c++
#include <chrono>
#include <iostream>
#include <thread>
#include <vector>

using namespace std;
using namespace std::chrono;

const int VECTOR_SIZE = 1000000;
vector<long> v(VECTOR_SIZE);
vector<long> u(VECTOR_SIZE);
vector<long> w(VECTOR_SIZE);

void fillVector(int start, int end) {
  for (int i = start; i < end; i++) {
    v[i] = 10;
    u[i] = 20;
    w[i] = 0;
  }
}
void multVector(int start, int end) {
  for (int i = start; i < end; i++) {
    w[i] = v[i] * u[i];
  }
}

void sumVector(int start, int end, long &result) {
  for (int i = start; i < end; i++) {
    result += w[i];
  }
}

int main() {

  fillVector(0, VECTOR_SIZE);
  multVector(0, VECTOR_SIZE);

  auto start = high_resolution_clock::now();

  long result1 = 0, result2 = 0;
  thread t1(sumVector, 0, VECTOR_SIZE / 2, ref(result1));
  thread t2(sumVector, VECTOR_SIZE / 2, VECTOR_SIZE, ref(result2));

  t1.join();
  t2.join();

  auto stop = high_resolution_clock::now();
  auto duration = duration_cast<milliseconds>(stop - start);
  cout << "Time 2 threads: " << duration.count() << " ms" << endl;

  cout << "Result: " << result1 + result2 << endl;

  auto start2 = high_resolution_clock::now();
  long result = 0;

  sumVector(0, VECTOR_SIZE, result);

  auto stop2 = high_resolution_clock::now();
  auto duration2 = duration_cast<milliseconds>(stop2 - start2);
  cout << "Time seq: " << duration2.count() << " ms" << endl;
  cout << "Result: " << result << endl;

  start = high_resolution_clock::now();
  return 0;
}
```