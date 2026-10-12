// Invertir una cola con una pila auxiliar, usando solo los dos contratos.
#include <cstdio>
#include "cola_nodos.h"
#include "pila_nodos.h"

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

void imprimir(Cola &c) {
  int i = 0;
  int n = c.tamano();
  while (i < n) {
    Elemento x = c.frente();
    c.desencolar();
    printf("%d ", x);
    c.encolar(x);
    i = i + 1;
  }
  printf("\n");
}

int main() {
  Cola c;
  c.encolar(3);
  c.encolar(1);
  c.encolar(4);
  c.encolar(1);
  c.encolar(5);
  printf("antes:   ");
  imprimir(c);
  invertir(c);
  printf("despues: ");
  imprimir(c);
  return 0;
}
