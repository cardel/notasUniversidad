// UVa 699 - The Falling Leaves: el arbol llega en preorden con -1 para el
// subarbol vacio, asi que se arma con una lectura recursiva. Luego se suma cada
// nodo en su columna: el hijo izquierdo va en c - 1 y el derecho en c + 1.
// Leer y sumar cuestan Theta(n) por arbol; imprimir recorre el arreglo de columnas.
#include <cstdio>
#include "arbol_binario.h"

// La linea de sumas no pasa de 80 caracteres, asi que hay menos de 41
// columnas; el arreglo deja holgura a los dos lados de la raiz.
const int MAX_COLUMNAS = 2001;
const int CENTRO = 1000;   // la raiz va en la columna 0, guardada en CENTRO

int suma[MAX_COLUMNAS];    // suma[CENTRO + c]: hojas que caen en la columna c

// v es el valor ya leido de la raiz; si es -1 el arbol es vacio. Si no,
// se leen el subarbol izquierdo y despues el derecho.
Nodo *leerArbol(int v) {
  Nodo *res = NULL;
  if (v != -1) {
    int x;
    scanf("%d", &x);
    Nodo *izq = leerArbol(x);
    scanf("%d", &x);
    Nodo *der = leerArbol(x);
    res = crearNodo(v, izq, der);
  }
  return res;
}

// Suma r en la columna c y cada hijo en la columna de su lado.
void sumarColumnas(Nodo *r, int c) {
  if (r != NULL) {
    suma[CENTRO + c] = suma[CENTRO + c] + r->dato;
    sumarColumnas(r->izq, c - 1);
    sumarColumnas(r->der, c + 1);
  }
}

int main() {
  int caso = 0;
  int v;
  scanf("%d", &v);
  while (v != -1) {
    caso = caso + 1;
    Nodo *raiz = leerArbol(v);
    int i = 0;
    while (i < MAX_COLUMNAS) {
      suma[i] = 0;
      i = i + 1;
    }
    sumarColumnas(raiz, 0);
    printf("Case %d:\n", caso);
    // los valores son positivos: una columna ocupada tiene suma mayor que 0
    bool primero = true;
    i = 0;
    while (i < MAX_COLUMNAS) {
      if (suma[i] > 0) {
        if (!primero) {
          printf(" ");
        }
        printf("%d", suma[i]);
        primero = false;
      }
      i = i + 1;
    }
    printf("\n\n");
    liberar(raiz);
    scanf("%d", &v);
  }
  return 0;
}
