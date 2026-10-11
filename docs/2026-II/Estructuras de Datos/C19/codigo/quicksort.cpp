// Quicksort sobre el arreglo, por indices inclusivos ini..fin y en el sitio.
#include <cstdio>

typedef int Elemento;

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

void quicksort(Elemento a[], int ini, int fin) {
  if (ini < fin) {
    int q = particionar(a, ini, fin);
    quicksort(a, ini, q - 1);
    quicksort(a, q + 1, fin);
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
  int q = particionar(a, 0, 5);
  printf("particionar: ");
  imprimir(a, 6);
  printf("el pivote quedo en %d\n", q);

  Elemento b[8] = {6, 2, 9, 4, 1, 7, 3, 8};
  quicksort(b, 0, 7);
  printf("quicksort:   ");
  imprimir(b, 8);
  return 0;
}
