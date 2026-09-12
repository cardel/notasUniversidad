/* Leer fuera del arreglo: el lenguaje no revisa los limites */
#include <stdio.h>

int main(void) {
    int A[4] = {1, 2, 3, 4};

    printf("A[3] = %d\n", A[3]);
    printf("A[4] = %d\n", A[4]);   /* la casa de al lado */
    return 0;
}
