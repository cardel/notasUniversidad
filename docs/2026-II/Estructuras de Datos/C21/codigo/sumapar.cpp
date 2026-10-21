// Hay dos numeros distintos del arreglo que suman x? Una pasada con la tabla hash.
#include <cstdio>
#include "tabla_hash.h"

// Exige a[i] >= 0. Antes de guardar a[i], busca su pareja x - a[i].
bool sumaPar(int a[], int n, int x) {
  TablaHash vistos(11);
  bool hay = false;
  int i = 0;
  while (i < n && !hay) {
    int falta = x - a[i];
    if (falta >= 0 && vistos.buscar(falta)) {
      hay = true;
    }
    if (!vistos.buscar(a[i])) {
      vistos.insertar(a[i]);
    }
    i = i + 1;
  }
  return hay;
}

int main() {
  int a[6] = {8, 3, 11, 6, 2, 15};
  printf("x = 9: %d\n", sumaPar(a, 6, 9));
  printf("x = 21: %d\n", sumaPar(a, 6, 21));
  printf("x = 12: %d\n", sumaPar(a, 6, 12));
  return 0;
}
