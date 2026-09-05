/* La fila de mayor suma de una matriz de n x m,
   con la matriz en un solo bloque del monticulo */
#include <stdio.h>
#include <stdlib.h>

/* Deja en *fila el indice de la fila de mayor suma
   y en *suma el valor de esa suma */
void fila_mayor_suma(int *M, int n, int m, int *fila, int *suma) {
    int i = 1;
    int j = 0;
    int actual = 0;

    *fila = 0;
    *suma = 0;
    while (j < m) {
        *suma = *suma + M[0 * m + j];
        j = j + 1;
    }
    while (i < n) {
        actual = 0;
        j = 0;
        while (j < m) {
            actual = actual + M[i * m + j];
            j = j + 1;
        }
        if (actual > *suma) {
            *suma = actual;
            *fila = i;
        }
        i = i + 1;
    }
}

int main(void) {
    int n = 0;
    int m = 0;
    int *M;
    int i = 0;
    int leidos = 0;
    int fila = 0;
    int suma = 0;
    int estado = 0;

    if (scanf("%d %d", &n, &m) != 2 || n <= 0 || m <= 0) {
        printf("Tamano invalido\n");
        estado = 1;
    } else {
        M = malloc(n * m * sizeof(int));
        if (M == NULL) {
            printf("No hay memoria disponible\n");
            estado = 1;
        } else {
            while (i < n * m) {
                leidos = leidos + scanf("%d", &M[i]);
                i = i + 1;
            }
            if (leidos != n * m) {
                printf("Faltaron valores\n");
                estado = 1;
            } else {
                fila_mayor_suma(M, n, m, &fila, &suma);
                printf("La fila de mayor suma es %d y su valor es %d\n",
                       fila, suma);
            }
            free(M);
            M = NULL;
        }
    }
    return estado;
}
