// Descomposición de datos: el mismo trabajo sobre trozos disjuntos del vector.
#include <chrono>
#include <cstdio>
#include <thread>
#include <vector>

using namespace std;
using namespace std::chrono;

const size_t N = 200000000;

void sumar(const vector<long> &v, size_t ini, size_t fin, long &salida) {
  long s = 0;
  for (size_t i = ini; i < fin; i++) s += v[i];
  salida = s;  // cada hilo escribe en su propia variable: no hay carrera
}

long con_hilos(const vector<long> &v, int k) {
  vector<thread> hilos;
  vector<long> parciales(k, 0);
  size_t paso = v.size() / k;
  for (int i = 0; i < k; i++) {
    size_t ini = i * paso;
    size_t fin = (i == k - 1) ? v.size() : ini + paso;
    hilos.emplace_back(sumar, cref(v), ini, fin, ref(parciales[i]));
  }
  for (auto &h : hilos) h.join();          // join: aquí se necesita el resultado
  long total = 0;
  for (long p : parciales) total += p;     // reduce
  return total;
}

int main() {
  vector<long> v(N, 2);
  for (int k : {1, 2, 4, 8}) {
    auto t0 = high_resolution_clock::now();
    long total = con_hilos(v, k);
    auto t1 = high_resolution_clock::now();
    printf("%2d hilos  %5ld ms  total %ld\n", k,
           duration_cast<milliseconds>(t1 - t0).count(), total);
  }
}
