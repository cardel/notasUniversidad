// El arbol de ejemplo, armado a mano: tamano, altura y los seis recorridos.
// Raiz 8, con hijos 3 y 10; 3 tiene hijos 1 y 6; 6 tiene hijos 4 y 7;
// 10 solo tiene hijo derecho, 14. Las hojas son 1, 4, 7 y 14.
#include <cstdio>
#include "arbol_binario.h"

int main() {
  Nodo *seis = crearNodo(6, crearNodo(4, NULL, NULL), crearNodo(7, NULL, NULL));
  Nodo *tres = crearNodo(3, crearNodo(1, NULL, NULL), seis);
  Nodo *diez = crearNodo(10, NULL, crearNodo(14, NULL, NULL));
  Nodo *raiz = crearNodo(8, tres, diez);

  printf("tamano: %d\n", tamano(raiz));
  printf("altura: %d\n", altura(raiz));
  printf("altura del vacio: %d\n", altura(NULL));

  printf("preorden:     ");
  preorden(raiz);
  printf("\npreordenPila: ");
  preordenPila(raiz);
  printf("\ninorden:      ");
  inorden(raiz);
  printf("\ninordenPila:  ");
  inordenPila(raiz);
  printf("\nposorden:     ");
  posorden(raiz);
  printf("\nposordenPila: ");
  posordenPila(raiz);
  printf("\n");

  liberar(raiz);
  return 0;
}
