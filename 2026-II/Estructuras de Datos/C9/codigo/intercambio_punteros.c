#include <stdio.h>

/* Intercambia los enteros que viven en las direcciones a y b */
void intercambiar(int *a, int *b) {
    int temporal = *a;

    *a = *b;
    *b = temporal;
}

int main(void) {
    int x = 10;
    int y = 2;

    intercambiar(&x, &y);
    printf("x = %d y = %d\n", x, y);
    return 0;
}
