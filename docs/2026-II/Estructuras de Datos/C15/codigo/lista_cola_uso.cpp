// Comprueba que la version con puntero al ultimo responde igual en los bordes.
#include <iostream>
#include "lista_cola.h"

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
  l.insertar(2, 4);        // insertar al final pasa por agregar
  imprimir(l);             // 5 8 4

  l.eliminar(2);           // borrar el ultimo: ultimo vuelve al anterior
  l.agregar(6);
  imprimir(l);             // 5 8 6

  l.eliminar(0);
  l.eliminar(0);
  l.eliminar(0);           // la lista queda vacia: ultimo vuelve a NULL
  l.agregar(1);
  imprimir(l);             // 1

  return 0;
}
