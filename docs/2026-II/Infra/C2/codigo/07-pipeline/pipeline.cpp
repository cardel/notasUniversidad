// Pipeline: tres etapas encadenadas, cada una sobre un dato distinto.
#include <chrono>
#include <condition_variable>
#include <cstdio>
#include <mutex>
#include <queue>
#include <thread>
#include <vector>

using namespace std;
using namespace std::chrono;

const int LOTES = 24;

// Cola con bloqueo: la forma clásica de conectar dos etapas.
template <class T> class Cola {
  queue<T> datos; mutex m; condition_variable hay; bool cerrada = false;
 public:
  void poner(T v) { { lock_guard<mutex> g(m); datos.push(v); } hay.notify_one(); }
  void cerrar()   { { lock_guard<mutex> g(m); cerrada = true; } hay.notify_all(); }
  bool sacar(T &v) {
    unique_lock<mutex> g(m);
    hay.wait(g, [&] { return !datos.empty() || cerrada; });
    if (datos.empty()) return false;
    v = datos.front(); datos.pop(); return true;
  }
};

void gastar(int ms) { this_thread::sleep_for(milliseconds(ms)); }

int main() {
  auto t0 = high_resolution_clock::now();
  for (int i = 0; i < LOTES; i++) { gastar(10); gastar(20); gastar(10); }
  auto t1 = high_resolution_clock::now();
  printf("secuencial %5ld ms\n", duration_cast<milliseconds>(t1 - t0).count());

  Cola<int> leidos, procesados;
  auto t2 = high_resolution_clock::now();

  thread lector([&] {
    for (int i = 0; i < LOTES; i++) { gastar(10); leidos.poner(i); }
    leidos.cerrar();
  });
  thread calculador([&] {
    int v;
    while (leidos.sacar(v)) { gastar(20); procesados.poner(v); }
    procesados.cerrar();
  });
  thread escritor([&] {
    int v; int n = 0;
    while (procesados.sacar(v)) { gastar(10); n++; }
    printf("escritos %d lotes\n", n);
  });

  lector.join(); calculador.join(); escritor.join();
  auto t3 = high_resolution_clock::now();
  printf("pipeline   %5ld ms\n", duration_cast<milliseconds>(t3 - t2).count());
}
