// Tres nodos enlazados a mano: cada uno guarda un dato y la direccion del siguiente.
#include <iostream>

typedef int Elemento;

struct Nodo {
  Elemento dato;
  Nodo *siguiente;
};

int main() {
  // Se reservan tres nodos. new es a C++ lo que malloc es a C.
  Nodo *a = new Nodo;
  Nodo *b = new Nodo;
  Nodo *c = new Nodo;

  a->dato = 7;
  b->dato = 3;
  c->dato = 9;

  a->siguiente = b;
  b->siguiente = c;
  c->siguiente = NULL;   // el ultimo no apunta a nada

  // El recorrido no usa indices: se sigue la cadena hasta NULL.
  Nodo *actual = a;
  while (actual != NULL) {
    std::cout << actual->dato << " ";
    actual = actual->siguiente;
  }
  std::cout << std::endl;

  // Cada new lleva su delete. Se guarda el siguiente antes de borrar.
  actual = a;
  while (actual != NULL) {
    Nodo *muerto = actual;
    actual = actual->siguiente;
    delete muerto;
  }

  return 0;
}
