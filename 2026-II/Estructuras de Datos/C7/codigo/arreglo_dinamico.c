/* Un arreglo cuyo tamano se conoce en ejecucion */
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int n = 0;
    int *datos;
    int i;
    int estado = 0;

    printf("Cuantos valores? ");
    if (scanf("%d", &n) != 1 || n <= 0) {
        printf("Cantidad invalida\n");
        estado = 1;
    } else {
        datos = malloc(n * sizeof(int));
        if (datos == NULL) {
            printf("No hay memoria disponible\n");
            estado = 1;
        } else {
            i = 0;
            while (i < n) {
                datos[i] = i * i;
                i = i + 1;
            }
            i = 0;
            while (i < n) {
                printf("datos[%d] = %d\n", i, datos[i]);
                i = i + 1;
            }
            free(datos);
            datos = NULL;
        }
    }
    return estado;
}
