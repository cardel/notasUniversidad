#include <stdio.h>

/* Tres ciclos anidados, cada uno dependiente del anterior */
int tercetos(int n) {
    int cuenta = 0;
    int i = 0;
    while (i < n) {
        int j = 0;
        while (j < i) {
            int k = 0;
            while (k < j) {
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
    printf("%d %d %d\n", tercetos(4), tercetos(5), tercetos(6));
    return 0;
}
