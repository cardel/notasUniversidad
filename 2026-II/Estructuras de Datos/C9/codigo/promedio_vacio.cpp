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

    double promedio() {
        double suma = 0;
        int i = 0;

        while (i < registradas) {
            suma = suma + notas[i];
            i = i + 1;
        }
        return suma / registradas;
    }
};

int main() {
    Estudiante e(1023);

    printf("promedio sin notas: %.2f\n", e.promedio());
    return 0;
}
