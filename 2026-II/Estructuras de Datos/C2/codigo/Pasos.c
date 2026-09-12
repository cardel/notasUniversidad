#include <stdio.h>

int main() {
  int pasos = 0;
  int n = 10; // Número de pasos a dar

  for (int i = 0; i < n; i++) {
    pasos++;
    printf("Paso %d\n", pasos);
  }

  return 0;
}
