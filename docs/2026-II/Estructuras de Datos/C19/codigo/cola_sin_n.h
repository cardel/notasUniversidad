// Cola sobre nodos sin contador: vacia mira la cabeza y tamano recorre.
#ifndef COLA_SIN_N_H
#define COLA_SIN_N_H
#include <cassert>
#include <cstddef>

typedef int Elemento;

struct Nodo {
  Elemento dato;
  Nodo *siguiente;
};

class ColaSinN {
private:
  Nodo *cabeza;
  Nodo *ultimo;

public:
  ColaSinN() {
    cabeza = NULL;
    ultimo = NULL;
  }

  ~ColaSinN() {
    while (cabeza != NULL) {
      Nodo *muerto = cabeza;
      cabeza = cabeza->siguiente;
      delete muerto;
    }
    ultimo = NULL;
  }

  void encolar(Elemento e) {
    Nodo *nuevo = new Nodo;
    nuevo->dato = e;
    nuevo->siguiente = NULL;
    if (ultimo == NULL) {
      cabeza = nuevo;
    } else {
      ultimo->siguiente = nuevo;
    }
    ultimo = nuevo;
  }

  // exige !vacia()
  void desencolar() {
    assert(!vacia());
    Nodo *muerto = cabeza;
    cabeza = cabeza->siguiente;
    if (cabeza == NULL) {
      ultimo = NULL;
    }
    delete muerto;
  }

  // exige !vacia()
  Elemento frente() {
    assert(!vacia());
    return cabeza->dato;
  }

  bool vacia() {
    return cabeza == NULL;
  }

  int tamano() {
    int cuenta = 0;
    Nodo *actual = cabeza;
    while (actual != NULL) {
      cuenta = cuenta + 1;
      actual = actual->siguiente;
    }
    return cuenta;
  }
};
#endif
