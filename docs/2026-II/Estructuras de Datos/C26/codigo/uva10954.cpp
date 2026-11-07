// UVa 10954 - Add All
// Sumar dos números cuesta su suma. Para que el costo total sea mínimo se
// suman siempre los dos menores que quedan, y la suma vuelve al grupo.
#include <cstdio>
#include "monticulo_min.h"

int main() {
  int n;
  while (scanf("%d", &n) == 1 && n != 0) {
    MonticuloMin m;
    int i = 0;
    while (i < n) {
      int x;
      scanf("%d", &x);
      m.insertar(x);
      i = i + 1;
    }
    // el total puede pasar de 2^31 - 1: se acumula en long long
    long long costo = 0;
    while (m.tamano() > 1) {
      int a = m.extraerMin();
      int b = m.extraerMin();
      costo = costo + a + b;
      m.insertar(a + b);
    }
    printf("%lld\n", costo);
  }
  return 0;
}
