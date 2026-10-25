// Un arbol degenerado de n nodos, todos colgados a la derecha: altura n - 1.
// La altura con pila explicita termina; la recursiva apila n marcos y,
// con n grande, desborda la pila de llamadas.
#include <cstdio>
#include "arbol_binario.h"

// Inserta 1, 2, ..., n siempre como hijo derecho del ultimo. Exige n >= 1.
Nodo *degenerado(int n) {
  Nodo *raiz = crearNodo(1, NULL, NULL);
  Nodo *ultimo = raiz;
  int i = 2;
  while (i <= n) {
    ultimo->der = crearNodo(i, NULL, NULL);
    ultimo = ultimo->der;
    i = i + 1;
  }
  return raiz;
}

// Posorden con una sola pila: la pila guarda el camino de la raiz al
// nodo actual, igual que los marcos de la version recursiva.
int alturaPila(Nodo *r) {
  int res = -1;
  Pila p;
  Nodo *actual = r;
  Nodo *ultimo = NULL;  // ultimo nodo que salio de la pila
  while (actual != NULL || !p.vacia()) {
    if (actual != NULL) {
      p.apilar(actual);
      if (p.tamano() - 1 > res) {
        res = p.tamano() - 1;
      }
      actual = actual->izq;
    } else if (p.tope()->der != NULL && p.tope()->der != ultimo) {
      actual = p.tope()->der;
    } else {
      ultimo = p.tope();
      p.desapilar();
    }
  }
  return res;
}

// Libera sin recursion: se saca un nodo, se apilan sus hijos y se borra.
void liberarPila(Nodo *r) {
  Pila p;
  if (r != NULL) {
    p.apilar(r);
  }
  while (!p.vacia()) {
    Nodo *x = p.tope();
    p.desapilar();
    if (x->izq != NULL) {
      p.apilar(x->izq);
    }
    if (x->der != NULL) {
      p.apilar(x->der);
    }
    delete x;
  }
}

int main() {
  int n;
  scanf("%d", &n);
  Nodo *raiz = degenerado(n);
  printf("n = %d\n", n);
  printf("alturaPila: %d\n", alturaPila(raiz));
  fflush(stdout);  // que la linea salga aunque la recursiva se caiga
  printf("altura:     %d\n", altura(raiz));
  liberarPila(raiz);
  return 0;
}
