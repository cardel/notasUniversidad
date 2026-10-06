// TAD Pila construido sobre el TAD Lista: el tope es la posicion 0.
#ifndef PILA_H
#define PILA_H
#include <cassert>
#include "lista.h"

class Pila {
private:
  Lista l;

public:
  void apilar(Elemento e) {
    l.insertar(0, e);
  }

  // exige !vacia()
  void desapilar() {
    assert(!vacia());
    l.eliminar(0);
  }

  // exige !vacia()
  Elemento tope() {
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
