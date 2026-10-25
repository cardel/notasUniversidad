// Aizu ALDS1_7_D - Reconstruction of a Tree: el siguiente id del preorden es
// la raiz del rango [ini, fin] del inorden; lo que queda a su izquierda en el
// inorden es el subarbol izquierdo y lo de la derecha, el derecho. Con pos[id]
// la raiz se ubica en Theta(1), asi que reconstruir cuesta Theta(n), igual que el posorden.
#include <cstdio>
#include "arbol_binario.h"

const int MAX_NODOS = 41;   // ids de 1 a n, n <= 40

int pre[MAX_NODOS];   // el preorden, tal como llega
int pos[MAX_NODOS];   // pos[id]: indice de id en el inorden

// Arma el arbol del rango [ini, fin] del inorden. k es el indice del
// siguiente id del preorden y avanza a medida que se crean nodos.
Nodo *reconstruir(int &k, int ini, int fin) {
  Nodo *res = NULL;
  if (ini <= fin) {
    int id = pre[k];
    k = k + 1;
    int m = pos[id];
    Nodo *izq = reconstruir(k, ini, m - 1);   // primero el izquierdo, como en el preorden
    Nodo *der = reconstruir(k, m + 1, fin);
    res = crearNodo(id, izq, der);
  }
  return res;
}

// Posorden con un espacio entre ids y ninguno al comienzo.
void posordenSep(Nodo *r, bool &primero) {
  if (r != NULL) {
    posordenSep(r->izq, primero);
    posordenSep(r->der, primero);
    if (!primero) {
      printf(" ");
    }
    printf("%d", r->dato);
    primero = false;
  }
}

int main() {
  int n;
  scanf("%d", &n);
  int i = 0;
  while (i < n) {
    scanf("%d", &pre[i]);
    i = i + 1;
  }
  i = 0;
  while (i < n) {
    int id;
    scanf("%d", &id);
    pos[id] = i;
    i = i + 1;
  }
  int k = 0;
  Nodo *raiz = reconstruir(k, 0, n - 1);
  bool primero = true;
  posordenSep(raiz, primero);
  printf("\n");
  liberar(raiz);
  return 0;
}
