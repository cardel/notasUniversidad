/* El mayor de la matriz y su posicion */
#include <stdio.h>

int main(void) {
    int M[3][4] = {
        {3, 9, 1, 4},
        {7, 2, 8, 5},
        {6, 0, 2, 1}
    };
    int i;
    int j;
    int mayor = M[0][0];
    int fila = 0;
    int columna = 0;

    i = 0;
    while (i < 3) {
        j = 0;
        while (j < 4) {
            if (M[i][j] > mayor) {
                mayor = M[i][j];
                fila = i;
                columna = j;
            }
            j = j + 1;
        }
        i = i + 1;
    }
    printf("El mayor es %d, en la fila %d y la columna %d\n",
           mayor, fila, columna);
    return 0;
}
