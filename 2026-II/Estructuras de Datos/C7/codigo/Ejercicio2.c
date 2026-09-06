#include <stdio.h>
#include <stdlib.h>

int main() {
  int n = 100;
  int *a = malloc(n * sizeof(int));
  int *b = malloc(n * sizeof(int));

  // Verifico que la memoria se haya asignado correctamente
  if (a != NULL) {
    a[0] = 1;
  }

  // Verifico que la memoria se haya asignado correctamente
  if (b != NULL) {
    b[0] = 2;
  }

  // Libero la memoria asignada b
  free(b);
  b = NULL;

  // Reasigno memoria a b y verifico que se haya asignado correctamente
  b = malloc(2 * n * sizeof(int));

  if (b != NULL) {
    b[0] = 3;
  }
  free(a);
  free(b);
  a = NULL;
  b = NULL;
  // en C++ se cuenta con delete a;
  // delete hace lo mismo que free pero para objetos, y llama al destructor del
  // objeto
}
