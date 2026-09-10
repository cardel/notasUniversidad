/* Otra implementacion de la MISMA interfaz de racional.h:
   guarda la fraccion tal como llega, sin simplificar.
   Cumple las ecuaciones y se enlaza con el mismo main */
#include "racional.h"
#include <cassert>
#include <cstdio>

Racional::Racional(int p, int q) {
    assert(q > 0);
    this->num = p;
    this->den = q;
}

int Racional::mcd(int a, int b) {
    int resultado = a;

    if (b != 0) {
        resultado = this->mcd(b, a % b);
    }
    return resultado;
}

/* Esta representacion no promete forma minima */
void Racional::simplificar() {}

int Racional::numerador() { return this->num; }

int Racional::denominador() { return this->den; }

void Racional::imprimir() { printf("%d/%d\n", this->num, this->den); }

Racional Racional::sumar(Racional r) {
    int p = this->num * r.denominador() + this->den * r.numerador();
    int q = this->den * r.denominador();

    return Racional(p, q);
}

Racional Racional::multiplicar(Racional r) {
    int p = this->num * r.numerador();
    int q = this->den * r.denominador();

    return Racional(p, q);
}

bool Racional::igual(Racional r) {
    return this->num * r.denominador() == this->den * r.numerador();
}
