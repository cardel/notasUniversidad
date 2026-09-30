// Divide y vencerás: mergesort repartido con std::thread y corte por profundidad.
#include <algorithm>
#include <chrono>
#include <cstdio>
#include <thread>
#include <vector>

using namespace std;
using namespace std::chrono;

const size_t N = 20000000;   // 20 millones de enteros
const size_t MINIMO = 10000; // por debajo de esto no vale la pena repartir

// Mezcla dos mitades ya ordenadas de v usando tmp como espacio de trabajo.
void mezclar(vector<int> &v, vector<int> &tmp, size_t ini, size_t med, size_t fin) {
  size_t i = ini, j = med, k = ini;
  while (i < med && j < fin) tmp[k++] = (v[i] <= v[j]) ? v[i++] : v[j++];
  while (i < med) tmp[k++] = v[i++];
  while (j < fin) tmp[k++] = v[j++];
  for (size_t p = ini; p < fin; p++) v[p] = tmp[p];
}

void ordenar(vector<int> &v, vector<int> &tmp, size_t ini, size_t fin) {
  if (fin - ini < 2) return;
  size_t med = ini + (fin - ini) / 2;
  ordenar(v, tmp, ini, med);          // mitad izquierda
  ordenar(v, tmp, med, fin);          // mitad derecha
  mezclar(v, tmp, ini, med, fin);     // solo después de las dos
}

void ordenar_par(vector<int> &v, vector<int> &tmp,
                 size_t ini, size_t fin, int prof) {
  if (fin - ini < 2) return;
  if (prof == 0 || fin - ini < MINIMO) {   // se acabó el presupuesto
    ordenar(v, tmp, ini, fin);
    return;
  }
  size_t med = ini + (fin - ini) / 2;
  thread izq(ordenar_par, ref(v), ref(tmp), ini, med, prof - 1);
  ordenar_par(v, tmp, med, fin, prof - 1); // la derecha, en este hilo
  izq.join();                              // esperar antes de mezclar
  mezclar(v, tmp, ini, med, fin);
}

void llenar(vector<int> &v) {
  unsigned s = 12345;
  for (size_t i = 0; i < v.size(); i++) { s = s * 1103515245u + 12345u; v[i] = (int)(s >> 8); }
}

bool ordenado(const vector<int> &v) {
  for (size_t i = 1; i < v.size(); i++) if (v[i - 1] > v[i]) return false;
  return true;
}

int main() {
  vector<int> v(N), tmp(N);

  llenar(v);
  auto t0 = high_resolution_clock::now();
  ordenar(v, tmp, 0, N);
  auto t1 = high_resolution_clock::now();
  long base = duration_cast<milliseconds>(t1 - t0).count();
  printf("secuencial            %5ld ms   ordenado %d\n", base, (int)ordenado(v));

  for (int prof = 0; prof <= 4; prof++) {
    llenar(v);
    auto a = high_resolution_clock::now();
    ordenar_par(v, tmp, 0, N, prof);
    auto b = high_resolution_clock::now();
    long ms = duration_cast<milliseconds>(b - a).count();
    printf("corte en prof %d  %2d hilos  %5ld ms   aceleracion %.2f   ordenado %d\n",
           prof, 1 << prof, ms, (double)base / ms, (int)ordenado(v));
  }

  llenar(v);
  auto c = high_resolution_clock::now();
  sort(v.begin(), v.end());
  auto d = high_resolution_clock::now();
  printf("std::sort             %5ld ms   ordenado %d\n",
         duration_cast<milliseconds>(d - c).count(), (int)ordenado(v));

  llenar(v);
  ordenar(v, tmp, 0, N / 2);          // dos mitades ya ordenadas
  ordenar(v, tmp, N / 2, N);
  auto e = high_resolution_clock::now();
  mezclar(v, tmp, 0, N / 2, N);       // la mezcla de arriba: un solo hilo
  auto f = high_resolution_clock::now();
  printf("mezcla del nivel 0    %5ld ms   ordenado %d\n",
         duration_cast<milliseconds>(f - e).count(), (int)ordenado(v));
}
