/* La misma fila de mayor suma, con un arreglo de punteros:
   n punteros, cada uno a una fila de m enteros */
#include <stdio.h>
#include <stdlib.h>

/* Reserva n filas de m enteros. Devuelve la matriz, o NULL si
   alguna fila falla, y en ese caso libera lo que ya habia pedido */
int **reservar(int n, int m) {
    int **M = malloc(n * sizeof(int *));
    int reservadas = 0;
    int i = 0;

    if (M != NULL) {
        while (i < n) {
            M[i] = malloc(m * sizeof(int));
            if (M[i] != NULL) {
                reservadas = reservadas + 1;
            }
            i = i + 1;
        }
        if (reservadas < n) {
            i = 0;
            while (i < n) {
                free(M[i]);
                M[i] = NULL;
                i = i + 1;
            }
            free(M);
            M = NULL;
        }
    }
    return M;
}

void liberar(int **M, int n) {
    int i = 0;

    while (i < n) {
        free(M[i]);
        M[i] = NULL;
        i = i + 1;
    }
    free(M);
}

void fila_mayor_suma(int **M, int n, int m, int *fila, int *suma) {
    int i = 1;
    int j = 0;
    int actual = 0;

    *fila = 0;
    *suma = 0;
    while (j < m) {
        *suma = *suma + *(*(M + 0) + j);
        j = j + 1;
    }
    while (i < n) {
        actual = 0;
        j = 0;
        while (j < m) {
            actual = actual + *(*(M + i) + j);
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
    int **M;
    int i = 0;
    int j = 0;
    int leidos = 0;
    int fila = 0;
    int suma = 0;
    int estado = 0;

    if (scanf("%d %d", &n, &m) != 2 || n <= 0 || m <= 0) {
        printf("Tamano invalido\n");
        estado = 1;
    } else {
        M = reservar(n, m);
        if (M == NULL) {
            printf("No hay memoria disponible\n");
            estado = 1;
        } else {
            while (i < n) {
                j = 0;
                while (j < m) {
                    leidos = leidos + scanf("%d", *(M + i) + j);
                    j = j + 1;
                }
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
            liberar(M, n);
            M = NULL;
        }
    }
    return estado;
}
