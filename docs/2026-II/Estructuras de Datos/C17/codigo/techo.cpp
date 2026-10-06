// El techo de la pila de arreglo contra el de la pila enlazada.
#include <iostream>
#include "pila_nodos.h"

using std::cout;
using std::endl;

const int CAPACIDAD = 1000;

// La pila de arreglo no puede crecer mas alla de su capacidad.
// Devuelve cuantos elementos alcanzo a apilar.
int cabenEnElArreglo(int intentos) {
  int n = 0;
  int k = 0;
  while (k < intentos) {
    if (n < CAPACIDAD) {
      n = n + 1;
    }
    k = k + 1;
  }
  return n;
}

int main() {
  cout << "CAPACIDAD del arreglo: " << CAPACIDAD << endl;
  cout << "tamano de un Nodo: " << (int) sizeof(Nodo) << " bytes" << endl << endl;
  cout << "   intentos   caben en el arreglo   caben en la enlazada   memoria de los nodos" << endl;

  int intentos[3] = {500, 1000, 100000};
  int k = 0;
  while (k < 3) {
    int m = intentos[k];
    Pila p;
    int i = 0;
    while (i < m) {
      p.apilar(i);
      i = i + 1;
    }
    long bytes = (long) p.tamano() * (long) sizeof(Nodo);
    cout << "    " << m << "            " << cabenEnElArreglo(m)
         << "                  " << p.tamano()
         << "             " << bytes / 1024 << " KiB" << endl;
    k = k + 1;
  }
  return 0;
}
