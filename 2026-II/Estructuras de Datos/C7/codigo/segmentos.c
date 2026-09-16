/* Una variable de cada region: datos, pila y monticulo */
#include <stdio.h>
#include <stdlib.h>

int global = 5;

int main(void) {
    int local = 10;
    int *dinamico;
    int estado = 0;

    dinamico = malloc(sizeof(int));
    if (dinamico == NULL) {
        printf("No hay memoria disponible\n");
        estado = 1;
    } else {
        *dinamico = 15;
        printf("global:   %d en %p\n", global, (void *) &global);
        printf("local:    %d en %p\n", local, (void *) &local);
        printf("dinamico: %d en %p\n", *dinamico, (void *) dinamico);
        free(dinamico);
        dinamico = NULL;
    }
    return estado;
}
