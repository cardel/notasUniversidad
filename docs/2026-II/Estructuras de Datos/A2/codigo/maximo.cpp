// El mayor elemento de una cola, dejandola exactamente como estaba.
#include <iostream>
#include "cola_nodos.h"

using std::cout;
using std::endl;

// exige !c.vacia()
Elemento maximo(Cola &c) {
  int n = c.tamano();
  Elemento mayor = c.frente();
  int i = 0;
  while (i < n) {
    Elemento actual = c.frente();
    if (actual > mayor) {
      mayor = actual;
    }
    c.desencolar();
    c.encolar(actual);
    i = i + 1;
  }
  return mayor;
}

void imprimir(Cola &c) {
  int n = c.tamano();
  int i = 0;
  while (i < n) {
    Elemento e = c.frente();
    cout << e << " ";
    c.desencolar();
    c.encolar(e);
    i = i + 1;
  }
  cout << endl;
}

int main() {
  Cola c;
  c.encolar(4);
  c.encolar(9);
  c.encolar(2);
  c.encolar(7);
  cout << "antes:   ";
  imprimir(c);
  cout << "maximo:  " << maximo(c) << endl;      // 9
  cout << "despues: ";
  imprimir(c);                                   // 4 9 2 7, igual que antes

  Cola u;
  u.encolar(5);
  cout << "un solo elemento, maximo: " << maximo(u)
       << ", tamano " << u.tamano() << ", frente " << u.frente() << endl;

  Cola d;
  d.encolar(3);
  d.encolar(3);
  d.encolar(1);
  cout << "con repetidos, maximo: " << maximo(d) << ", tamano " << d.tamano() << endl;
  return 0;
}
