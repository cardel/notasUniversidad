// TAD Cola directo sobre nodos: se entra por el ultimo y se sale por la cabeza.
#ifndef COLA_NODOS_H
#define COLA_NODOS_H
#include <cassert>

typedef int Elemento;

struct Nodo {
  Elemento dato;
  Nodo *siguiente;
};

class Cola {
private:
  Nodo *cabeza;
  Nodo *ultimo;
  int n;

public:
  Cola() {
    cabeza = NULL;
    ultimo = NULL;
    n = 0;
  }

  ~Cola() {
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
    n = n + 1;
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
    n = n - 1;
  }

  // exige !vacia()
  Elemento frente() {
    assert(!vacia());
    return cabeza->dato;
  }

  int tamano() {
    return n;
  }

  bool vacia() {
    return n == 0;
  }
};
#endif
