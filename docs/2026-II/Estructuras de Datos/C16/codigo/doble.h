// TAD Lista, implementacion doblemente enlazada: cada nodo recuerda al anterior.
#ifndef DOBLE_H
#define DOBLE_H
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
  Nodo *ultimo;
  int n;

  Nodo *nodoEn(int p) {
    Nodo *actual = cabeza;
    int i = 0;
    while (i < p) {
      actual = actual->siguiente;
      i = i + 1;
    }
    return actual;
  }

  // Saca el nodo de la cadena. No recorre nada: por eso se guarda anterior.
  void desenlazar(Nodo *x) {
    if (x->anterior == NULL) {
      cabeza = x->siguiente;
    } else {
      x->anterior->siguiente = x->siguiente;
    }
    if (x->siguiente == NULL) {
      ultimo = x->anterior;
    } else {
      x->siguiente->anterior = x->anterior;
    }
  }

public:
  Lista() {
    cabeza = NULL;
    ultimo = NULL;
    n = 0;
  }

  ~Lista() {
    while (cabeza != NULL) {
      Nodo *muerto = cabeza;
      cabeza = cabeza->siguiente;
      delete muerto;
    }
    ultimo = NULL;
  }

  // exige 0 <= p <= tamano()
  void insertar(int p, Elemento e) {
    assert(0 <= p && p <= n);
    Nodo *nuevo = new Nodo;
    nuevo->dato = e;
    if (n == 0) {
      nuevo->anterior = NULL;
      nuevo->siguiente = NULL;
      cabeza = nuevo;
      ultimo = nuevo;
    } else if (p == 0) {
      nuevo->anterior = NULL;
      nuevo->siguiente = cabeza;
      cabeza->anterior = nuevo;
      cabeza = nuevo;
    } else if (p == n) {
      nuevo->anterior = ultimo;
      nuevo->siguiente = NULL;
      ultimo->siguiente = nuevo;
      ultimo = nuevo;
    } else {
      Nodo *x = nodoEn(p);
      nuevo->anterior = x->anterior;
      nuevo->siguiente = x;
      x->anterior->siguiente = nuevo;
      x->anterior = nuevo;
    }
    n = n + 1;
  }

  // exige 0 <= p < tamano()
  void eliminar(int p) {
    assert(0 <= p && p < n);
    Nodo *muerto = nodoEn(p);
    desenlazar(muerto);
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
