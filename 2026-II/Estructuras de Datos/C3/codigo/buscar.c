#include <stdio.h>

/* Decide si el valor v aparece en el arreglo; recorre siempre todo. */
int buscar(int datos[], int n, int v) {
    int esta = 0;
    int i = 0;
    while (i < n) {
        if (datos[i] == v) {
            esta = 1;
        }
        i = i + 1;
    }
    return esta;
}

int main() {
    int datos[] = {3, 4, 5, 1, 6};
    int n = 5;

    printf("buscar 3: %d\n", buscar(datos, n, 3));
    printf("buscar 9: %d\n", buscar(datos, n, 9));
    return 0;
}
