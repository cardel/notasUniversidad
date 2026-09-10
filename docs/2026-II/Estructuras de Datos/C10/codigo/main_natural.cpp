#include "natural.h"
#include <cstdio>

/* Los dos naturales llegan por copia: la funcion gasta a b contando */
Natural sumar(Natural a, Natural b) {
    while (!b.esCero()) {
        a.sucesor();
        b.predecesor();
    }
    return a;
}

Natural multiplicar(Natural a, Natural b) {
    Natural salida = Natural();

    while (!b.esCero()) {
        salida = sumar(salida, a);
        b.predecesor();
    }
    return salida;
}

/* Construye el natural que vale n aplicando sucesor n veces */
Natural desde(int n) {
    Natural x = Natural();
    int i = 0;

    while (i < n) {
        x.sucesor();
        i = i + 1;
    }
    return x;
}

int main() {
    Natural a = desde(123);
    Natural b = desde(45);
    Natural d = desde(10);
    Natural c = sumar(a, b);
    Natural e = multiplicar(b, d);
    Natural f = multiplicar(a, e);

    printf("a         = ");
    a.imprimir();
    printf("b         = ");
    b.imprimir();
    printf("d         = ");
    d.imprimir();
    printf("a + b     = ");
    c.imprimir();
    printf("b * d     = ");
    e.imprimir();
    printf("a * (b*d) = ");
    f.imprimir();
    printf("a sigue en ");
    a.imprimir();
    return 0;
}
