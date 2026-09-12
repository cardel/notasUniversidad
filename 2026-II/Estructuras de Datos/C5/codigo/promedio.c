#include <stdio.h>

/* Promedio entero de un arreglo; suponga n >= 1 */
int promedio(int datos[], int n) {
    int suma = 0;
    int i = 0;
    while (i < n) {
        suma = suma + datos[i];
        i = i + 1;
    }
    return suma / n;
}

int main(void) {
    int datos[] = {4, 7, 3, 1, 8, 5};
    printf("%d\n", promedio(datos, 6));
    return 0;
}
