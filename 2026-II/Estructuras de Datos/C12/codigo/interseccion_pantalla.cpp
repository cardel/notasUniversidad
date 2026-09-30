#include "lista.h"
#include <cstdio>
void interseccion(Lista &l1, Lista &l2, Lista &r) {
  int i = 0, j = 0;
  while (i < l1.tamano() && j < l2.tamano()) {
    if (l1.obtener(i) == l2.obtener(j)) {
      r.agregar(l1.obtener(i));
      i++;
      j++;
    } else {
      if (l1.obtener(i) < l2.obtener(j)) {
        i++;
      } else {
        j++;
      }
    }
  }
}

int main() {
  Lista l1, l2, r;
  l1.agregar(1);
  l1.agregar(3);
  l1.agregar(4);
  l1.agregar(7);
  l1.agregar(9);
  l2.agregar(2);
  l2.agregar(3);
  l2.agregar(7);
  l2.agregar(8);
  l2.agregar(9);
  interseccion(l1, l2, r);
  for (int i = 0; i < r.tamano(); i++) {
    printf("%d ", r.obtener(i));
  }
  printf("\n");
}
