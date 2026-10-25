// Aizu ALDS1_8_A - Binary Search Tree I: insert baja por el ABB hasta el NULL
// donde va la clave y print imprime el inorden y el preorden. Insertar cuesta
// O(h) y cada print Theta(n); el enunciado garantiza h <= 100.
#include <cstdio>
#include <cstring>
#include "abb.h"

// Inorden y preorden con un espacio antes de cada clave.
void inordenEsp(Nodo *r) {
  if (r != NULL) {
    inordenEsp(r->izq);
    printf(" %d", r->dato);
    inordenEsp(r->der);
  }
}

void preordenEsp(Nodo *r) {
  if (r != NULL) {
    printf(" %d", r->dato);
    preordenEsp(r->izq);
    preordenEsp(r->der);
  }
}

int main() {
  int m;
  scanf("%d", &m);
  Nodo *raiz = NULL;
  char orden[10];
  int i = 0;
  while (i < m) {
    scanf("%s", orden);
    if (strcmp(orden, "insert") == 0) {
      int k;
      scanf("%d", &k);
      raiz = insertar(raiz, k);
    } else {   // print
      inordenEsp(raiz);
      printf("\n");
      preordenEsp(raiz);
      printf("\n");
    }
    i = i + 1;
  }
  liberar(raiz);
  return 0;
}
