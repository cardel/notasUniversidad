#include <stdio.h>

/* El limite interno es el doble del indice externo */
int doble_i(int n) {
    int i = 0;
    int cuenta = 0;
    while (i < n) {
        int j = 0;
        while (j < 2 * i) {
            cuenta = cuenta + 1;
            j = j + 1;
        }
        i = i + 1;
    }
    return cuenta;
}

int main(void) {
    printf("%d %d\n", doble_i(4), doble_i(5));
    return 0;
}
