// Tabla hash con encadenamiento: cada casilla es la cabeza de una lista enlazada.
#ifndef TABLA_HASH_H
#define TABLA_HASH_H
#include <cstdio>

struct Nodo {
  int clave;
  Nodo *siguiente;
};

class TablaHash {
private:
  Nodo **casillas;  // cabeza de la lista de cada casilla
  int m;            // numero de casillas
  int n;            // numero de claves guardadas

  // Metodo de la division. Exige k >= 0.
  int h(int k) {
    return k % m;
  }

public:
  TablaHash(int tam) {
    m = tam;
    n = 0;
    casillas = new Nodo *[m];
    int i = 0;
    while (i < m) {
      casillas[i] = NULL;
      i = i + 1;
    }
  }

  ~TablaHash() {
    int i = 0;
    while (i < m) {
      while (casillas[i] != NULL) {
        Nodo *muerto = casillas[i];
        casillas[i] = casillas[i]->siguiente;
        delete muerto;
      }
      i = i + 1;
    }
    delete[] casillas;
  }

  // Recorre la lista de h(k) hasta hallar k o llegar a NULL.
  bool buscar(int k) {
    Nodo *actual = casillas[h(k)];
    while (actual != NULL && actual->clave != k) {
      actual = actual->siguiente;
    }
    return actual != NULL;
  }

  // Cuelga k al frente de su lista. Exige que k no este.
  void insertar(int k) {
    int i = h(k);
    Nodo *nuevo = new Nodo;
    nuevo->clave = k;
    nuevo->siguiente = casillas[i];
    casillas[i] = nuevo;
    n = n + 1;
  }

  // Desenlaza el nodo de k. Devuelve si lo encontro.
  bool eliminar(int k) {
    int i = h(k);
    Nodo *anterior = NULL;
    Nodo *actual = casillas[i];
    while (actual != NULL && actual->clave != k) {
      anterior = actual;
      actual = actual->siguiente;
    }
    bool estaba = actual != NULL;
    if (estaba) {
      if (anterior == NULL) {
        casillas[i] = actual->siguiente;
      } else {
        anterior->siguiente = actual->siguiente;
      }
      delete actual;
      n = n - 1;
    }
    return estaba;
  }

  // Numero de nodos en la lista de la casilla i.
  int largo(int i) {
    int c = 0;
    Nodo *actual = casillas[i];
    while (actual != NULL) {
      c = c + 1;
      actual = actual->siguiente;
    }
    return c;
  }

  void imprimir() {
    int i = 0;
    while (i < m) {
      printf("%d:", i);
      Nodo *actual = casillas[i];
      while (actual != NULL) {
        printf(" %d", actual->clave);
        actual = actual->siguiente;
      }
      printf("\n");
      i = i + 1;
    }
  }

  int tamano() {
    return n;
  }

  int casillasTotal() {
    return m;
  }
};
#endif
