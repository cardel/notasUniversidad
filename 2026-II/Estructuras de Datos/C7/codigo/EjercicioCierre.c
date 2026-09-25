#include <stdio.h>
#include <stdlib.h>

int main() {

  int n;
  scanf("%d", &n);
  double *temperaturas = malloc(n * sizeof(double));
  // double temperaturas[n]; // C99 lo permite, pero queda en la pila
  if (temperaturas != NULL) {
    for (int i = 0; i < n; i++) {
      scanf("%lf", &temperaturas[i]);
      // scanf("%lf", temperaturas + i); // otra forma de hacerlo
    }
    double promedio = 0.0;
    for (int i = 0; i < n; i++) {
      promedio += temperaturas[i];
      // promedio += *(temperaturas + i); // otra forma de hacerlo
    }
    promedio /= n;
    int mayores_promedio = 0;
    for (int i = 0; i < n; i++) {
      if (temperaturas[i] > promedio) {
        mayores_promedio++;
      }
    }
    printf("Promedio: %.4lf\n", promedio);
    printf("Cantidad de temperaturas mayores al promedio: %d\n",
           mayores_promedio);
    free(temperaturas);
    temperaturas = NULL;
  } else {
    printf("Error al asignar memoria\n");
  }
}
