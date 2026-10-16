#include <cstdio>

int longitud_ciclo(long long n) {
    int cuenta = 1;
    while (n != 1) {
        if (n % 2 == 1) {
            n = 3 * n + 1;
        } else {
            n = n / 2;
        }
        cuenta = cuenta + 1;
    }
    return cuenta;
}

int maximo_ciclo(int a, int b) {
    int mejor = 0;
    for (int k = a; k <= b; k++) {
        int c = longitud_ciclo(k);
        if (c > mejor) {
            mejor = c;
        }
    }
    return mejor;
}

int main() {
    int i, j;
    while (scanf("%d %d", &i, &j) == 2) {
        int m;
        if (i <= j) {
            m = maximo_ciclo(i, j);
        } else {
            m = maximo_ciclo(j, i);
        }
        printf("%d %d %d\n", i, j, m);
    }
    return 0;
}
