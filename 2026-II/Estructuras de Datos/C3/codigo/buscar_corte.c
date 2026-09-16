#include <stdio.h>

/* El recorrido se interrumpe apenas aparece v. */
int buscar_corte(int datos[], int n, int v) {
    int esta = 0;
    int i = 0;
    while (i < n && esta == 0) {
        if (datos[i] == v) {
            esta = 1;
        }
        i = i + 1;
    }
    return esta;
}

int main() {
    int datos[] = {3, 4, 5, 1, 6};
    int n = 5;

    printf("buscar_corte 3: %d\n", buscar_corte(datos, n, 3));
    printf("buscar_corte 9: %d\n", buscar_corte(datos, n, 9));
    return 0;
}
