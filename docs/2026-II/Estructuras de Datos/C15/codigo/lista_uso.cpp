// El mismo programa que corria sobre la lista estatica, ahora sobre la enlazada.
#include <iostream>
#include "lista.h"

void imprimir(Lista &l) {
  int i = 0;
  while (i < l.tamano()) {
    std::cout << l.obtener(i) << " ";
    i = i + 1;
  }
  std::cout << std::endl;
}

int main() {
  Lista l;
  l.agregar(5);
  l.agregar(8);
  imprimir(l);              // 5 8

  l.insertar(1, 7);
  imprimir(l);              // 5 7 8

  l.insertar(0, 2);
  imprimir(l);              // 2 5 7 8

  l.eliminar(2);
  imprimir(l);              // 2 5 8

  l.asignar(0, 9);
  std::cout << l.obtener(0) << " " << l.tamano() << " " << l.vacia() << std::endl;

  return 0;
}
