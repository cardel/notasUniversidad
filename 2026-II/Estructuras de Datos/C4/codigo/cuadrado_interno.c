#include <stdio.h>

/* El limite interno es el cuadrado del indice externo */
int cuadrado_interno(int n) {
    int i = 0;
    int cuenta = 0;
    while (i < n) {
        int j = 0;
        while (j < i * i) {
            cuenta = cuenta + 1;
            j = j + 1;
        }
        i = i + 1;
    }
    return cuenta;
}

int main(void) {
    printf("%d %d\n", cuadrado_interno(4), cuadrado_interno(5));
    return 0;
}
