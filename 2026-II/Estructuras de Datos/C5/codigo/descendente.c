#include <stdio.h>

/* Suma n + (n-1) + ... + 1 bajando */
int descendente(int n) {
    int suma = 0;
    int i = n;
    while (i > 0) {
        suma = suma + i;
        i = i - 1;
    }
    return suma;
}

int main(void) {
    printf("%d %d\n", descendente(5), descendente(10));
    return 0;
}
