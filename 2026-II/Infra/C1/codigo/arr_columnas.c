/* La misma matriz, las mismas escrituras, los mismos datos. Lo unico que
   cambia es que los dos ciclos van al reves.

     gcc -g -o arr_columnas arr_columnas.c                                  */
#include <stdio.h>
#include <stdlib.h>

int main(void) {
  int filas = 1000, cols = 1000;

  int *arr = malloc(filas * cols * sizeof(int));
  if (arr == NULL) return 1;

  for (int j = 0; j < cols; j++)
    for (int i = 0; i < filas; i++)
      arr[i * cols + j] = i * j;      /* salta de a `cols` por la tira */

  printf("%d\n", arr[filas * cols - 1]);
  free(arr);
  return 0;
}
