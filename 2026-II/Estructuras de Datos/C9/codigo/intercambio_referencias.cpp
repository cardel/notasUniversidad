#include <cstdio>

/* Intercambia las variables a las que a y b dan nombre */
void intercambiar(int &a, int &b) {
    int temporal = a;

    a = b;
    b = temporal;
}

int main() {
    int x = 10;
    int y = 2;

    intercambiar(x, y);
    printf("x = %d y = %d\n", x, y);
    return 0;
}
