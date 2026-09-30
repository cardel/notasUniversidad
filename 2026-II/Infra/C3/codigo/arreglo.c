// Un arreglo en C: reserva de memoria y acceso por puntero.
//
// arr[i] es azúcar sintáctico de *(arr + i): llegar a un elemento es sumarle
// un desplazamiento a una dirección, y por eso cuesta lo mismo sea cual sea
// el índice. Una lista de Python hace lo mismo por debajo, pero lo que guarda
// en cada posición es un puntero a un objeto, no el valor.
#include "stdlib.h"

int main() {
  int *arr = malloc(1000 * sizeof(int));

  if (arr != NULL) {
    for (int i = 0; i < 1000; i++) {
      *(arr + i) = 10;
      // arr[i] = 10;
    }
    free(arr);
  }
}
