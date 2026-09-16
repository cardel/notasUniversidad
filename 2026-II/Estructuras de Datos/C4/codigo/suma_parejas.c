#include <stdio.h>

/* El ciclo interno arranca en i: parejas (i, j) con i <= j */
int suma_parejas(int datos[], int n) {
    int suma = 0;
    int i = 0;
    while (i < n) {
        int j = i;
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
    printf("%d\n", suma_parejas(datos, 3));
    return 0;
}
