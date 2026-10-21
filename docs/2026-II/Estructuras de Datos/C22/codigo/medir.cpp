// Tiempo de procesador de n inserciones y n busquedas en la tabla hash y en el map.
#include <cstdio>
#include <ctime>
#include <map>
#include "tabla_hash.h"
using std::map;

const int P = 1000003;   // primo mayor que n: (i * 7919) % P no repite claves

void medirHash(int n, int m) {
  clock_t ini = clock();
  TablaHash t(m);
  int i = 0;
  while (i < n) {
    t.insertar((int) ((long long) i * 7919 % P));
    i = i + 1;
  }
  int hallados = 0;
  i = 0;
  while (i < n) {
    if (t.buscar((int) ((long long) i * 7919 % P))) {
      hallados = hallados + 1;
    }
    i = i + 1;
  }
  double s = (double) (clock() - ini) / CLOCKS_PER_SEC;
  printf("hash, n = %d, m = %d: %.3f s (%d hallados)\n", n, m, s, hallados);
}

void medirMap(int n) {
  clock_t ini = clock();
  map<int, int> mp;
  int i = 0;
  while (i < n) {
    mp[(int) ((long long) i * 7919 % P)] = i;
    i = i + 1;
  }
  int hallados = 0;
  i = 0;
  while (i < n) {
    if (mp.count((int) ((long long) i * 7919 % P)) == 1) {
      hallados = hallados + 1;
    }
    i = i + 1;
  }
  double s = (double) (clock() - ini) / CLOCKS_PER_SEC;
  printf("map,  n = %d: %.3f s (%d hallados)\n", n, s, hallados);
}

int main() {
  medirHash(100000, 99991);
  medirMap(100000);
  medirHash(1000000, 999983);
  medirMap(1000000);
  return 0;
}
