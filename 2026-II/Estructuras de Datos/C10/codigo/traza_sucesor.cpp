/* Muestra el acarreo de sucesor y el prestamo de predecesor
   sobre una representacion de cuatro digitos */
#include <cstdio>

const int TAM = 4;

void mostrar(int digitos[], const char *etiqueta) {
    int i = TAM - 1;

    printf("%-22s", etiqueta);
    while (i >= 0) {
        printf("%d", digitos[i]);
        i = i - 1;
    }
    printf("\n");
}

void sucesor(int digitos[]) {
    int pos = 0;

    mostrar(digitos, "  antes");
    while (pos < TAM && digitos[pos] == 9) {
        digitos[pos] = 0;
        pos = pos + 1;
        printf("    acarreo, pos = %d\n", pos);
    }
    if (pos < TAM) {
        digitos[pos] = digitos[pos] + 1;
    }
    mostrar(digitos, "  despues");
}

void predecesor(int digitos[]) {
    int pos = 0;

    mostrar(digitos, "  antes");
    while (pos < TAM && digitos[pos] == 0) {
        digitos[pos] = 9;
        pos = pos + 1;
        printf("    prestamo, pos = %d\n", pos);
    }
    if (pos < TAM) {
        digitos[pos] = digitos[pos] - 1;
    }
    mostrar(digitos, "  despues");
}

int main() {
    int d[TAM] = {9, 9, 1, 0};

    printf("sucesor de 199\n");
    sucesor(d);

    printf("\nsucesor de 200\n");
    sucesor(d);

    int cero_cero_cero_uno[TAM] = {0, 0, 0, 1};
    printf("\npredecesor de 1000\n");
    predecesor(cero_cero_cero_uno);

    int tope[TAM] = {9, 9, 9, 9};
    printf("\nsucesor de 9999, el tope de la representacion\n");
    sucesor(tope);
    return 0;
}
