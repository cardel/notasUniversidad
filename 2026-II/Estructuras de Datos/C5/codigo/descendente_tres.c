#include <stdio.h>

/* Baja de tres en tres desde n */
int descendente_tres(int n) {
    int cuenta = 0;
    int i = n;
    while (i > 0) {
        cuenta = cuenta + 1;
        i = i - 3;
    }
    return cuenta;
}

int main(void) {
    printf("%d %d\n", descendente_tres(10), descendente_tres(9));
    return 0;
}
