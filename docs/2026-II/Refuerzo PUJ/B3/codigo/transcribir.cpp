#include <cstdio>
#include <vector>
using namespace std;

int empleados_necesarios(const vector<long long> &paginas, long long t) {
  // Empleados necesarios si nadie pasa de t páginas.
  int empleados = 1;
  long long turno = 0;
  for (size_t i = 0; i < paginas.size(); i++) {
    if (turno + paginas[i] <= t) {
      turno = turno + paginas[i];
    } else {
      empleados = empleados + 1;
      turno = paginas[i];
    }
  }
  return empleados;
}

long long transcribir(const vector<long long> &paginas, int k) {
  // El menor máximo de páginas por empleado.
  long long lo = 0;
  long long hi = 0;
  for (size_t i = 0; i < paginas.size(); i++) {
    if (paginas[i] > lo) {
      lo = paginas[i];
    }
    hi = hi + paginas[i];
  }
  while (lo < hi) {
    long long medio = (lo + hi) / 2;
    if (empleados_necesarios(paginas, medio) <= k) {
      hi = medio;
    } else {
      lo = medio + 1;
    }
  }
  return lo;
}

int main() {
  vector<long long> paginas;
  for (int i = 1; i <= 9; i++) {
    paginas.push_back(100 * i);
  }
  printf("%lld\n", transcribir(paginas, 3));
  printf("%lld\n", transcribir(paginas, 1));
  printf("%lld\n", transcribir(paginas, 9));
  printf("%lld\n", transcribir(paginas, 12));
  return 0;
}
