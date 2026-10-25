// TAD Pila directo sobre nodos, para guardar nodos de un arbol binario.
// Es la misma pila de pila_nodos.h; solo cambia el tipo del dato.
#ifndef PILA_ARBOL_H
#define PILA_ARBOL_H
#include <cassert>

struct Nodo;            // nodo del arbol, definido en arbol_binario.h
typedef Nodo *Elemento; // la pila guarda punteros a nodos del arbol

struct NodoPila {
  Elemento dato;
  NodoPila *siguiente;
};

class Pila {
private:
  NodoPila *cima;
  int n;

public:
  Pila() {
    cima = NULL;
    n = 0;
  }

  ~Pila() {
    while (cima != NULL) {
      NodoPila *muerto = cima;
      cima = cima->siguiente;
      delete muerto;
    }
  }

  void apilar(Elemento e) {
    NodoPila *nuevo = new NodoPila;
    nuevo->dato = e;
    nuevo->siguiente = cima;
    cima = nuevo;
    n = n + 1;
  }

  // exige !vacia()
  void desapilar() {
    assert(!vacia());
    NodoPila *muerto = cima;
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
