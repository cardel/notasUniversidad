#include <stdio.h>

/* Ejercicio 3: el indice avanza de tres en tres. */
int saltos(int n) {
    int i = 0;
    int cuenta = 0;
    while (i < n) {
        cuenta = cuenta + 1;
        i = i + 3;
    }
    return cuenta;
}

int main() {
    printf("saltos(10) = %d\n", saltos(10));
    printf("saltos(19) = %d\n", saltos(19));
    printf("saltos(31) = %d\n", saltos(31));
    return 0;
}
