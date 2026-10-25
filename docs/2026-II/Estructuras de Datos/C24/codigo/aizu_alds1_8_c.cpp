// Aizu ALDS1_8_C - Binary Search Tree III: insert, find y print como en
// ALDS1_8_B, y delete con los tres casos: hoja, un hijo, y dos hijos, donde
// sube el sucesor (el minimo del subarbol derecho). Insertar, buscar y borrar
// cuestan O(h) y cada print Theta(n); el enunciado garantiza h <= 100.
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
    } else if (strcmp(orden, "find") == 0) {
      int k;
      scanf("%d", &k);
      if (buscar(raiz, k) != NULL) {
        printf("yes\n");
      } else {
        printf("no\n");
      }
    } else if (strcmp(orden, "delete") == 0) {
      int k;
      scanf("%d", &k);
      raiz = borrar(raiz, k);   // la raiz cambia si se borra la raiz
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
