// Descomposición de tareas: trabajos distintos, en paralelo, sobre los mismos datos.
#include <chrono>
#include <cstdio>
#include <thread>
#include <vector>

using namespace std;
using namespace std::chrono;

const size_t N = 50000000;

void maximo(const vector<long> &v, long &salida) {
  long m = v[0];
  for (long x : v) if (x > m) m = x;
  salida = m;
}

void suma(const vector<long> &v, long &salida) {
  long s = 0;
  for (long x : v) s += x;
  salida = s;
}

void pares(const vector<long> &v, long &salida) {
  long c = 0;
  for (long x : v) if (x % 2 == 0) c++;
  salida = c;
}

int main() {
  vector<long> v(N);
  for (size_t i = 0; i < N; i++) v[i] = i % 1000;

  long m = 0, s = 0, p = 0;

  auto t0 = high_resolution_clock::now();
  maximo(v, m); suma(v, s); pares(v, p);
  auto t1 = high_resolution_clock::now();
  printf("secuencial  %4ld ms\n", duration_cast<milliseconds>(t1 - t0).count());

  auto t2 = high_resolution_clock::now();
  thread t_a(maximo, cref(v), ref(m));
  thread t_b(suma, cref(v), ref(s));
  thread t_c(pares, cref(v), ref(p));
  t_a.join(); t_b.join(); t_c.join();
  auto t3 = high_resolution_clock::now();
  printf("por tareas  %4ld ms   max %ld suma %ld pares %ld\n",
         duration_cast<milliseconds>(t3 - t2).count(), m, s, p);
}
