#include <stdio.h>
#include <stdlib.h>

int main() {

  int rows = 3;
  int cols = 4;
  int **arr = malloc(rows * sizeof(int *));
  for (int i = 0; i < rows; i++) {
    arr[i] = malloc(cols * sizeof(int));
  }

  if (arr != NULL) {
    for (int i = 0; i < rows; i++) {
      int *ptr = arr[i];
      if (ptr != NULL) {
        for (int j = 0; j < cols; j++) {
          // arr[i][j] = 10;
          ptr[i] = 10;
        }
      }
    }
  }

  // Libero
  //  Para liberar debo hacerlo de adentro hacia afuera
  //
  if (arr != NULL) {
    for (int i = 0; i < rows; i++) {
      int *ptr = arr[i];
      if (ptr != NULL) {
        free(ptr);
        ptr = NULL;
      }
    }
    free(arr);
    arr = NULL;
  }
}
