#include <stdio.h>

/* Suma datos[i] * datos[j] para todas las parejas de posiciones. */
int suma_productos(int datos[], int n) {
    int suma = 0;
    int i = 0;
    while (i < n) {
        int j = 0;
        while (j < n) {
            suma = suma + datos[i] * datos[j];
            j = j + 1;
        }
        i = i + 1;
    }
    return suma;
}

int main() {
    int datos[] = {1, 2, 3};
    int n = 3;

    printf("suma_productos = %d\n", suma_productos(datos, n));
    return 0;
}
