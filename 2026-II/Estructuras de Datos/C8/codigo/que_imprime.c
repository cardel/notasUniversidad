/* Prediga antes de correrlo: un puntero que arranca en mitad del arreglo */
#include <stdio.h>

int main(void) {
    int A[5] = {2, 4, 6, 8, 10};
    int *p = A + 1;

    printf("%d\n", *p + *(p + 2));
    return 0;
}
