// UVa 12347 - Binary Search Tree: insertar las claves en el orden del preorden
// arma el mismo ABB, porque cada clave llega despues de todos sus ancestros.
// Basta insertar y recorrer en posorden. Insertar cuesta O(h): si la entrada
// viene ordenada el arbol es una cadena y el total es 0 + 1 + ... + (n - 1),
// unas 5 * 10^7 comparaciones con n = 10 000, que caben en el limite de 1 s.
// La insercion es la iterativa para no apilar 10 000 llamadas por clave.
// El posorden cuesta Theta(n).
#include <cstdio>
#include "abb.h"

// Posorden con una clave por linea.
void posordenLineas(Nodo *r) {
  if (r != NULL) {
    posordenLineas(r->izq);
    posordenLineas(r->der);
    printf("%d\n", r->dato);
  }
}

int main() {
  Nodo *raiz = NULL;
  int x;
  while (scanf("%d", &x) == 1) {
    raiz = insertarIterativa(raiz, x);
  }
  posordenLineas(raiz);
  liberar(raiz);
  return 0;
}
