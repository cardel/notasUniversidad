#include <stdio.h>

/* El ciclo frena cuando i * i alcanza a 2n */
int frenado(int n) {
    int i = 0;
    int cuenta = 0;
    while (i * i < 2 * n) {
        cuenta = cuenta + 1;
        i = i + 1;
    }
    return cuenta;
}

int main(void) {
    printf("%d %d %d\n", frenado(10), frenado(20), frenado(50));
    return 0;
}
