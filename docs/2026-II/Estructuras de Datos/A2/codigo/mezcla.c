/* El programa de la pregunta 16, contra la expresion cerrada. */
#include <stdio.h>

int mezcla(int n) {
    int t = 0;
    int i = 0;
    int j = 0;
    while (i < n) {
        t = t + 1;
        i = i + 1;
    }
    i = 0;
    while (i < n) {
        j = 0;
        while (j < i) {
            t = t + 1;
            j = j + 1;
        }
        i = i + 1;
    }
    return t;
}

int main(void) {
    int n = 1;
    printf("  n   mezcla(n)   (n*n + n)/2   n*n\n");
    while (n <= 10) {
        printf("%3d %10d %13d %6d\n", n, mezcla(n), (n * n + n) / 2, n * n);
        n = n + 1;
    }
    n = 100;
    printf("%3d %10d %13d %6d\n", n, mezcla(n), (n * n + n) / 2, n * n);
    return 0;
}
