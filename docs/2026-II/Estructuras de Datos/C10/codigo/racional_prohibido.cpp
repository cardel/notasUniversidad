#include "racional.h"
#include <cstdio>

int main() {
    Racional bueno = Racional(2, 3);

    printf("antes del racional prohibido: ");
    bueno.imprimir();

    Racional prohibido = Racional(10, 0);
    prohibido.imprimir();
    return 0;
}
