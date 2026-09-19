// Area del programador: funciones escritas solo con el contrato de Pila.
#include <cstdio>
#include "pila.h"

// version 1: imprime del tope hacia abajo
void imprimirV1(Pila &p) {
  while (!p.vacia()) {
    printf(" %d", p.tope());
    p.desapilar();
  }
  printf("\n");
}

// version 2: imprime del tope hacia abajo y deja la pila como estaba
void imprimir(Pila &p) {
  Pila aux;
  while (!p.vacia()) {
    printf(" %d", p.tope());
    aux.apilar(p.tope());
    p.desapilar();
  }
  while (!aux.vacia()) {
    p.apilar(aux.tope());
    aux.desapilar();
  }
  printf("\n");
}

// elimina el elemento que esta k lugares debajo del tope (k = 0 es el tope)
// exige 0 <= k < tamano()
void eliminarDesdeTope(Pila &p, int k) {
  Pila aux;
  int i = 0;
  while (i < k) {
    aux.apilar(p.tope());
    p.desapilar();
    i = i + 1;
  }
  p.desapilar();
  while (!aux.vacia()) {
    p.apilar(aux.tope());
    aux.desapilar();
  }
}

int main() {
  Pila p;
  p.apilar(3);
  p.apilar(8);
  p.apilar(1);
  p.apilar(6);
  imprimirV1(p);
  printf("tamano despues de la version 1: %d\n", p.tamano());
  p.apilar(3);
  p.apilar(8);
  p.apilar(1);
  p.apilar(6);
  imprimir(p);
  printf("tamano despues de la version 2: %d\n", p.tamano());
  eliminarDesdeTope(p, 2);
  imprimir(p);
  return 0;
}
