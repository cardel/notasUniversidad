/* Mismo ciclo en C: se suman los enteros de 0 a 49 999 999 */
#include <stdio.h>

int main(void) {
    long suma;
    long i;

    suma = 0;
    i = 0;
    while (i < 50000000) {
        suma = suma + i;
        i = i + 1;
    }
    printf("%ld\n", suma);
    return 0;
}
