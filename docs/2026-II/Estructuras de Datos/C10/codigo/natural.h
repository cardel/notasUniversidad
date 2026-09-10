#ifndef NATURAL_H
#define NATURAL_H

class Natural {
private:
    static const int TAM = 10;
    int digitos[TAM];

public:
    Natural();
    bool esCero();
    void sucesor();
    void predecesor();
    void imprimir();
};

#endif
