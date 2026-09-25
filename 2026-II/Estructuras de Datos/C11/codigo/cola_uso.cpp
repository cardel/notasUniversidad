// Area del programador: funciones escritas solo con el contrato de Cola.
#include <cstdio>
#include "cola.h"

// imprime del frente al final y deja la cola como estaba
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

// deja primero los menores que v y despues los demas, cada grupo en su orden
void particionar(Cola &c, Elemento v) {
  Cola mayores;
  int i = 0;
  int n = c.tamano();
  while (i < n) {
    Elemento x = c.frente();
    c.desencolar();
    if (x < v) {
      c.encolar(x);
    } else {
      mayores.encolar(x);
    }
    i = i + 1;
  }
  while (!mayores.vacia()) {
    c.encolar(mayores.frente());
    mayores.desencolar();
  }
}

int main() {
  Cola c;
  c.encolar(7);
  c.encolar(2);
  c.encolar(9);
  c.encolar(4);
  c.encolar(5);
  imprimir(c);
  particionar(c, 5);
  imprimir(c);
  printf("tamano: %d\n", c.tamano());
  return 0;
}
