// UVa 913 - Joana and the Odd Numbers
#include <cstdio>

long long suma_ultimos(long long n) {
    long long k = (n + 1) / 2;
    long long ultimo = 2 * k * k - 1;
    long long s = 3 * ultimo - 6;
    return s;
}

int main() {
    long long n;
    while (scanf("%lld", &n) == 1) {
        printf("%lld\n", suma_ultimos(n));
    }
    return 0;
}
