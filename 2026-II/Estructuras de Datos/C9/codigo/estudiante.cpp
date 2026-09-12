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

    double promedio() {
        double suma = 0;
        int i = 0;

        while (i < registradas) {
            suma = suma + notas[i];
            i = i + 1;
        }
        return suma / registradas;
    }

    int obtener_codigo() {
        return codigo;
    }
};

int main() {
    Estudiante e(1023);

    e.registrar_nota(4.0);
    e.registrar_nota(3.5);
    e.registrar_nota(4.5);
    printf("Estudiante %d: promedio %.2f\n",
           e.obtener_codigo(), e.promedio());
    return 0;
}
