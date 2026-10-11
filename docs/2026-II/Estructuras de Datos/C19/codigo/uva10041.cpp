// UVa 10041 - Vito's Family: la casa va en la mediana de las direcciones.
// Se ordena con quicksort y se suman las distancias a la mediana.
#include <cstdio>

typedef int Elemento;

void intercambiar(Elemento a[], int p, int q) {
  Elemento temp = a[p];
  a[p] = a[q];
  a[q] = temp;
}

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

int main() {
  int casos;
  Elemento s[500];
  scanf("%d", &casos);
  while (casos > 0) {
    int r;
    scanf("%d", &r);
    int i = 0;
    while (i < r) {
      scanf("%d", &s[i]);
      i = i + 1;
    }
    quicksort(s, 0, r - 1);
    int mediana = s[r / 2];
    int suma = 0;
    i = 0;
    while (i < r) {
      if (s[i] > mediana) {
        suma = suma + (s[i] - mediana);
      } else {
        suma = suma + (mediana - s[i]);
      }
      i = i + 1;
    }
    printf("%d\n", suma);
    casos = casos - 1;
  }
  return 0;
}
