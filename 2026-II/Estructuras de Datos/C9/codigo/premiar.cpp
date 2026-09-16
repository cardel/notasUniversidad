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
};

/* Recibe una copia del estudiante */
void premiar_copia(Estudiante e) {
    e.registrar_nota(5.0);
}

/* Recibe el estudiante mismo */
void premiar(Estudiante &e) {
    e.registrar_nota(5.0);
}

int main() {
    Estudiante e(1023);

    e.registrar_nota(4.0);
    e.registrar_nota(3.0);
    printf("promedio: %.2f\n", e.promedio());
    premiar_copia(e);
    printf("tras premiar_copia: %.2f\n", e.promedio());
    premiar(e);
    printf("tras premiar: %.2f\n", e.promedio());
    return 0;
}
