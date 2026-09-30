// Dos ejercicios sobre listas ordenadas: quitar repetidos e intersecar.
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

// l viene ordenada; deja una sola copia de cada valor
void quitarRepetidos(Lista &l) {
  int p = 0;
  while (p < l.tamano() - 1) {
    if (l.obtener(p) == l.obtener(p + 1)) {
      l.eliminar(p + 1);
    } else {
      p = p + 1;
    }
  }
}

// a y b ordenadas y sin repetidos; devuelve los valores comunes, ordenados
Lista interseccion(Lista &a, Lista &b) {
  Lista r;
  int i = 0;
  int j = 0;
  while (i < a.tamano() && j < b.tamano()) {
    if (a.obtener(i) == b.obtener(j)) {
      r.agregar(a.obtener(i));
      i = i + 1;
      j = j + 1;
    } else if (a.obtener(i) < b.obtener(j)) {
      i = i + 1;
    } else {
      j = j + 1;
    }
  }
  return r;
}

int main() {
  Lista l;
  int v[7] = {1, 1, 2, 3, 3, 3, 5};
  int k = 0;
  while (k < 7) {
    l.agregar(v[k]);
    k = k + 1;
  }
  imprimir(l);
  quitarRepetidos(l);
  imprimir(l);
  Lista a;
  int va[5] = {1, 3, 4, 7, 9};
  Lista b;
  int vb[5] = {2, 3, 7, 8, 9};
  k = 0;
  while (k < 5) {
    a.agregar(va[k]);
    b.agregar(vb[k]);
    k = k + 1;
  }
  Lista r = interseccion(a, b);
  imprimir(r);
  return 0;
}
