#include <stdio.h>
#include <limits.h>

int main(void) {
    int mayor = INT_MAX;
    unsigned int tope = UINT_MAX;
    int paso = 1;

    printf("INT_MAX       = %d\n", mayor);
    printf("INT_MAX + 1   = %d\n", mayor + paso);
    printf("UINT_MAX      = %u\n", tope);
    printf("UINT_MAX + 1  = %u\n", tope + paso);
    return 0;
}
