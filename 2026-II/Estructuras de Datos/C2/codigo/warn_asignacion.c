/* La condicion asigna en vez de comparar: compila, pero miente */
#include <stdio.h>

int main(void) {
    int x;

    x = 0;
    if (x = 5) {
        printf("entro al if aunque x valia 0\n");
    }
    return 0;
}
