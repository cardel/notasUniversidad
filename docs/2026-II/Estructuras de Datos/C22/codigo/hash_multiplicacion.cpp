// Metodo de la multiplicacion: h(k) = piso(m * parte fraccionaria de k * A).
#include <cstdio>

const double A = 0.6180339887;   // (raiz de 5 - 1) / 2

int hashMult(int k, int m) {
  double t = k * A;
  double frac = t - (long long) t;   // parte fraccionaria de k * A
  return (int) (m * frac);
}

int main() {
  printf("m = 16:");
  int k = 8;
  while (k <= 64) {
    printf(" %2d", hashMult(k, 16));
    k = k + 8;
  }
  printf("\n");
  double t = 123456 * A;
  printf("k = 123456: k*A = %.4f, frac = %.4f, m = 10000: h = %d\n", t,
         t - (long long) t, hashMult(123456, 10000));
  return 0;
}
