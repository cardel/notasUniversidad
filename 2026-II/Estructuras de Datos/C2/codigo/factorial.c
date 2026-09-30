/* Paradigma imperativo: se dice COMO calcular el factorial */
#include <stdio.h>

long factorial(int n) {
    long resultado;
    int i;

    resultado = 1;
    i = 2;
    while (i <= n) {
        resultado = resultado * i;  /* la variable cambia de valor */
        i = i + 1;
    }
    return resultado;
}

int main(void) {
    printf("%ld\n", factorial(5));
    return 0;
}
