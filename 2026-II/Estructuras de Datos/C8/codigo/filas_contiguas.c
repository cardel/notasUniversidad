/* Una matriz se guarda fila tras fila, sin huecos */
#include <stdio.h>

int main(void) {
    int M[3][4];
    int i;
    int j;

    i = 0;
    while (i < 3) {
        j = 0;
        while (j < 4) {
            M[i][j] = 10 * (i + 1) + j;
            j = j + 1;
        }
        i = i + 1;
    }
    printf("M[0][0] vive en %p\n", (void *) &M[0][0]);
    printf("M[0][3] vive en %p\n", (void *) &M[0][3]);
    printf("M[1][0] vive en %p\n", (void *) &M[1][0]);
    printf("M[2][0] vive en %p\n", (void *) &M[2][0]);
    return 0;
}
