// Aizu ALDS1_7_C - Tree Walk: se enlazan los nodos de la tabla (id, izq, der),
// la raiz es el unico id que no es hijo de nadie y se recorre en preorden,
// inorden y posorden. Leer y enlazar cuesta Theta(n); cada recorrido, Theta(n).
#include <cstdio>
#include "arbol_binario.h"

const int MAX_NODOS = 25;

Nodo *nodos[MAX_NODOS];   // nodos[id]: el nodo con ese id
bool esHijo[MAX_NODOS];   // esHijo[id]: aparece como hijo de alguien

// Lee las n lineas, cuelga cada hijo de su padre y devuelve la raiz.
Nodo *leerArbol(int n) {
  int i = 0;
  while (i < n) {
    nodos[i] = crearNodo(i, NULL, NULL);
    esHijo[i] = false;
    i = i + 1;
  }
  i = 0;
  while (i < n) {
    int id, izq, der;
    scanf("%d %d %d", &id, &izq, &der);
    if (izq != -1) {
      nodos[id]->izq = nodos[izq];
      esHijo[izq] = true;
    }
    if (der != -1) {
      nodos[id]->der = nodos[der];
      esHijo[der] = true;
    }
    i = i + 1;
  }
  int raiz = 0;
  i = 0;
  while (i < n) {
    if (!esHijo[i]) {
      raiz = i;
    }
    i = i + 1;
  }
  return nodos[raiz];
}

// Los tres recorridos con un espacio antes de cada id.
void preordenEsp(Nodo *r) {
  if (r != NULL) {
    printf(" %d", r->dato);
    preordenEsp(r->izq);
    preordenEsp(r->der);
  }
}

void inordenEsp(Nodo *r) {
  if (r != NULL) {
    inordenEsp(r->izq);
    printf(" %d", r->dato);
    inordenEsp(r->der);
  }
}

void posordenEsp(Nodo *r) {
  if (r != NULL) {
    posordenEsp(r->izq);
    posordenEsp(r->der);
    printf(" %d", r->dato);
  }
}

int main() {
  int n;
  scanf("%d", &n);
  Nodo *raiz = leerArbol(n);
  printf("Preorder\n");
  preordenEsp(raiz);
  printf("\nInorder\n");
  inordenEsp(raiz);
  printf("\nPostorder\n");
  posordenEsp(raiz);
  printf("\n");
  liberar(raiz);
  return 0;
}
