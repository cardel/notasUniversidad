/* Recorrer un arreglo caminando un puntero */
#include <stdio.h>

/* Suma los n enteros que empiezan en la direccion inicio */
int suma(int *inicio, int n) {
    int total = 0;
    int *p = inicio;

    while (p < inicio + n) {
        total = total + *p;
        p = p + 1;
    }
    return total;
}

int main(void) {
    int A[5] = {4, 7, 1, 3, 5};

    printf("La suma es %d\n", suma(A, 5));
    return 0;
}
