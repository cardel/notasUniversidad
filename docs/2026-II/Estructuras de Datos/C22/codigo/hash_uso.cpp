// Tabla hash con encadenamiento: insertar, buscar y eliminar con m = 7.
#include <cstdio>
#include "tabla_hash.h"

int main() {
  TablaHash t(7);
  int claves[6] = {10, 23, 5, 17, 12, 31};
  int i = 0;
  while (i < 6) {
    printf("h(%d) = %d\n", claves[i], claves[i] % 7);
    t.insertar(claves[i]);
    i = i + 1;
  }
  t.imprimir();
  printf("buscar 17: %d\n", t.buscar(17));
  printf("buscar 24: %d\n", t.buscar(24));
  printf("eliminar 17: %d\n", t.eliminar(17));
  printf("largo de la casilla 3: %d\n", t.largo(3));
  printf("n = %d, m = %d\n", t.tamano(), t.casillasTotal());
  return 0;
}
