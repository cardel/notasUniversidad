#include "stdio.h"

int main() {
  char d;
  scanf("%c", &d);
  printf("El numero es %d\n", (int)(d - '0'));
  printf("El char de %c\n", d);
}
