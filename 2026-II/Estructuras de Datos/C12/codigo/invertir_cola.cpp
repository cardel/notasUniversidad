// Invertir una cola con la ayuda de una pila.
#include <cstdio>
#include "cola.h"
#include "pila.h"

void imprimir(Cola &c) {
  int i = 0;
  int n = c.tamano();
  while (i < n) {
    Elemento x = c.frente();
    printf(" %d", x);
    c.desencolar();
    c.encolar(x);
    i = i + 1;
  }
  printf("\n");
}

void invertir(Cola &c) {
  Pila p;
  while (!c.vacia()) {
    p.apilar(c.frente());
    c.desencolar();
  }
  while (!p.vacia()) {
    c.encolar(p.tope());
    p.desapilar();
  }
}

int main() {
  Cola c;
  c.encolar(7);
  c.encolar(2);
  c.encolar(9);
  c.encolar(4);
  imprimir(c);
  invertir(c);
  imprimir(c);
  return 0;
}
