/* Sumar cada fila de la planilla de notas */
#include <stdio.h>

int main(void) {
    int M[3][4] = {
        {10, 11, 12, 13},
        {20, 21, 22, 23},
        {30, 31, 32, 33}
    };
    int i;
    int j;
    int total;

    i = 0;
    while (i < 3) {
        total = 0;
        j = 0;
        while (j < 4) {
            total = total + M[i][j];
            j = j + 1;
        }
        printf("Fila %d: suma %d\n", i, total);
        i = i + 1;
    }
    return 0;
}
