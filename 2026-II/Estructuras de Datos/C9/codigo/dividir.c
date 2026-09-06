#include <stdio.h>

/* Deja en *cociente y *residuo el resultado de dividir a entre b */
void dividir(int a, int b, int *cociente, int *residuo) {
    *cociente = a / b;
    *residuo = a % b;
}

int main(void) {
    int c, r;

    dividir(17, 5, &c, &r);
    printf("17 = %d * 5 + %d\n", c, r);
    return 0;
}
