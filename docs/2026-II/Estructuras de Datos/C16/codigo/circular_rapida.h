// La misma lista circular doble, llegando a la posicion por el lado mas corto.
// Con el contador y el enlace hacia atras, nodoEn nunca da mas de n/2 pasos.
#ifndef CIRCULAR_RAPIDA_H
#define CIRCULAR_RAPIDA_H
#include <cassert>

typedef int Elemento;

struct Nodo {
  Elemento dato;
  Nodo *anterior;
  Nodo *siguiente;
};

class Lista {
private:
  Nodo *cabeza;
  int n;

  Nodo *nodoEn(int p) {
    Nodo *actual = cabeza;
    if (p <= n / 2) {
      int i = 0;
      while (i < p) {
        actual = actual->siguiente;
        i = i + 1;
      }
    } else {
      int i = n;
      while (i > p) {
        actual = actual->anterior;
        i = i - 1;
      }
    }
    return actual;
  }

public:
  Lista() {
    cabeza = NULL;
    n = 0;
  }

  ~Lista() {
    int i = 0;
    while (i < n) {
      Nodo *muerto = cabeza;
      cabeza = cabeza->siguiente;
      delete muerto;
      i = i + 1;
    }
    cabeza = NULL;
  }

  // exige 0 <= p <= tamano()
  void insertar(int p, Elemento e) {
    assert(0 <= p && p <= n);
    Nodo *nuevo = new Nodo;
    nuevo->dato = e;
    if (n == 0) {
      nuevo->siguiente = nuevo;
      nuevo->anterior = nuevo;
      cabeza = nuevo;
    } else {
      // se empalma antes de x; con p == n, x es la cabeza y queda al final
      Nodo *x = cabeza;
      if (p < n) {
        x = nodoEn(p);
      }
      nuevo->siguiente = x;
      nuevo->anterior = x->anterior;
      x->anterior->siguiente = nuevo;
      x->anterior = nuevo;
      if (p == 0) {
        cabeza = nuevo;
      }
    }
    n = n + 1;
  }

  // exige 0 <= p < tamano()
  void eliminar(int p) {
    assert(0 <= p && p < n);
    Nodo *muerto = nodoEn(p);
    if (n == 1) {
      cabeza = NULL;
    } else {
      muerto->anterior->siguiente = muerto->siguiente;
      muerto->siguiente->anterior = muerto->anterior;
      if (muerto == cabeza) {
        cabeza = muerto->siguiente;
      }
    }
    delete muerto;
    n = n - 1;
  }

  // exige 0 <= p < tamano()
  Elemento obtener(int p) {
    assert(0 <= p && p < n);
    return nodoEn(p)->dato;
  }

  // exige 0 <= p < tamano()
  void asignar(int p, Elemento e) {
    assert(0 <= p && p < n);
    nodoEn(p)->dato = e;
  }

  void agregar(Elemento e) {
    insertar(n, e);
  }

  int tamano() {
    return n;
  }

  bool vacia() {
    return n == 0;
  }
};
#endif
