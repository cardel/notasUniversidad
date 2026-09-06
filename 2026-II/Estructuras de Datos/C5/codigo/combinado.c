#include <stdio.h>

/* Tres bloques en secuencia: el mayor, las parejas que lo superan
   y los bits de n */
int combinado(int datos[], int n) {
    int mayor = datos[0];
    int i = 1;
    while (i < n) {
        if (datos[i] > mayor) {
            mayor = datos[i];
        }
        i = i + 1;
    }
    int parejas = 0;
    i = 0;
    while (i < n) {
        int j = i + 1;
        while (j < n) {
            if (datos[i] + datos[j] > mayor) {
                parejas = parejas + 1;
            }
            j = j + 1;
        }
        i = i + 1;
    }
    int pasos = 0;
    int valor = 1;
    while (valor <= n) {
        pasos = pasos + 1;
        valor = valor * 2;
    }
    return parejas + pasos;
}

int main(void) {
    int datos[] = {4, 7, 3, 1, 8, 5};
    printf("%d\n", combinado(datos, 6));
    return 0;
}
