// UVa 11034 - Ferry Loading IV: una cola por orilla. Theta(m) por caso.
#include <iostream>
#include <string>
#include "cola_nodos.h"

using std::cin;
using std::cout;
using std::string;

int main() {
  int c;
  cin >> c;
  while (c > 0) {
    int l;
    int m;
    cin >> l >> m;
    int capacidad = 100 * l;  // la cubierta en centimetros
    Cola orilla[2];           // 0: izquierda, 1: derecha
    int i = 0;
    while (i < m) {
      int largo;
      string lado;
      cin >> largo >> lado;
      if (lado == "left") {
        orilla[0].encolar(largo);
      } else {
        orilla[1].encolar(largo);
      }
      i = i + 1;
    }
    int ferri = 0;
    int cruces = 0;
    while (!orilla[0].vacia() || !orilla[1].vacia()) {
      // carga en orden de llegada mientras el frente quepa
      int libre = capacidad;
      while (!orilla[ferri].vacia() && orilla[ferri].frente() <= libre) {
        libre = libre - orilla[ferri].frente();
        orilla[ferri].desencolar();
      }
      // cruza, aunque vaya vacio
      cruces = cruces + 1;
      ferri = 1 - ferri;
    }
    cout << cruces << "\n";
    c = c - 1;
  }
  return 0;
}
