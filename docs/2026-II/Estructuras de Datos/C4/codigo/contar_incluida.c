#include <stdio.h>

/* El limite se corre en uno: j recorre 0 .. i */
int contar_incluida(int n) {
    int i = 0;
    int cuenta = 0;
    while (i < n) {
        int j = 0;
        while (j <= i) {
            cuenta = cuenta + 1;
            j = j + 1;
        }
        i = i + 1;
    }
    return cuenta;
}

int main(void) {
    printf("%d %d\n", contar_incluida(4), contar_incluida(5));
    return 0;
}
