#include <stdio.h>

int main(void) {
    double a = 0.1;
    double b = 0.2;
    float f = 0.1f + 0.2f;

    printf("0.1 + 0.2 (double) = %.20f\n", a + b);
    printf("0.3       (double) = %.20f\n", 0.3);
    if (a + b == 0.3) {
        printf("La comparacion dice que son iguales\n");
    } else {
        printf("La comparacion dice que son distintos\n");
    }
    printf("0.1 + 0.2 (float)  = %.20f\n", (double) f);
    return 0;
}
