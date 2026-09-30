// La misma lista enlazada con un puntero al ultimo nodo: agregar deja de recorrer.
#ifndef LISTA_COLA_H
#define LISTA_COLA_H
#include <cassert>

typedef int Elemento;

struct Nodo {
  Elemento dato;
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

  void agregar(Elemento e) {
    Nodo *nuevo = new Nodo;
    nuevo->dato = e;
    nuevo->siguiente = NULL;
    if (cabeza == NULL) {
      cabeza = nuevo;
    } else {
      ultimo->siguiente = nuevo;
    }
    ultimo = nuevo;
    n = n + 1;
  }

  // exige 0 <= p <= tamano()
  void insertar(int p, Elemento e) {
    assert(0 <= p && p <= n);
    if (p == n) {
      agregar(e);
    } else {
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
  }

  // exige 0 <= p < tamano()
  void eliminar(int p) {
    assert(0 <= p && p < n);
    Nodo *muerto;
    if (p == 0) {
      muerto = cabeza;
      cabeza = cabeza->siguiente;
      if (cabeza == NULL) {
        ultimo = NULL;          // la lista quedo vacia
      }
    } else {
      Nodo *anterior = nodoEn(p - 1);
      muerto = anterior->siguiente;
      anterior->siguiente = muerto->siguiente;
      if (muerto == ultimo) {
        ultimo = anterior;      // se borro el ultimo
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

  int tamano() {
    return n;
  }

  bool vacia() {
    return n == 0;
  }
};
#endif
