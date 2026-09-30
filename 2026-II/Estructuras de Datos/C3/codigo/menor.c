#include <stdio.h>

/* Ejercicio 1: el menor de dos enteros. */
int menor(int a, int b) {
    int m = a;
    if (b < a) {
        m = b;
    }
    return m;
}

int main() {
    printf("menor(7, 3) = %d\n", menor(7, 3));
    printf("menor(3, 7) = %d\n", menor(3, 7));
    return 0;
}
