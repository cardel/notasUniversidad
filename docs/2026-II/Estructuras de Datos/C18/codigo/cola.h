// TAD Cola sobre el TAD Lista: el frente es la posicion 0 y el final, el ultimo.
#ifndef COLA_H
#define COLA_H
#include <cassert>
#include "lista_cola.h"

class Cola {
private:
  Lista l;

public:
  void encolar(Elemento e) {
    l.agregar(e);
  }

  // exige !vacia()
  void desencolar() {
    assert(!vacia());
    l.eliminar(0);
  }

  // exige !vacia()
  Elemento frente() {
    assert(!vacia());
    return l.obtener(0);
  }

  int tamano() {
    return l.tamano();
  }

  bool vacia() {
    return l.vacia();
  }
};
#endif
