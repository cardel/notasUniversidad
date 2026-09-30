#include <stdio.h>

int main() {
  int datos[5];

  for (int i = 0; i < 5; i++) {
    scanf("%d", &datos[i]);
  }

  // Imprimir en orden inverso
  for (int i = 4; i >= 0; i--) {
    printf("%d ", datos[i]);
  }
  printf("\n");

  // Maximo y promedio;
  int maximo;
  double promedio;
  promedio = datos[0];
  maximo = datos[0];
  for (int i = 1; i < 5; i++) {
    promedio += datos[i];
    if (datos[i] > maximo) {
      maximo = datos[i];
    }
  }
  promedio = promedio / 5.0;
  printf("El maximo es %d y el promedio %0.3f", maximo, promedio);
}
