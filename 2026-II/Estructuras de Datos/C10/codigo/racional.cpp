#include "racional.h"
#include <cassert>
#include <cstdio>

/* Precondicion: q > 0. El signo lo carga el numerador */
Racional::Racional(int p, int q) {
    assert(q > 0);
    this->num = p;
    this->den = q;
    this->simplificar();
}

/* Algoritmo de Euclides: el ultimo residuo antes del cero */
int Racional::mcd(int a, int b) {
    int resultado = a;

    if (b != 0) {
        resultado = this->mcd(b, a % b);
    }
    return resultado;
}

/* Establece el invariante: den > 0 y mcd(|num|, den) = 1 */
void Racional::simplificar() {
    int magnitud = this->num;
    int divisor = 0;

    if (magnitud < 0) {
        magnitud = -magnitud;
    }
    divisor = this->mcd(magnitud, this->den);
    this->num = this->num / divisor;
    this->den = this->den / divisor;
}

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

/* Productos cruzados: a/b = c/d si y solo si a*d = b*c */
bool Racional::igual(Racional r) {
    return this->num * r.denominador() == this->den * r.numerador();
}
