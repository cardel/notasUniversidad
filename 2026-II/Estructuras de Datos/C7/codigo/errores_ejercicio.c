/* Ejercicio 2: compila sin avisos y tiene dos errores de memoria */
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int n = 4;
    int *a = malloc(n * sizeof(int));
    int *b = malloc(n * sizeof(int));

    a[0] = 1;                          /* sin preguntar por NULL */
    b[0] = 2;
    b = malloc(2 * n * sizeof(int));   /* el bloque anterior se pierde */
    b[0] = 3;

    printf("%d %d\n", a[0], b[0]);
    free(a);
    free(b);
    return 0;
}
