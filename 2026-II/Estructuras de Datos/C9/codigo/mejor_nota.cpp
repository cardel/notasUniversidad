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

    void registrar_nota(double nota) {
        if (registradas < 3) {
            notas[registradas] = nota;
            registradas = registradas + 1;
        }
    }

    double mejor_nota() {
        double mejor = notas[0];
        int i = 1;

        while (i < registradas) {
            if (notas[i] > mejor) {
                mejor = notas[i];
            }
            i = i + 1;
        }
        return mejor;
    }
};

int main() {
    Estudiante e(1023);

    e.registrar_nota(4.0);
    e.registrar_nota(3.5);
    e.registrar_nota(4.5);
    printf("mejor nota: %.1f\n", e.mejor_nota());
    return 0;
}
