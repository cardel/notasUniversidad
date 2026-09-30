#include <stdio.h>

int main() {

  int a = 2147483647;

  printf("%d\n", ++a);

  int b = -2147483648;
  printf("%d\n", --b);
}
