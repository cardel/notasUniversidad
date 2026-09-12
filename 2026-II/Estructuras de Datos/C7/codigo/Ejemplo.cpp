#include <stdio.h>

int main(void) {
  int x = 3;
  int y = 8;
  int *p;
  p = &x;
  *p = 7;
  p = &y;
  *p = *p + 1;
  /* p guarda la direccion de x */
  /* escribe a traves de p */
  /* p ahora apunta a y */
  printf("x = %d, y = %d\n", x, y);
  printf("p %p", p);
  printf("*p %d", *p);
  return 0;
}
