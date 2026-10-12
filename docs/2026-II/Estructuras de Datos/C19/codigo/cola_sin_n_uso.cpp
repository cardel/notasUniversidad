// La cola sin contador responde lo mismo que la que lo guarda.
#include <cstdio>
#include "cola_sin_n.h"

int main() {
  ColaSinN c;
  printf("vacia %d, tamano %d\n", c.vacia(), c.tamano());
  c.encolar(3);
  c.encolar(8);
  c.encolar(5);
  printf("vacia %d, tamano %d, frente %d\n", c.vacia(), c.tamano(), c.frente());
  c.desencolar();
  printf("tamano %d, frente %d\n", c.tamano(), c.frente());
  return 0;
}
