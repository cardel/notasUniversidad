#include <stdio.h>

/* Dos ciclos internos en secuencia: uno crece con i, el otro decrece */
int complemento(int n) {
    int i = 0;
    int cuenta = 0;
    while (i < n) {
        int j = 0;
        while (j < i) {
            cuenta = cuenta + 1;
            j = j + 1;
        }
        j = 0;
        while (j < n - i) {
            cuenta = cuenta + 1;
            j = j + 1;
        }
        i = i + 1;
    }
    return cuenta;
}

int main(void) {
    printf("%d %d\n", complemento(3), complemento(4));
    return 0;
}
