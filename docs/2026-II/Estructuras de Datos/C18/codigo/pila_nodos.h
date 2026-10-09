// TAD Pila directo sobre nodos: la cima es la cabeza de la cadena.
// El nodo se llama NodoPila para poder incluir esta pila junto a
// cola_nodos.h, que ya define un struct Nodo. El typedef de Elemento
// se repite igual en los dos archivos, y C++ lo admite.
#ifndef PILA_NODOS_H
#define PILA_NODOS_H
#include <cassert>

typedef int Elemento;

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
