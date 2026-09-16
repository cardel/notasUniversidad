// Balanceo de carga: reparto fijo contra reparto por demanda.
#include <atomic>
#include <chrono>
#include <cstdio>
#include <thread>
#include <vector>

using namespace std;
using namespace std::chrono;

const int TAREAS = 64;
const int HILOS = 4;

// Carga muy desigual: la tarea i cuesta proporcional a i*i.
long trabajo(int i) {
  long s = 0;
  for (long k = 0; k < 2000000L * i * i / 100; k++) s += k % 3;
  return s;
}

long estatico() {
  vector<long> parciales(HILOS, 0);
  vector<thread> hilos;
  for (int h = 0; h < HILOS; h++)
    hilos.emplace_back([&, h] {
      // bloques contiguos: al último hilo le tocan las tareas más caras
      int por_hilo = TAREAS / HILOS;
      for (int i = h * por_hilo; i < (h + 1) * por_hilo; i++)
        parciales[h] += trabajo(i);
    });
  for (auto &t : hilos) t.join();
  long total = 0; for (long p : parciales) total += p; return total;
}

long dinamico() {
  atomic<int> siguiente{0};
  vector<long> parciales(HILOS, 0);
  vector<thread> hilos;
  for (int h = 0; h < HILOS; h++)
    hilos.emplace_back([&, h] {
      int i;
      while ((i = siguiente.fetch_add(1)) < TAREAS) parciales[h] += trabajo(i);
    });
  for (auto &t : hilos) t.join();
  long total = 0; for (long p : parciales) total += p; return total;
}

int main() {
  auto t0 = high_resolution_clock::now();
  long a = estatico();
  auto t1 = high_resolution_clock::now();
  long b = dinamico();
  auto t2 = high_resolution_clock::now();
  printf("reparto fijo      %5ld ms  (%ld)\n",
         duration_cast<milliseconds>(t1 - t0).count(), a % 1000);
  printf("reparto por demanda %3ld ms  (%ld)\n",
         duration_cast<milliseconds>(t2 - t1).count(), b % 1000);
}
