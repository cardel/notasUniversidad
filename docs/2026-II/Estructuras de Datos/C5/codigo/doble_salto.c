#include <stdio.h>

/* Externo de dos en dos, interno completo; suponga n par */
int doble_salto(int n) {
    int i = 0;
    int cuenta = 0;
    while (i < n) {
        int j = 0;
        while (j < n) {
            cuenta = cuenta + 1;
            j = j + 1;
        }
        i = i + 2;
    }
    return cuenta;
}

int main(void) {
    printf("%d %d\n", doble_salto(4), doble_salto(6));
    return 0;
}
