// Las mismas cuatro claves en la tabla hash y en el map: en que orden salen.
#include <cstdio>
#include <map>
#include "tabla_hash.h"
using std::map;

int main() {
  int claves[4] = {305, 112, 87, 450};
  TablaHash t(7);
  map<int, int> m;
  int i = 0;
  while (i < 4) {
    t.insertar(claves[i]);
    m[claves[i]] = 1;
    i = i + 1;
  }
  printf("tabla hash, casilla por casilla:\n");
  t.imprimir();
  printf("map, con su iterador:");
  map<int, int>::iterator it = m.begin();
  while (it != m.end()) {
    printf(" %d", it->first);
    ++it;
  }
  printf("\n");
  return 0;
}
