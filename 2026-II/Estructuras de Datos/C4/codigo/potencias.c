#include <stdio.h>

/* El indice se duplica en cada vuelta */
int potencias(int n) {
    int i = 1;
    int cuenta = 0;
    while (i <= n) {
        cuenta = cuenta + 1;
        i = i * 2;
    }
    return cuenta;
}

int main(void) {
    printf("%d %d %d %d\n", potencias(10), potencias(20),
           potencias(100), potencias(1000));
    return 0;
}
