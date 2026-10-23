// Metodo de la division: multiplos de 8 con m = 16 y con m = 17.
#include <cstdio>

int main() {
  int m[2] = {16, 17};
  int j = 0;
  while (j < 2) {
    printf("m = %2d:", m[j]);
    int k = 8;
    while (k <= 64) {
      printf(" %2d", k % m[j]);
      k = k + 8;
    }
    printf("\n");
    j = j + 1;
  }
  return 0;
}
