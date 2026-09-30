// Granularidad: cuánto trabajo debe tener una tarea para que valga la pena.
#include <chrono>
#include <cstdio>
#include <thread>
#include <vector>

using namespace std;
using namespace std::chrono;

long trabajo(long n) {  // trabajo sintético proporcional a n
  long s = 0;
  for (long i = 0; i < n; i++) s += i % 7;
  return s;
}

int main() {
  printf("%12s %12s %12s %10s\n", "tarea", "secuencial", "4 hilos", "relación");
  for (long tamano : {1000L, 10000L, 100000L, 1000000L, 10000000L}) {
    const int TAREAS = 400;

    auto t0 = high_resolution_clock::now();
    long total = 0;
    for (int i = 0; i < TAREAS; i++) total += trabajo(tamano);
    auto t1 = high_resolution_clock::now();

    auto t2 = high_resolution_clock::now();
    vector<long> parciales(TAREAS, 0);
    for (int base = 0; base < TAREAS; base += 4) {
      vector<thread> hilos;
      for (int j = 0; j < 4; j++)
        hilos.emplace_back([&, base, j] { parciales[base + j] = trabajo(tamano); });
      for (auto &h : hilos) h.join();
    }
    auto t3 = high_resolution_clock::now();

    double sec = duration_cast<microseconds>(t1 - t0).count() / 1000.0;
    double par = duration_cast<microseconds>(t3 - t2).count() / 1000.0;
    printf("%12ld %9.1f ms %9.1f ms %9.2fx  (%ld)\n", tamano, sec, par, sec / par,
           total % 1000);
  }
}
