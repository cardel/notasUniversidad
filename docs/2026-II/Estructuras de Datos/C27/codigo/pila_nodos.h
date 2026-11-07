// TAD Pila directo sobre nodos: la cima es la cabeza de la cadena.
#ifndef PILA_NODOS_H
#define PILA_NODOS_H
#include <cassert>

typedef int Elemento;

struct Nodo {
  Elemento dato;
  Nodo *siguiente;
};

class Pila {
private:
  Nodo *cima;
  int n;

public:
  Pila() {
    cima = NULL;
    n = 0;
  }

  ~Pila() {
    while (cima != NULL) {
      Nodo *muerto = cima;
      cima = cima->siguiente;
      delete muerto;
    }
  }

  void apilar(Elemento e) {
    Nodo *nuevo = new Nodo;
    nuevo->dato = e;
    nuevo->siguiente = cima;
    cima = nuevo;
    n = n + 1;
  }

  // exige !vacia()
  void desapilar() {
    assert(!vacia());
    Nodo *muerto = cima;
    cima = cima->siguiente;
    delete muerto;
    n = n - 1;
  }

  // exige !vacia()
  Elemento tope() {
    assert(!vacia());
    return cima->dato;
  }

  int tamano() {
    return n;
  }

  bool vacia() {
    return n == 0;
  }
};
#endif
