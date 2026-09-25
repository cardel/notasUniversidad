#include "natural.h"
#include <cassert>
#include <cstdio>

/* Invariante de representacion: 0 <= digitos[i] <= 9 para todo i */
Natural::Natural() {
    int i = 0;

    while (i < TAM) {
        this->digitos[i] = 0;
        i = i + 1;
    }
}

bool Natural::esCero() {
    bool cero = true;
    int i = 0;

    while (i < TAM) {
        cero = cero && (this->digitos[i] == 0);
        i = i + 1;
    }
    return cero;
}

/* Suma uno al digito menos significativo y propaga el acarreo */
void Natural::sucesor() {
    int pos = 0;

    while (pos < TAM && this->digitos[pos] == 9) {
        this->digitos[pos] = 0;
        pos = pos + 1;
    }
    if (pos < TAM) {
        this->digitos[pos] = this->digitos[pos] + 1;
    }
}

/* Precondicion: el numero no es cero. Pide prestado hacia la izquierda */
void Natural::predecesor() {
    int pos = 0;

    assert(!this->esCero());
    while (pos < TAM && this->digitos[pos] == 0) {
        this->digitos[pos] = 9;
        pos = pos + 1;
    }
    if (pos < TAM) {
        this->digitos[pos] = this->digitos[pos] - 1;
    }
}

void Natural::imprimir() {
    int i = TAM - 1;

    while (i >= 0) {
        printf("%d", this->digitos[i]);
        i = i - 1;
    }
    printf("\n");
}
