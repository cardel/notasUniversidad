// UVa 10935 - Throwing cards away I: el mazo es una cola. Theta(n) por caso.
#include <iostream>
#include "cola_nodos.h"

using std::cin;
using std::cout;

int main() {
  int n;
  cin >> n;
  while (n != 0) {
    Cola mazo;
    int carta = 1;
    while (carta <= n) {
      mazo.encolar(carta);
      carta = carta + 1;
    }
    // la primera carta botada no lleva coma antes
    cout << "Discarded cards:";
    bool primera = true;
    while (mazo.tamano() >= 2) {
      if (primera) {
        cout << " " << mazo.frente();
        primera = false;
      } else {
        cout << ", " << mazo.frente();
      }
      mazo.desencolar();
      mazo.encolar(mazo.frente());
      mazo.desencolar();
    }
    cout << "\n";
    cout << "Remaining card: " << mazo.frente() << "\n";
    cin >> n;
  }
  return 0;
}
