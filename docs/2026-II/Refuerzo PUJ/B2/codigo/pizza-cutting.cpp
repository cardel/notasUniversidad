// UVa 10079 - Pizza Cutting
#include <cstdio>

long long piezas(long long n) {
    long long r = n * (n + 1) / 2 + 1;
    return r;
}

int main() {
    long long n;
    int seguir = 1;
    while (seguir == 1 && scanf("%lld", &n) == 1) {
        if (n < 0) {
            seguir = 0;
        } else {
            printf("%lld\n", piezas(n));
        }
    }
    return 0;
}
