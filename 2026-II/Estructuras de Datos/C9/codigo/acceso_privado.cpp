#include <cstdio>

class Estudiante {
private:
    int codigo;
    double notas[3];
    int registradas;

public:
    Estudiante(int c) {
        codigo = c;
        registradas = 0;
    }
};

int main() {
    Estudiante e(1023);

    e.notas[0] = 5.0;
    return 0;
}
