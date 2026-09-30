// Area del programador: funciones escritas solo con el contrato de Lista.
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

// copia al final de r los elementos de l desde la posicion p
void copiarDesde(Lista &r, Lista &l, int p) {
  while (p < l.tamano()) {
    r.agregar(l.obtener(p));
    p = p + 1;
  }
}

// a y b vienen ordenadas de menor a mayor; devuelve la union ordenada
Lista mezclar(Lista &a, Lista &b) {
  Lista r;
  int i = 0;
  int j = 0;
  while (i < a.tamano() && j < b.tamano()) {
    if (a.obtener(i) <= b.obtener(j)) {
      r.agregar(a.obtener(i));
      i = i + 1;
    } else {
      r.agregar(b.obtener(j));
      j = j + 1;
    }
  }
  copiarDesde(r, a, i);
  copiarDesde(r, b, j);
  return r;
}

// devuelve una lista nueva con los mismos elementos en orden inverso
Lista revertir(Lista &l) {
  Lista r;
  int p = 0;
  while (p < l.tamano()) {
    r.insertar(0, l.obtener(p));
    p = p + 1;
  }
  return r;
}

int main() {
  Lista a;
  a.agregar(4);
  a.agregar(5);
  a.agregar(9);
  Lista b;
  b.agregar(1);
  b.agregar(5);
  b.agregar(8);
  Lista m = mezclar(a, b);
  imprimir(m);
  Lista r = revertir(m);
  imprimir(r);
  return 0;
}
