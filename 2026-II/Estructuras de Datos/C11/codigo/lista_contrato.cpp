// Las operaciones del TAD Lista, una por una, sobre una lista pequena.
#include <cstdio>
#include "lista.h"

void imprimir(Lista &l) {
  int p = 0;
  printf("<");
  while (p < l.tamano()) {
    printf(" %d", l.obtener(p));
    p = p + 1;
  }
  printf(" >\n");
}

int main() {
  Lista l;
  imprimir(l);
  l.agregar(5);
  l.agregar(8);
  imprimir(l);
  l.insertar(1, 7);
  imprimir(l);
  l.eliminar(0);
  imprimir(l);
  l.asignar(1, 2);
  imprimir(l);
  printf("tamano: %d, vacia: %d\n", l.tamano(), l.vacia());
  return 0;
}
