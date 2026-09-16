// Dependencias: la suma de prefijos parece secuencial y no lo es del todo.
#include <chrono>
#include <cstdio>
#include <thread>
#include <vector>

using namespace std;
using namespace std::chrono;

const size_t N = 20000000;
const int HILOS = 4;

// El valor de cada posición cuesta algo: sin eso, el programa solo mueve
// memoria y ninguna estrategia de reparto se nota.
long peso(long x) {
  long y = x;
  for (int k = 0; k < 40; k++) y = (y * 1103515245 + 12345) % 1000003;
  return y % 10;
}

void secuencial(const vector<long> &v, vector<long> &r) {
  long acumulado = 0;
  for (size_t i = 0; i < v.size(); i++) {  // cada paso necesita el anterior
    acumulado += peso(v[i]);
    r[i] = acumulado;
  }
}

// Dos pasadas: cada hilo suma su bloque, se acumulan los desplazamientos y
// cada hilo vuelve a recorrer su bloque partiendo del desplazamiento que le toca.
void en_dos_pasadas(const vector<long> &v, vector<long> &r) {
  size_t paso = v.size() / HILOS;
  vector<long> totales(HILOS, 0);

  vector<thread> hilos;
  for (int h = 0; h < HILOS; h++)
    hilos.emplace_back([&, h] {
      size_t ini = h * paso, fin = (h == HILOS - 1) ? v.size() : ini + paso;
      long s = 0;
      for (size_t i = ini; i < fin; i++) s += peso(v[i]);
      totales[h] = s;
    });
  for (auto &t : hilos) t.join();

  vector<long> desplazamiento(HILOS, 0);
  for (int h = 1; h < HILOS; h++)
    desplazamiento[h] = desplazamiento[h - 1] + totales[h - 1];

  hilos.clear();
  for (int h = 0; h < HILOS; h++)
    hilos.emplace_back([&, h] {
      size_t ini = h * paso, fin = (h == HILOS - 1) ? v.size() : ini + paso;
      long acumulado = desplazamiento[h];
      for (size_t i = ini; i < fin; i++) { acumulado += peso(v[i]); r[i] = acumulado; }
    });
  for (auto &t : hilos) t.join();
}

int main() {
  vector<long> v(N, 1), a(N), b(N);

  auto t0 = high_resolution_clock::now();
  secuencial(v, a);
  auto t1 = high_resolution_clock::now();
  en_dos_pasadas(v, b);
  auto t2 = high_resolution_clock::now();

  printf("secuencial   %4ld ms  ultimo %ld\n",
         duration_cast<milliseconds>(t1 - t0).count(), a[N - 1]);
  printf("dos pasadas  %4ld ms  ultimo %ld  %s\n",
         duration_cast<milliseconds>(t2 - t1).count(), b[N - 1],
         (a[N - 1] == b[N - 1] && a[N / 3] == b[N / 3]) ? "coinciden" : "DIFIEREN");
}
