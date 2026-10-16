#include <cstdio>

char campo[105][105];

int contar(int n, int m, int f, int c) {
    int total = 0;
    for (int df = -1; df <= 1; df++) {
        for (int dc = -1; dc <= 1; dc++) {
            int g = f + df;
            int h = c + dc;
            if ((df != 0 || dc != 0) && g >= 0 && g < n && h >= 0 && h < m) {
                if (campo[g][h] == '*') {
                    total = total + 1;
                }
            }
        }
    }
    return total;
}

int main() {
    int n, m;
    int numero = 0;
    scanf("%d %d", &n, &m);
    while (n != 0 || m != 0) {
        for (int f = 0; f < n; f++) {
            scanf("%s", campo[f]);
        }
        numero = numero + 1;
        if (numero > 1) {
            printf("\n");
        }
        printf("Field #%d:\n", numero);
        for (int f = 0; f < n; f++) {
            for (int c = 0; c < m; c++) {
                if (campo[f][c] == '*') {
                    printf("*");
                } else {
                    printf("%d", contar(n, m, f, c));
                }
            }
            printf("\n");
        }
        scanf("%d %d", &n, &m);
    }
    return 0;
}
