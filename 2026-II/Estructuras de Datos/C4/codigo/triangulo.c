#include <stdio.h>

/* Ciclo interno dependiente: j recorre 0 .. i-1 */
int triangulo(int n) {
    int i = 0;
    int cuenta = 0;
    while (i < n) {
        int j = 0;
        while (j < i) {
            cuenta = cuenta + 1;
            j = j + 1;
        }
        i = i + 1;
    }
    return cuenta;
}

int main(void) {
    printf("%d %d %d\n", triangulo(4), triangulo(5), triangulo(100));
    return 0;
}
