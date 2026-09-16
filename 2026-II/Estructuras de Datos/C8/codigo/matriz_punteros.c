/* La otra forma de armar una matriz: un arreglo de punteros,
   donde cada fila pide su propio bloque */
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int rows = 3;
    int cols = 4;
    int **arr;
    int *ptr;
    int i;
    int j;
    int estado = 0;

    arr = malloc(rows * sizeof(int *));
    if (arr == NULL) {
        printf("No hay memoria disponible\n");
        estado = 1;
    } else {
        i = 0;
        while (i < rows) {
            arr[i] = malloc(cols * sizeof(int));
            ptr = arr[i];
            if (ptr != NULL) {
                j = 0;
                while (j < cols) {
                    ptr[j] = 10 * (i + 1) + j;
                    j = j + 1;
                }
            }
            i = i + 1;
        }

        i = 0;
        while (i < rows) {
            ptr = arr[i];
            if (ptr != NULL) {
                j = 0;
                while (j < cols) {
                    printf("%4d", arr[i][j]);
                    j = j + 1;
                }
            }
            printf("\n");
            i = i + 1;
        }

        /* De adentro hacia afuera: primero las filas, al final el arreglo */
        i = 0;
        while (i < rows) {
            ptr = arr[i];
            if (ptr != NULL) {
                free(ptr);
                arr[i] = NULL;
            }
            i = i + 1;
        }
        free(arr);
        arr = NULL;
    }
    return estado;
}
