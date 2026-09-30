#include <stdio.h>
#include <stdlib.h>

/* Suma los enteros de 0 a m-1. */
long suma_hasta(long m) {
    long i = 0;
    long suma = 0;
    while (i < m) {
        suma = suma + i;
        i = i + 1;
    }
    return suma;
}

/* Uso: ./suma_hasta 1000000000 */
int main(int argc, char *argv[]) {
    long m = 10000000;

    if (argc > 1) {
        m = atol(argv[1]);
    }
    printf("suma_hasta(%ld) = %ld\n", m, suma_hasta(m));
    return 0;
}
