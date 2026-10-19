// Como quedan las listas con 1000 claves k = paso * i, para distintos m.
#include <cstdio>
#include "tabla_hash.h"

// Inserta las 1000 claves paso * 1, paso * 2, ..., paso * 1000.
void llenar(TablaHash &t, int paso) {
  int i = 1;
  while (i <= 1000) {
    t.insertar(paso * i);
    i = i + 1;
  }
}

void informe(int m, int paso) {
  TablaHash t(m);
  llenar(t, paso);
  int vacias = 0;
  int mayor = 0;
  int j = 0;
  while (j < m) {
    int l = t.largo(j);
    if (l == 0) {
      vacias = vacias + 1;
    }
    if (l > mayor) {
      mayor = l;
    }
    j = j + 1;
  }
  printf("m %2d paso %2d: vacias %2d, mayor %4d, alfa %.1f\n",
         m, paso, vacias, mayor, 1000.0 / m);
}

int main() {
  informe(64, 1);
  informe(64, 4);
  informe(61, 4);
  informe(61, 61);
  return 0;
}
