// Insertar, buscar y borrar en un ABB, mirando el inorden y el preorden.
#include <cstdio>
#include "abb.h"

void mostrar(Nodo *r) {
  printf("  inorden:  ");
  inorden(r);
  printf("\n  preorden: ");
  preorden(r);
  printf("\n");
}

void probarBusqueda(Nodo *r, int k) {
  printf("buscar(%d): %s, buscarIterativa(%d): %s\n",
         k, buscar(r, k) != NULL ? "esta" : "no esta",
         k, buscarIterativa(r, k) != NULL ? "esta" : "no esta");
}

int main() {
  int claves[9] = {8, 3, 10, 1, 6, 14, 4, 7, 13};
  Nodo *raiz = NULL;
  int i = 0;
  while (i < 9) {
    raiz = insertar(raiz, claves[i]);
    i = i + 1;
  }
  raiz = insertar(raiz, 6);   // repetido: se ignora
  printf("tras insertar 8 3 10 1 6 14 4 7 13 (y 6 otra vez):\n");
  mostrar(raiz);
  printf("tamano: %d, altura: %d\n", tamano(raiz), altura(raiz));
  printf("minimo: %d, maximo: %d\n", minimo(raiz)->dato, maximo(raiz)->dato);

  probarBusqueda(raiz, 6);
  probarBusqueda(raiz, 13);
  probarBusqueda(raiz, 5);
  probarBusqueda(raiz, 15);

  raiz = borrar(raiz, 13);
  printf("borrar 13 (hoja):\n");
  mostrar(raiz);
  raiz = borrar(raiz, 10);
  printf("borrar 10 (un hijo, el derecho):\n");
  mostrar(raiz);
  raiz = borrar(raiz, 3);
  printf("borrar 3 (dos hijos; sube el sucesor 4):\n");
  mostrar(raiz);
  raiz = borrar(raiz, 5);
  printf("borrar 5 (no esta):\n");
  mostrar(raiz);

  liberar(raiz);
  return 0;
}
