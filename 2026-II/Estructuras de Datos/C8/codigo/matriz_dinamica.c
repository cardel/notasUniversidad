/* Una matriz cuyo tamano se conoce en ejecucion */
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int n = 0;
    int m = 0;
    int *M;
    int i;
    int j;
    int estado = 0;

    printf("Filas y columnas? ");
    if (scanf("%d %d", &n, &m) != 2 || n <= 0 || m <= 0) {
        printf("Tamano invalido\n");
        estado = 1;
    } else {
        M = malloc(n * m * sizeof(int));
        if (M == NULL) {
            printf("No hay memoria disponible\n");
            estado = 1;
        } else {
            i = 0;
            while (i < n) {
                j = 0;
                while (j < m) {
                    M[i * m + j] = 10 * (i + 1) + j;
                    j = j + 1;
                }
                i = i + 1;
            }
            i = 0;
            while (i < n) {
                j = 0;
                while (j < m) {
                    printf("%4d", M[i * m + j]);
                    j = j + 1;
                }
                printf("\n");
                i = i + 1;
            }
            free(M);
            M = NULL;
        }
    }
    return estado;
}
