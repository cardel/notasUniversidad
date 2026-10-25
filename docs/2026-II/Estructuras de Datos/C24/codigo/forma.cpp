// Las mismas siete claves en dos ordenes de insercion: el orden decide la forma.
#include <cstdio>
#include "abb.h"

void probar(int claves[], int n) {
  ABB arbol;
  int i = 0;
  while (i < n) {
    printf("%d ", claves[i]);
    arbol.agregar(claves[i]);
    i = i + 1;
  }
  printf("-> altura %d, inorden ", arbol.alto());
  arbol.imprimir();
}

int main() {
  int enOrden[7] = {1, 2, 3, 4, 5, 6, 7};
  int mitades[7] = {4, 2, 6, 1, 3, 5, 7};
  probar(enOrden, 7);
  probar(mitades, 7);
  return 0;
}
