#include <stdio.h>

/* El indice se parte por la mitad en cada vuelta */
int mitades(int n) {
    int i = n;
    int cuenta = 0;
    while (i > 0) {
        cuenta = cuenta + 1;
        i = i / 2;
    }
    return cuenta;
}

int main(void) {
    printf("%d %d %d %d\n", mitades(10), mitades(20),
           mitades(100), mitades(1000));
    return 0;
}
