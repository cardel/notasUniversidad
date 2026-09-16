#include <stdio.h>

/* Intercambia los enteros que viven en las direcciones a y b */
void intercambiar(int *a, int *b) {
    int temporal = *a;

    *a = *b;
    *b = temporal;
}

/* Intercambia la primera y la ultima casilla de A */
void intercambiar_extremos(int *A, int n) {
    intercambiar(&A[0], &A[n - 1]);
}

int main(void) {
    int A[5] = {1, 2, 3, 4, 5};
    int i;

    intercambiar_extremos(A, 5);
    i = 0;
    while (i < 5) {
        printf("%d ", A[i]);
        i = i + 1;
    }
    printf("\n");
    return 0;
}
