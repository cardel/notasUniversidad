// Arbol binario de busqueda de enteros sin repetidos: en cada nodo, las
// claves del subarbol izquierdo son menores y las del derecho, mayores.
// Insertar una clave que ya esta no cambia el arbol.
#ifndef ABB_H
#define ABB_H
#include <cassert>
#include "arbol_binario.h"

// Devuelve el nodo con la clave k, o NULL si no esta.
Nodo *buscar(Nodo *r, int k) {
  Nodo *res = r;
  if (r != NULL && k != r->dato) {
    if (k < r->dato) {
      res = buscar(r->izq, k);
    } else {
      res = buscar(r->der, k);
    }
  }
  return res;
}

// La misma busqueda con un ciclo: baja un nivel por vuelta.
Nodo *buscarIterativa(Nodo *r, int k) {
  while (r != NULL && k != r->dato) {
    if (k < r->dato) {
      r = r->izq;
    } else {
      r = r->der;
    }
  }
  return r;
}

// exige r != NULL; el menor esta al fondo a la izquierda
Nodo *minimo(Nodo *r) {
  assert(r != NULL);
  while (r->izq != NULL) {
    r = r->izq;
  }
  return r;
}

// exige r != NULL; el mayor esta al fondo a la derecha
Nodo *maximo(Nodo *r) {
  assert(r != NULL);
  while (r->der != NULL) {
    r = r->der;
  }
  return r;
}

// Devuelve la raiz del subarbol con k ya insertada.
Nodo *insertar(Nodo *r, int k) {
  if (r == NULL) {
    r = crearNodo(k, NULL, NULL);
  } else if (k < r->dato) {
    r->izq = insertar(r->izq, k);
  } else if (k > r->dato) {
    r->der = insertar(r->der, k);
  }
  return r;
}

// Baja hasta el NULL donde va k, recordando el padre, y cuelga ahi el nodo.
Nodo *insertarIterativa(Nodo *r, int k) {
  Nodo *padre = NULL;
  Nodo *actual = r;
  while (actual != NULL && k != actual->dato) {
    padre = actual;
    if (k < actual->dato) {
      actual = actual->izq;
    } else {
      actual = actual->der;
    }
  }
  if (actual == NULL) {
    Nodo *nuevo = crearNodo(k, NULL, NULL);
    if (padre == NULL) {
      r = nuevo;
    } else if (k < padre->dato) {
      padre->izq = nuevo;
    } else {
      padre->der = nuevo;
    }
  }
  return r;
}

// Devuelve la raiz del subarbol sin k. Si k no esta, nada cambia.
Nodo *borrar(Nodo *r, int k) {
  Nodo *res = r;
  if (r != NULL) {
    if (k < r->dato) {
      r->izq = borrar(r->izq, k);
    } else if (k > r->dato) {
      r->der = borrar(r->der, k);
    } else if (r->izq == NULL) {   // hoja o solo hijo derecho
      res = r->der;
      delete r;
    } else if (r->der == NULL) {   // solo hijo izquierdo
      res = r->izq;
      delete r;
    } else {                       // dos hijos: sube el sucesor
      Nodo *suc = minimo(r->der);
      r->dato = suc->dato;
      r->der = borrar(r->der, suc->dato);
    }
  }
  return res;
}

// El ABB como objeto: guarda la raiz y libera todo al destruirse.
class ABB {
private:
  Nodo *raiz;

public:
  ABB() {
    raiz = NULL;
  }

  ~ABB() {
    liberar(raiz);
  }

  bool contiene(int k) {
    return buscar(raiz, k) != NULL;
  }

  void agregar(int k) {
    raiz = insertar(raiz, k);
  }

  void quitar(int k) {
    raiz = borrar(raiz, k);
  }

  int alto() {
    return altura(raiz);
  }

  void imprimir() {
    inorden(raiz);
    printf("\n");
  }
};
#endif
