#ifndef RACIONAL_H
#define RACIONAL_H

class Racional {
private:
    int num;
    int den;

    int mcd(int a, int b);
    void simplificar();

public:
    Racional(int p, int q);
    int numerador();
    int denominador();
    void imprimir();
    Racional sumar(Racional r);
    Racional multiplicar(Racional r);
    bool igual(Racional r);
};

#endif
