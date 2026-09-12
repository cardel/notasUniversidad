#include <stdio.h>

void misterio(int a, int *b) {
    a = a + *b;
    *b = *b + 1;
}

int main(void) {
    int u = 3;
    int v = 5;

    misterio(u, &v);
    printf("%d %d\n", u, v);
    return 0;
}
