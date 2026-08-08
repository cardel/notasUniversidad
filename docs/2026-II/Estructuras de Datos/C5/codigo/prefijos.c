#include <stdio.h>

/* Suma de todas las sumas parciales datos[0..i] */
int prefijos(int datos[], int n) {
    int total = 0;
    int i = 0;
    while (i < n) {
        int j = 0;
        while (j <= i) {
            total = total + datos[j];
            j = j + 1;
        }
        i = i + 1;
    }
    return total;
}

int main(void) {
    int datos[] = {1, 2, 3};
    printf("%d\n", prefijos(datos, 3));
    return 0;
}
