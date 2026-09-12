#include "stdio.h"

int main() {
  int *p;
  printf("%p\n", p);
  *p = 10;
}
