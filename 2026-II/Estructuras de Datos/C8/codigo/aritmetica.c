/* El nombre del arreglo y la aritmetica de punteros */
#include <stdio.h>

int main(void) {
    int A[4] = {5, 8, 2, 9};
    int i;

    printf("A vale %p\n", (void *) A);
    i = 0;
    while (i < 4) {
        printf("A[%d] = %d   *(A+%d) = %d   A+%d = %p\n",
               i, A[i], i, *(A + i), i, (void *) (A + i));
        i = i + 1;
    }
    return 0;
}
