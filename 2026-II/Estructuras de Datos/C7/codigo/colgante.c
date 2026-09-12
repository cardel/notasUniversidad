/* Usar memoria despues de liberarla: puntero colgante */
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int *p;
    int estado = 0;

    p = malloc(sizeof(int));
    if (p == NULL) {
        estado = 1;
    } else {
        *p = 42;
        free(p);
        printf("%d\n", *p);   /* la memoria ya no es nuestra */
    }
    return estado;
}
