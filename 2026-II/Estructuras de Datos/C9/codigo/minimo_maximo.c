#include <stdio.h>

/* Deja en *minimo y *maximo el menor y el mayor de los n enteros de A */
void minimo_y_maximo(int *A, int n, int *minimo, int *maximo) {
    int i = 1;

    *minimo = A[0];
    *maximo = A[0];
    while (i < n) {
        if (A[i] < *minimo) {
            *minimo = A[i];
        }
        if (A[i] > *maximo) {
            *maximo = A[i];
        }
        i = i + 1;
    }
}

int main(void) {
    int A[6] = {7, 3, 9, 1, 8, 4};
    int menor, mayor;

    minimo_y_maximo(A, 6, &menor, &mayor);
    printf("minimo = %d maximo = %d\n", menor, mayor);
    return 0;
}
