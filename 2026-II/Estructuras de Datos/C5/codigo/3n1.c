#include "stdio.h"

int conjetura(long n) {
  if (n == 1) {
    return 1;
  } else {
    if (n % 2 == 0) {
      return 1 + conjetura(n / 2);
    } else {
      return 1 + conjetura(3 * n + 1);
    }
  }
}

int max_rango(long i, long j) {
  if (i > j) {
    int aux = i;
    i = j;
    j = aux;
  }
  int mayor = conjetura(i);
  for (long k = i + 1; k <= j; k++) {
    int actual = conjetura(k);
    if (actual > mayor) {
      mayor = actual;
    }
  }
  return mayor;
}

int main() {
  long i, j;
  while (scanf("%ld %ld", &i, &j) == 2) {
    printf("%ld %ld %d\n", i, j, max_rango(i, j));
  }
}
