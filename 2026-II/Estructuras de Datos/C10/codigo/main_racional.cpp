#include "racional.h"
#include <cstdio>

int main() {
    Racional a = Racional(2, 8);
    Racional b = Racional(15, 50);
    Racional s = a.sumar(b);
    Racional m = a.multiplicar(b);
    Racional un_cuarto = Racional(1, 4);

    printf("a  = ");
    a.imprimir();
    printf("b  = ");
    b.imprimir();
    printf("a + b = ");
    s.imprimir();
    printf("a * b = ");
    m.imprimir();
    printf("a igual a 1/4: %d\n", a.igual(un_cuarto));
    printf("a igual a b:   %d\n", a.igual(b));
    return 0;
}
