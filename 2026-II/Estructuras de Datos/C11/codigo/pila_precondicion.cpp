// Que pasa cuando se desapila una pila vacia: la precondicion vigila.
#include <cstdio>
#include "pila.h"

int main() {
  Pila p;
  p.apilar(4);
  printf("tope: %d\n", p.tope());
  p.desapilar();
  printf("vacia: %d\n", p.vacia());
  p.desapilar();
  printf("esta linea no se alcanza\n");
  return 0;
}
