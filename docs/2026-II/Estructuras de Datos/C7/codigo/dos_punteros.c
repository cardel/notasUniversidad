/* Ejercicio 1: copiar valores no es copiar direcciones */
#include <stdio.h>

int main(void) {
    int a = 10;
    int b = 20;
    int *p = &a;
    int *q = &b;

    *p = *q;    /* copia el valor: a queda en 20 */
    q = p;      /* copia la direccion: q apunta a a */
    *q = 30;    /* escribe en a */

    printf("a = %d, b = %d\n", a, b);
    return 0;
}
