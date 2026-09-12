#include <stdio.h>

/* Suma los productos de las parejas (i, j) con i < j */
int parejas_estrictas(int datos[], int n) {
    int suma = 0;
    int i = 0;
    while (i < n) {
        int j = i + 1;
        while (j < n) {
            suma = suma + datos[i] * datos[j];
            j = j + 1;
        }
        i = i + 1;
    }
    return suma;
}

int main(void) {
    int datos[] = {1, 2, 3};
    printf("%d\n", parejas_estrictas(datos, 3));
    return 0;
}
