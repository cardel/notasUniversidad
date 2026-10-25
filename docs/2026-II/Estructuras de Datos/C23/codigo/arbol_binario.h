// Arbol binario: un arbol vacio es NULL; si no, un nodo con su dato
// y dos subarboles, el izquierdo y el derecho.
#ifndef ARBOL_BINARIO_H
#define ARBOL_BINARIO_H
#include <cstdio>
#include "pila_arbol.h"

struct Nodo {
  int dato;
  Nodo *izq;  // raiz del subarbol izquierdo
  Nodo *der;  // raiz del subarbol derecho
};

Nodo *crearNodo(int dato, Nodo *izq, Nodo *der) {
  Nodo *nuevo = new Nodo;
  nuevo->dato = dato;
  nuevo->izq = izq;
  nuevo->der = der;
  return nuevo;
}

// Numero de nodos. El arbol vacio tiene 0.
int tamano(Nodo *r) {
  int res = 0;
  if (r != NULL) {
    res = 1 + tamano(r->izq) + tamano(r->der);
  }
  return res;
}

// Aristas del camino mas largo de la raiz a una hoja.
// El arbol vacio tiene altura -1 y una hoja, 0.
int altura(Nodo *r) {
  int res = -1;
  if (r != NULL) {
    int hi = altura(r->izq);
    int hd = altura(r->der);
    if (hi > hd) {
      res = 1 + hi;
    } else {
      res = 1 + hd;
    }
  }
  return res;
}

// Raiz, subarbol izquierdo, subarbol derecho.
void preorden(Nodo *r) {
  if (r != NULL) {
    printf("%d ", r->dato);
    preorden(r->izq);
    preorden(r->der);
  }
}

// Subarbol izquierdo, raiz, subarbol derecho.
void inorden(Nodo *r) {
  if (r != NULL) {
    inorden(r->izq);
    printf("%d ", r->dato);
    inorden(r->der);
  }
}

// Subarbol izquierdo, subarbol derecho, raiz.
void posorden(Nodo *r) {
  if (r != NULL) {
    posorden(r->izq);
    posorden(r->der);
    printf("%d ", r->dato);
  }
}

// Libera en posorden: los hijos antes que el padre.
void liberar(Nodo *r) {
  if (r != NULL) {
    liberar(r->izq);
    liberar(r->der);
    delete r;
  }
}

// Se saca un nodo, se imprime y se apilan sus hijos:
// el derecho primero, para que el izquierdo salga antes.
void preordenPila(Nodo *r) {
  Pila p;
  if (r != NULL) {
    p.apilar(r);
  }
  while (!p.vacia()) {
    Nodo *x = p.tope();
    p.desapilar();
    printf("%d ", x->dato);
    if (x->der != NULL) {
      p.apilar(x->der);
    }
    if (x->izq != NULL) {
      p.apilar(x->izq);
    }
  }
}

// Se baja por la izquierda apilando; al llegar a NULL se saca
// el tope, se imprime y se sigue por su subarbol derecho.
void inordenPila(Nodo *r) {
  Pila p;
  Nodo *actual = r;
  while (actual != NULL || !p.vacia()) {
    if (actual != NULL) {
      p.apilar(actual);
      actual = actual->izq;
    } else {
      actual = p.tope();
      p.desapilar();
      printf("%d ", actual->dato);
      actual = actual->der;
    }
  }
}

// La primera pila visita raiz, derecho, izquierdo y pasa cada nodo
// a la segunda; al vaciar la segunda sale el orden al reves: posorden.
void posordenPila(Nodo *r) {
  Pila p1;
  Pila p2;
  if (r != NULL) {
    p1.apilar(r);
  }
  while (!p1.vacia()) {
    Nodo *x = p1.tope();
    p1.desapilar();
    p2.apilar(x);
    if (x->izq != NULL) {
      p1.apilar(x->izq);
    }
    if (x->der != NULL) {
      p1.apilar(x->der);
    }
  }
  while (!p2.vacia()) {
    printf("%d ", p2.tope()->dato);
    p2.desapilar();
  }
}
#endif
