/* Un puntero guarda la direccion de otra variable */
#include <stdio.h>

int main(void) {
    int x = 3;
    int y = 8;
    int *p;

    p = &x;         /* p guarda la direccion de x */
    *p = 7;         /* escribe en x a traves de p */
    p = &y;         /* p ahora apunta a y */
    *p = *p + 1;    /* suma 1 a y */

    printf("x = %d, y = %d\n", x, y);
    return 0;
}
