/* Cuantos bytes ocupa cada tipo en esta maquina */
#include <stdio.h>

int main(void) {
    printf("char:   %zu byte\n", sizeof(char));
    printf("int:    %zu bytes\n", sizeof(int));
    printf("double: %zu bytes\n", sizeof(double));
    printf("int *:  %zu bytes\n", sizeof(int *));
    return 0;
}
