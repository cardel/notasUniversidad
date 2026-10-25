// Un caso base equivocado: tamanoHoja se detiene en la hoja y no en el
// arbol vacio. Da bien mientras cada nodo tenga cero o dos hijos, y se
// cae en el primer nodo que tiene uno solo.
#include <cstdio>
#include "arbol_binario.h"

// Caso base en la hoja. Exige r != NULL.
int tamanoHoja(Nodo *r) {
  int res = 1;
  if (r->izq != NULL || r->der != NULL) {
    res = 1 + tamanoHoja(r->izq) + tamanoHoja(r->der);
  }
  return res;
}

int main() {
  Nodo *seis = crearNodo(6, crearNodo(4, NULL, NULL), crearNodo(7, NULL, NULL));
  Nodo *tres = crearNodo(3, crearNodo(1, NULL, NULL), seis);
  Nodo *diez = crearNodo(10, NULL, crearNodo(14, NULL, NULL));
  Nodo *raiz = crearNodo(8, tres, diez);

  printf("tamanoHoja(seis): %d\n", tamanoHoja(seis));
  printf("tamanoHoja(tres): %d\n", tamanoHoja(tres));
  fflush(stdout);  // que las dos lineas salgan aunque la siguiente llamada se caiga
  printf("tamanoHoja(raiz): %d\n", tamanoHoja(raiz));

  liberar(raiz);
  return 0;
}
