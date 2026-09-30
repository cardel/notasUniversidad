#include <stdio.h>

/* Suma los elementos de un arreglo. */
int suma_arreglo(int datos[], int n) {
    int i = 0;
    int suma = 0;
    while (i < n) {
        suma = suma + datos[i];
        i = i + 1;
    }
    return suma;
}

int main() {
    int datos[] = {3, 4, 5, 1, 6};
    int n = 5;

    printf("suma = %d\n", suma_arreglo(datos, n));
    return 0;
}
