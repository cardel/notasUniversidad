/* Cada variable tiene un valor y una direccion */
#include <stdio.h>

int main(void) {
    int x = 42;
    int y = 7;
    int A[3] = {10, 20, 30};
    int i;

    printf("x vale %d y vive en %p\n", x, (void *) &x);
    printf("y vale %d y vive en %p\n", y, (void *) &y);

    i = 0;
    while (i < 3) {
        printf("A[%d] vale %d y vive en %p\n",
               i, A[i], (void *) &A[i]);
        i = i + 1;
    }
    return 0;
}
