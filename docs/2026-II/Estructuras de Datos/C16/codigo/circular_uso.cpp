// Las dos circulares responden igual: se compila una vez con cada cabecera.
#include <iostream>
#include CABECERA

using std::cout;
using std::endl;

void imprimir(Lista &l) {
  int i = 0;
  while (i < l.tamano()) {
    cout << l.obtener(i) << " ";
    i = i + 1;
  }
  cout << endl;
}

int main() {
  Lista l;
  l.agregar(5);
  l.agregar(8);
  l.agregar(4);
  imprimir(l);              // 5 8 4
  l.insertar(0, 2);
  l.insertar(4, 9);
  l.insertar(2, 7);
  imprimir(l);              // 2 5 7 8 4 9
  l.eliminar(0);
  l.eliminar(4);
  imprimir(l);              // 5 7 8 4
  l.asignar(3, 1);
  imprimir(l);              // 5 7 8 1
  cout << l.tamano() << " " << l.vacia() << endl;
  return 0;
}
