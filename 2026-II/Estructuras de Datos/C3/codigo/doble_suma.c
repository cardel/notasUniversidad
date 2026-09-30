#include <stdio.h>

/* Ejercicio 2: dos ciclos, uno despues del otro. */
int doble_suma(int n) {
    int i = 0;
    int suma = 0;
    while (i < n) {
        suma = suma + i;
        i = i + 1;
    }
    i = 0;
    while (i < n) {
        suma = suma + i * i;
        i = i + 1;
    }
    return suma;
}

int main() {
    printf("doble_suma(5) = %d\n", doble_suma(5));
    return 0;
}
