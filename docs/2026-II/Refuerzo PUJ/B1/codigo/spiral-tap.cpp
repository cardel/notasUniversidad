#include <cstdio>

long long anillo(long long p) {
    long long r = 0;
    while ((2 * r + 1) * (2 * r + 1) < p) {
        r = r + 1;
    }
    return r;
}

int main() {
    long long sz, p;
    scanf("%lld %lld", &sz, &p);
    while (sz != 0 || p != 0) {
        long long c = (sz + 1) / 2;
        long long r = anillo(p);
        long long linea, col;
        if (r == 0) {
            linea = c;
            col = c;
        } else {
            long long d = p - (2 * r - 1) * (2 * r - 1) - 1;
            if (d < 2 * r) {
                linea = c + r;
                col = c + r - 1 - d;
            } else if (d < 4 * r) {
                linea = c + r - (d - 2 * r + 1);
                col = c - r;
            } else if (d < 6 * r) {
                linea = c - r;
                col = c - r + (d - 4 * r + 1);
            } else {
                linea = c - r + (d - 6 * r + 1);
                col = c + r;
            }
        }
        printf("Line = %lld, column = %lld.\n", linea, col);
        scanf("%lld %lld", &sz, &p);
    }
    return 0;
}
