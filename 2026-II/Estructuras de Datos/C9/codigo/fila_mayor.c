#include <stdio.h>
#include <stdlib.h>

void forma1(int n, int m) {

  int *arr = malloc(n * m * sizeof(int));
  if (arr != NULL) {
    for (int i = 0; i < n; i++) {
      for (int j = 0; j < m; j++) {
        scanf("%d", &arr[i * m + j]);
        // scanf("%d", arr+i*m+j);
      }
    }

    // Determino la mayor suma de cada fila
    int suma = 0;
    int fila = 0;
    // Voy a tomar la suma de la primera fila
    for (int j = 0; j < m; j++) {
      suma += arr[0 * m + j];
    }
    // arr + i*m + j
    // Trabajo desde la segunda fila en adelante
    for (int i = 1; i < n; i++) {
      int suma_fila = 0;
      for (int j = 0; j < m; j++) {
        suma_fila += arr[i * m + j];
      }

      if (suma_fila > suma) {
        suma = suma_fila;
        fila = i;
      }
    }

    printf("La fila de mayor suma es %d y su valor es %d\n", fila, suma);
    // Liberar memoria
    free(arr);
    arr = NULL;
  }
}

void forma2(int n, int m) {
  int **arr = malloc(n * sizeof(int *));
  if (arr != NULL) {
    for (int i = 0; i < n; i++) {
      arr[i] = malloc(m * sizeof(int));
      if (arr[i] != NULL) {
        for (int j = 0; j < m; j++) {
          // scanf("%d", arr[i][j]);
          scanf("%d", *(arr + i) + j);
          // *(arr + i) + j
        }
      } else {
        printf("Error al asignar la fila %d\n", i);
        return;
      }
    }

    // Imprimir
    int suma = 0;
    int fila = 0;
    // Voy a tomar la suma de la primera fila
    for (int j = 0; j < m; j++) {
      suma += arr[0][j];
      // *(arr+0)+j
    }
    // Trabajo desde la segunda fila en adelante
    for (int i = 1; i < n; i++) {
      int suma_fila = 0;
      for (int j = 0; j < m; j++) {
        suma_fila += *(*(arr + i) + j);
      }

      if (suma_fila > suma) {
        suma = suma_fila;
        fila = i;
      }
    }

    printf("La fila de mayor suma es %d y su valor es %d\n", fila, suma);

    for (int i = 0; i < n; i++) {
      free(arr[i]);
      arr[i] = NULL;
    }
    free(arr);
    arr = NULL;
  }
}

int main() {
  int n, m;
  scanf("%d %d", &n, &m);
  forma1(n, m);
  forma2(n, m);
  return 0;
}
