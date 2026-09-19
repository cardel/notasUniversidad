#include <stdio.h>

/* Recorre todas las posiciones y pregunta por las dos condiciones. */
int contar_v1(int datos[], int n) {
    int cuenta = 0;
    int i = 0;
    while (i < n) {
        if (i % 2 == 0 && datos[i] % 2 == 0) {
            cuenta = cuenta + 1;
        }
        i = i + 1;
    }
    return cuenta;
}

/* Visita solo las posiciones pares, avanzando de dos en dos. */
int contar_v2(int datos[], int n) {
    int cuenta = 0;
    int i = 0;
    while (i < n) {
        if (datos[i] % 2 == 0) {
            cuenta = cuenta + 1;
        }
        i = i + 2;
    }
    return cuenta;
}

int main() {
    int datos[] = {4, 7, 3, 1, 8, 5};
    int n = 6;

    printf("contar_v1: %d\n", contar_v1(datos, n));
    printf("contar_v2: %d\n", contar_v2(datos, n));
    return 0;
}
