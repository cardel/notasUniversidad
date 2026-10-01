// La doblemente enlazada responde igual al contrato, y ademas se recorre al reves.
#include <iostream>
#include "doble.h"

using std::cout;
using std::endl;

int main() {
  Lista l;
  l.agregar(5);
  l.agregar(8);
  l.agregar(4);
  l.insertar(1, 7);
  l.insertar(0, 2);

  int i = 0;
  while (i < l.tamano()) {
    cout << l.obtener(i) << " ";
    i = i + 1;
  }
  cout << endl;                 // 2 5 7 8 4

  l.eliminar(2);
  l.eliminar(0);
  i = 0;
  while (i < l.tamano()) {
    cout << l.obtener(i) << " ";
    i = i + 1;
  }
  cout << endl;                 // 5 8 4
  cout << l.tamano() << " " << l.vacia() << endl;
  return 0;
}
