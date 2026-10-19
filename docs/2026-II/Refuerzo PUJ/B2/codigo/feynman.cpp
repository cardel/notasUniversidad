// UVa 12149 - Feynman
#include <cstdio>

// suma de m * m para m de 1 a n: los cuadrados de lado n - m + 1
int cuadrados(int n) {
    return n * (n + 1) * (2 * n + 1) / 6;
}

int main() {
    int n;
    scanf("%d", &n);
    while (n != 0) {
        printf("%d\n", cuadrados(n));
        scanf("%d", &n);
    }
    return 0;
}
