#include <stdio.h>

/* Ejercicio de cierre: el ciclo interno depende del externo. */
int triangulo(int n) {
    int i = 0;
    int cuenta = 0;
    while (i < n) {
        int j = 0;
        while (j < i) {
            cuenta = cuenta + 1;
            j = j + 1;
        }
        i = i + 1;
    }
    return cuenta;
}

int main() {
    printf("triangulo(4) = %d\n", triangulo(4));
    printf("triangulo(5) = %d\n", triangulo(5));
    return 0;
}
