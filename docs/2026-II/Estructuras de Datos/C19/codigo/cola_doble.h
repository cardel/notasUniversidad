// Cola doble sobre nodos doblemente enlazados: se entra y se sale por los dos extremos.
#ifndef COLA_DOBLE_H
#define COLA_DOBLE_H
#include <cassert>
#include <cstddef>

typedef int Elemento;

struct NodoDoble {
  Elemento dato;
  NodoDoble *anterior;
  NodoDoble *siguiente;
};

class ColaDoble {
private:
  NodoDoble *cabeza;
  NodoDoble *ultimo;
  int n;

public:
  ColaDoble() {
    cabeza = NULL;
    ultimo = NULL;
    n = 0;
  }

  ~ColaDoble() {
    while (cabeza != NULL) {
      NodoDoble *muerto = cabeza;
      cabeza = cabeza->siguiente;
      delete muerto;
    }
    ultimo = NULL;
  }

  void insertarFrente(Elemento e) {
    NodoDoble *nuevo = new NodoDoble;
    nuevo->dato = e;
    nuevo->anterior = NULL;
    nuevo->siguiente = cabeza;
    if (cabeza == NULL) {
      ultimo = nuevo;
    } else {
      cabeza->anterior = nuevo;
    }
    cabeza = nuevo;
    n = n + 1;
  }

  void insertarFinal(Elemento e) {
    NodoDoble *nuevo = new NodoDoble;
    nuevo->dato = e;
    nuevo->anterior = ultimo;
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
  void eliminarFrente() {
    assert(!vacia());
    NodoDoble *muerto = cabeza;
    cabeza = cabeza->siguiente;
    if (cabeza == NULL) {
      ultimo = NULL;
    } else {
      cabeza->anterior = NULL;
    }
    delete muerto;
    n = n - 1;
  }

  // exige !vacia()
  void eliminarFinal() {
    assert(!vacia());
    NodoDoble *muerto = ultimo;
    ultimo = ultimo->anterior;
    if (ultimo == NULL) {
      cabeza = NULL;
    } else {
      ultimo->siguiente = NULL;
    }
    delete muerto;
    n = n - 1;
  }

  // exige !vacia()
  Elemento frente() {
    assert(!vacia());
    return cabeza->dato;
  }

  // exige !vacia()
  Elemento final() {
    assert(!vacia());
    return ultimo->dato;
  }

  int tamano() {
    return n;
  }

  bool vacia() {
    return n == 0;
  }
};
#endif
