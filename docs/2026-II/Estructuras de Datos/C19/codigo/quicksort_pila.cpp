// Quicksort sin recursion: los rangos pendientes van en una pila propia.
#include <cstdio>
#include "pila_nodos.h"

void intercambiar(Elemento a[], int p, int q) {
  Elemento temp = a[p];
  a[p] = a[q];
  a[q] = temp;
}

// Parte a[ini..fin] alrededor de x = a[fin] y
// devuelve la posicion final del pivote. Exige ini <= fin.
int particionar(Elemento a[], int ini, int fin) {
  Elemento x = a[fin];
  int i = ini - 1;
  int j = ini;
  while (j < fin) {
    if (a[j] <= x) {
      i = i + 1;
      intercambiar(a, i, j);
    }
    j = j + 1;
  }
  intercambiar(a, i + 1, fin);
  return i + 1;
}

// Cada rango pendiente [p, r] ocupa dos enteros en la pila:
// se apila r y despues p, asi que p sale primero.
void quicksortPila(Elemento a[], int ini, int fin) {
  Pila pendientes;
  pendientes.apilar(fin);
  pendientes.apilar(ini);
  while (!pendientes.vacia()) {
    int p = pendientes.tope();
    pendientes.desapilar();
    int r = pendientes.tope();
    pendientes.desapilar();
    if (p < r) {
      int q = particionar(a, p, r);
      pendientes.apilar(r);
      pendientes.apilar(q + 1);
      pendientes.apilar(q - 1);
      pendientes.apilar(p);
    }
  }
}

void imprimir(Elemento a[], int n) {
  int i = 0;
  while (i < n) {
    printf("%d ", a[i]);
    i = i + 1;
  }
  printf("\n");
}

int main() {
  Elemento a[6] = {7, 2, 9, 4, 1, 5};
  quicksortPila(a, 0, 5);
  printf("quicksortPila: ");
  imprimir(a, 6);

  Elemento b[8] = {6, 2, 9, 4, 1, 7, 3, 8};
  quicksortPila(b, 0, 7);
  printf("quicksortPila: ");
  imprimir(b, 8);
  return 0;
}
