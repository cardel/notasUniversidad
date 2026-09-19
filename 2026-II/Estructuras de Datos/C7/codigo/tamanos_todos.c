/* Cuantos bytes ocupa cada tipo en esta maquina */
#include <stdio.h>

int main(void) {
    printf("char:      %zu\n", sizeof(char));
    printf("int:       %zu\n", sizeof(int));
    printf("long:      %zu\n", sizeof(long));
    printf("long long: %zu\n", sizeof(long long));
    printf("float:     %zu\n", sizeof(float));
    printf("double:    %zu\n", sizeof(double));
    printf("int *:     %zu\n", sizeof(int *));
    printf("double *:  %zu\n", sizeof(double *));
    return 0;
}
