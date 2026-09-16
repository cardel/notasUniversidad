#include <stdio.h>

/* Tres ciclos: el de j es independiente, el de k depende de i */
int mixto(int n) {
    int i = 0;
    int cuenta = 0;
    while (i < n) {
        int j = 0;
        while (j < n) {
            int k = 0;
            while (k < i) {
                cuenta = cuenta + 1;
                k = k + 1;
            }
            j = j + 1;
        }
        i = i + 1;
    }
    return cuenta;
}

int main(void) {
    printf("%d %d\n", mixto(3), mixto(4));
    return 0;
}
