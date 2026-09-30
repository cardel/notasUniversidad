/* El problema que motiva un tipo para las fracciones */
#include <cstdio>

int main() {
    double tercio = 1.0 / 3.0;
    double suma = 0.1 + 0.2;

    printf("1.0/3.0     = %.20f\n", tercio);
    printf("tercio * 3  = %.20f\n", tercio * 3.0);
    printf("0.1 + 0.2   = %.20f\n", suma);
    printf("0.3         = %.20f\n", 0.3);
    printf("0.1 + 0.2 == 0.3: %d\n", suma == 0.3);
    return 0;
}
