#include <stdio.h>

/* Suma los valores en posiciones pares */
int de_dos_en_dos(int datos[], int n) {
    int suma = 0;
    int i = 0;
    while (i < n) {
        suma = suma + datos[i];
        i = i + 2;
    }
    return suma;
}

int main(void) {
    int datos[] = {4, 7, 3, 1, 8, 5};
    printf("%d\n", de_dos_en_dos(datos, 6));
    return 0;
}
