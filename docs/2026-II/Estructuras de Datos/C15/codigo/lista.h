// TAD Lista, implementacion enlazada: un nodo por elemento, sin techo de capacidad.
#ifndef LISTA_H
#define LISTA_H
#include <cassert>

typedef int Elemento;

struct Nodo {
  Elemento dato;
  Nodo *siguiente;
};

class Lista {
private:
  Nodo *cabeza;
  int n;

  // Devuelve el nodo de la posicion p. Exige 0 <= p < n.
  Nodo *nodoEn(int p) {
    Nodo *actual = cabeza;
    int i = 0;
    while (i < p) {
      actual = actual->siguiente;
      i = i + 1;
    }
    return actual;
  }

public:
  Lista() {
    cabeza = NULL;
    n = 0;
  }

  ~Lista() {
    while (cabeza != NULL) {
      Nodo *muerto = cabeza;
      cabeza = cabeza->siguiente;
      delete muerto;
    }
  }

  // exige 0 <= p <= tamano()
  void insertar(int p, Elemento e) {
    assert(0 <= p && p <= n);
    Nodo *nuevo = new Nodo;
    nuevo->dato = e;
    if (p == 0) {
      nuevo->siguiente = cabeza;
      cabeza = nuevo;
    } else {
      Nodo *anterior = nodoEn(p - 1);
      nuevo->siguiente = anterior->siguiente;
      anterior->siguiente = nuevo;
    }
    n = n + 1;
  }

  // exige 0 <= p < tamano()
  void eliminar(int p) {
    assert(0 <= p && p < n);
    Nodo *muerto;
    if (p == 0) {
      muerto = cabeza;
      cabeza = cabeza->siguiente;
    } else {
      Nodo *anterior = nodoEn(p - 1);
      muerto = anterior->siguiente;
      anterior->siguiente = muerto->siguiente;
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
