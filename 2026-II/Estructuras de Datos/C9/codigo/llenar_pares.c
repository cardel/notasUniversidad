#include <stdio.h>

/* Escribe en A los primeros n numeros pares: 0, 2, 4, ... */
void llenar_pares(int *A, int n) {
    int i = 0;

    while (i < n) {
        A[i] = 2 * i;
        i = i + 1;
    }
}

int main(void) {
    int A[5];
    int i;

    llenar_pares(A, 5);
    i = 0;
    while (i < 5) {
        printf("%d ", A[i]);
        i = i + 1;
    }
    printf("\n");
    return 0;
}
