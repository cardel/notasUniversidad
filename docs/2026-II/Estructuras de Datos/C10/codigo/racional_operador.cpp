/* La misma clase con el operador + y el operador == de C++.
   El area del programador se escribe entonces con la notacion
   de siempre, sin dejar de pasar por la interfaz */
#include <cassert>
#include <cstdio>

class Racional {
private:
    int num;
    int den;

    int mcd(int a, int b) {
        int resultado = a;

        if (b != 0) {
            resultado = this->mcd(b, a % b);
        }
        return resultado;
    }

    void simplificar() {
        int magnitud = this->num;
        int divisor = 0;

        if (magnitud < 0) {
            magnitud = -magnitud;
        }
        divisor = this->mcd(magnitud, this->den);
        this->num = this->num / divisor;
        this->den = this->den / divisor;
    }

public:
    Racional(int p, int q) {
        assert(q > 0);
        this->num = p;
        this->den = q;
        this->simplificar();
    }

    int numerador() { return this->num; }

    int denominador() { return this->den; }

    void imprimir() { printf("%d/%d\n", this->num, this->den); }

    Racional operator+(Racional r) {
        int p = this->num * r.denominador() + this->den * r.numerador();
        int q = this->den * r.denominador();

        return Racional(p, q);
    }

    bool operator==(Racional r) {
        return this->num * r.denominador() == this->den * r.numerador();
    }
};

int main() {
    Racional a = Racional(2, 8);
    Racional b = Racional(15, 50);
    Racional s = a + b;
    Racional once_veinteavos = Racional(11, 20);

    printf("a + b = ");
    s.imprimir();
    printf("a + b == 11/20: %d\n", s == once_veinteavos);
    return 0;
}
