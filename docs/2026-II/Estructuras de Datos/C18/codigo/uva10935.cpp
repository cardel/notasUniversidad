// UVa 10935 - Throwing cards away I: el mazo es una cola. Theta(n) por caso.
#include <cstdio>
#include "cola_nodos.h"

int main() {
  int n;
  scanf("%d", &n);
  while (n != 0) {
    Cola mazo;
    int carta = 1;
    while (carta <= n) {
      mazo.encolar(carta);
      carta = carta + 1;
    }
    // la primera carta botada no lleva coma antes
    printf("Discarded cards:");
    bool primera = true;
    while (mazo.tamano() >= 2) {
      if (primera) {
        printf(" %d", mazo.frente());
        primera = false;
      } else {
        printf(", %d", mazo.frente());
      }
      mazo.desencolar();
      mazo.encolar(mazo.frente());
      mazo.desencolar();
    }
    printf("\n");
    printf("Remaining card: %d\n", mazo.frente());
    scanf("%d", &n);
  }
  return 0;
}
