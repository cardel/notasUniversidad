// La papa caliente: n personas en circulo, cada k-esima sale del juego.
#include <cstdio>
#include "cola.h"

// devuelve quien queda de ultimo; imprime el orden en que salen
int ultimo(int n, int k) {
  Cola c;
  int i = 1;
  while (i <= n) { c.encolar(i); i = i + 1; }
  while (c.tamano() > 1) {
    int j = 1;
    while (j < k) {
      Elemento x = c.frente();
      c.desencolar();
      c.encolar(x);
      j = j + 1;
    }
    printf("sale %d\n", c.frente());
    c.desencolar();
  }
  return c.frente();
}

int main() {
  printf("queda %d\n", ultimo(5, 3));
  return 0;
}
