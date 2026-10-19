// Lo que ocupan solo los punteros de la tabla, segun el universo de claves.
#include <cstdio>
#include "tabla_directa.h"

int main() {
  long long puntero = sizeof(Registro *);
  long long m1 = 1000;
  long long m2 = 10000000000;      // codigos de 10 digitos
  printf("puntero: %lld bytes\n", puntero);
  printf("m = %lld: %lld bytes\n", m1, m1 * puntero);
  printf("m = %lld: %lld bytes\n", m2, m2 * puntero);
  return 0;
}
