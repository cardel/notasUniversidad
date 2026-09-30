// Contar los mayores que x recorriendo la lista con obtener: el costo que se paga.
#include <iostream>
#include "lista.h"

int contarMayores(Lista &l, Elemento x) {
  int cuantos = 0;
  int i = 0;
  while (i < l.tamano()) {
    if (l.obtener(i) > x) {
      cuantos = cuantos + 1;
    }
    i = i + 1;
  }
  return cuantos;
}

int main() {
  Lista l;
  l.agregar(4);
  l.agregar(9);
  l.agregar(2);
  l.agregar(7);
  std::cout << contarMayores(l, 3) << std::endl;   // 4, 9 y 7 son mayores que 3
  std::cout << contarMayores(l, 9) << std::endl;   // ninguno
  return 0;
}
