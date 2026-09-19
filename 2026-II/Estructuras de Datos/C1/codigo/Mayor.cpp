#include <stdio.h>

int main() {
  int mayor, a, b, c;
  scanf("%d %d %d", &a, &b, &c);
  mayor = a;

  if (b > mayor) {
    mayor = b;
  }

  if (c > mayor) {
    mayor = c;
  }

  printf("El mayor es %d", mayor);
}
