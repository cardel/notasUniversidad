# Clase 03: Introducción paralelización II (Ejercicio)

## Instrucciones

En la terminal de codespaces escribir

```bash
sudo -s
apt-get update
apt-get install libtbb-dev libboost-thread-dev
```

## hilos.cpp

```cpp
#include <iostream>
#include <thread>
#include <vector>
#include <chrono>

using namespace std;
using namespace std::chrono;

const int VECTOR_SIZE = 1000000;
vector<long> v(VECTOR_SIZE);

void fillVector(int start, int end) {
    for (int i = start; i < end; i++) {
        v[i] = 10;
    }
}

void sumVector(int start, int end, long &result) {
    for (int i = start; i < end; i++) {
        result += v[i];
    }
}

int main() {
    auto start = high_resolution_clock::now();

    thread t1(fillVector, 0, VECTOR_SIZE / 2);
    thread t2(fillVector, VECTOR_SIZE / 2, VECTOR_SIZE);

    t1.join();
    t2.join();

    long result1 = 0, result2 = 0;
    thread t3(sumVector, 0, VECTOR_SIZE / 2, ref(result1));
    thread t4(sumVector, VECTOR_SIZE / 2, VECTOR_SIZE, ref(result2));

    t3.join();
    t4.join();

    auto stop = high_resolution_clock::now();
    auto duration = duration_cast<milliseconds>(stop - start);
    cout << "Time 2 threads: " << duration.count() << " ms" << endl;

    cout << "Result: " << result1 + result2 << endl;

    auto start2 = high_resolution_clock::now();
    fillVector(0, VECTOR_SIZE);
    long result = 0;
    sumVector(0, VECTOR_SIZE, result);
    auto stop2 = high_resolution_clock::now();
    auto duration2 = duration_cast<milliseconds>(stop2 - start2);
    cout << "Time seq: " << duration2.count() << " ms" << endl;
    cout << "Result: " << result << endl;

    return 0;
}
```

```bash
g++ -o hilos hilos.cpp -lpthread
./hilos
```

## hilostbb.cpp

```cpp
#include <iostream>
#include <tbb/parallel_for.h>
#include <tbb/blocked_range.h>
#include <tbb/parallel_reduce.h>
#include <vector>
#include <chrono>

using namespace std;
using namespace std::chrono;

const int VECTOR_SIZE = 1000000;

vector<long> v(VECTOR_SIZE);

void fillVector(){
    tbb::parallel_for(
        tbb::blocked_range<int>(0, VECTOR_SIZE),
         [&](tbb::blocked_range<int> r){
        for (int i = r.begin(); i < r.end(); i++) {
            v[i] = 10;
        }
    });
}

void sumVector(long &result) {
    result = tbb::parallel_reduce(
        tbb::blocked_range<int>(0, VECTOR_SIZE),
        0,
        [&](tbb::blocked_range<int> r, long init) -> long {
            for (int i = r.begin(); i < r.end(); i++) {
                init += v[i];
            }
            return init;
        },
        [](long x, long y) -> long {
            return x + y;
        });
}

int main() {
    auto start = high_resolution_clock::now();

    fillVector();

    long result = 0;
    sumVector(result);

    auto stop = high_resolution_clock::now();
    auto duration = duration_cast<milliseconds>(stop - start);
    cout << "Time TBB: " << duration.count() << " ms" << endl;

    cout << "Result: " << result << endl;

    return 0;
}
```

```bash
g++ -o tbb hilostbb.cpp -ltbb
./tbb
```

# Consigna

Calcular el angulo entre dos vector u y b

1. Llenar u y v con numeros aleatorios entre 1 y 100
2. Calcular u.v
    1. Calcula la multiplicación punto a punto de u y v, eso lo guarda en otro vector
    2. Suma los elementos del vector generado
3. Calculan la norma de u y v, la norma la raiz de la suma de los cuadrados
4. Toman el u.v y la multiplicación de las normas, dividen ambos resultados
5. Sacar el arcocoseno, recordar que lo necesito en grados