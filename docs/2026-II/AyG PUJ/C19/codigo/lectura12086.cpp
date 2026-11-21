#include <cstdio>

// UVa 12086, solo la lectura. Tres cosas que cuidar en este formato:
// el caso termina con la palabra END y no con un numero, la accion llega
// como palabra antes de sus dos enteros, y un N de 0 cierra la entrada.

int main() {
    int n;
    while (scanf("%d", &n) == 1 && n != 0) {
        for (int i = 0; i < n; i++) {
            int r;
            scanf("%d", &r);
            // aqui va r a la posicion i del arreglo
        }
        char accion[8];
        scanf("%s", accion);
        while (accion[0] != 'E') {
            int x, y;
            scanf("%d %d", &x, &y);
            if (accion[0] == 'S') {
                // poner la resistencia x en y
            } else {
                // medir de x a y
            }
            scanf("%s", accion);
        }
    }
    return 0;
}
