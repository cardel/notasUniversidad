// La pila de uso_nodos.py, con pila_nodos.h.
#include <cstdio>
#include "pila_nodos.h"

int main() {
  Pila p;
  p.apilar(8);
  p.apilar(3);
  p.apilar(6);
  printf("tope: %d  tamano: %d\n", p.tope(), p.tamano());
  p.desapilar();
  printf("tope: %d  tamano: %d\n", p.tope(), p.tamano());
  return 0;
}
