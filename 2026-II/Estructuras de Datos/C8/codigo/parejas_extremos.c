/* Propuesto 1: dos punteros que se acercan desde los extremos */
#include <stdio.h>

int main(void) {
    int A[6] = {1, 3, 5, 7, 9, 11};
    int *p = A;
    int *q = A + 5;
    int suma = 0;

    while (p < q) {
        suma = suma + *p + *q;
        p = p + 1;
        q = q - 1;
    }
    printf("suma = %d\n", suma);
    return 0;
}
