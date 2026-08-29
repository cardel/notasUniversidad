/* Ejercicio 2 con las tres reglas aplicadas */
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int n = 4;
    int estado = 0;
    int *a = malloc(n * sizeof(int));
    int *b = malloc(n * sizeof(int));

    if (a == NULL || b == NULL) {
        printf("No hay memoria disponible\n");
        estado = 1;
    } else {
        a[0] = 1;
        b[0] = 2;

        free(b);                           /* el bloque viejo se devuelve */
        b = malloc(2 * n * sizeof(int));   /* y solo despues se reasigna */
        if (b == NULL) {
            printf("No hay memoria disponible\n");
            estado = 1;
        } else {
            b[0] = 3;
            printf("%d %d\n", a[0], b[0]);
            free(b);
            b = NULL;
        }
        free(a);
        a = NULL;
    }
    return estado;
}
