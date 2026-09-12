#include <cstdio>

class Rectangulo {
private:
    int base;
    int altura;

public:
    Rectangulo(int b, int a) {
        base = b;
        altura = a;
    }

    int area() {
        return base * altura;
    }

    int perimetro() {
        return 2 * (base + altura);
    }

    void escalar(int factor) {
        base = base * factor;
        altura = altura * factor;
    }
};

int main() {
    Rectangulo r(3, 4);

    printf("area %d perimetro %d\n", r.area(), r.perimetro());
    r.escalar(2);
    printf("area %d perimetro %d\n", r.area(), r.perimetro());
    return 0;
}
