#include <stdio.h>

/* Cuantos pares hay de mas frente a los impares */
int diferencia(int datos[], int n) {
    int pares = 0;
    int impares = 0;
    int i = 0;
    while (i < n) {
        if (datos[i] % 2 == 0) {
            pares = pares + 1;
        }
        if (datos[i] % 2 != 0) {
            impares = impares + 1;
        }
        i = i + 1;
    }
    return pares - impares;
}

int main(void) {
    int datos[] = {4, 7, 3, 1, 8, 5};
    printf("%d\n", diferencia(datos, 6));
    return 0;
}
