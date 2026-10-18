// a[i] es otra forma de escribir *(a + i): sumar i al puntero avanza i casillas,
// y cada casilla mide sizeof(int) bytes, no uno.
#include <cstdio>

int main() {
  int arreglo[100];
  for (int i = 0; i < 100; i++) {
    arreglo[i] = 10 * i;
  }
  printf("sizeof(int) = %zu bytes\n", sizeof(int));
  for (int k = 0; k < 4; k++) {
    printf("arreglo + %d esta en %p y guarda %d (arreglo[%d] = %d)\n", k,
           (void *)(arreglo + k), *(arreglo + k), k, arreglo[k]);
  }
  return 0;
}
