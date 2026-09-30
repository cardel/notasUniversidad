#include <stdio.h>

/* Decide si todos los valores son positivos; corta al fallar */
int todos_positivos(int datos[], int n) {
    int todos = 1;
    int i = 0;
    while (i < n && todos == 1) {
        if (datos[i] <= 0) {
            todos = 0;
        }
        i = i + 1;
    }
    return todos;
}

int main(void) {
    int a[] = {3, 4, 5};
    int b[] = {3, -1, 5};
    printf("%d %d\n", todos_positivos(a, 3), todos_positivos(b, 3));
    return 0;
}
