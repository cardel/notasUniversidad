#include <stdio.h>

/* Intenta intercambiar dos enteros */
void intercambiar(int a, int b) {
    int temporal = a;

    a = b;
    b = temporal;
}

int main(void) {
    int x = 10;
    int y = 2;

    intercambiar(x, y);
    printf("x = %d y = %d\n", x, y);
    return 0;
}
