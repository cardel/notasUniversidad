/* Recorrido de una matriz por filas, que es el orden en que esta guardada.
   Compilar con -g: sin informacion de depuracion, cg_annotate no puede
   atribuir los fallos a una linea del fuente.

     gcc -g -o arr_filas arr_filas.c                                        */
#include <stdio.h>
#include <stdlib.h>

int main(void) {
  int filas = 1000, cols = 1000;

  /* Un arreglo de dos dimensiones no existe en memoria: es una tira lineal
     y cada `cols` elementos empieza una fila.                              */
  int *arr = malloc(filas * cols * sizeof(int));
  if (arr == NULL) return 1;

  for (int i = 0; i < filas; i++)
    for (int j = 0; j < cols; j++)
      arr[i * cols + j] = i * j;      /* avanza de a uno por la tira */

  printf("%d\n", arr[filas * cols - 1]);
  free(arr);
  return 0;
}
