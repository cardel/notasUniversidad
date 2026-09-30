#include <stdio.h>

/* Externo de dos en dos, interno dependiente */
int salto_dependiente(int n) {
    int i = 0;
    int cuenta = 0;
    while (i < n) {
        int j = 0;
        while (j < i) {
            cuenta = cuenta + 1;
            j = j + 1;
        }
        i = i + 2;
    }
    return cuenta;
}

int main(void) {
    printf("%d %d\n", salto_dependiente(4), salto_dependiente(6));
    return 0;
}
