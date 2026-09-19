/* Muestra paso a paso el algoritmo de Euclides */
#include <cstdio>

void traza(int a, int b) {
    int x = a;
    int y = b;
    int residuo = 0;

    printf("mcd(%d, %d)\n", a, b);
    while (y != 0) {
        residuo = x % y;
        printf("  %4d mod %4d = %4d\n", x, y, residuo);
        x = y;
        y = residuo;
    }
    printf("  ultimo residuo antes del cero: %d\n\n", x);
}

int main() {
    traza(25, 15);
    traza(27, 18);
    traza(22, 40);
    traza(15, 50);
    return 0;
}
