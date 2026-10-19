#include <cstdio>
#include <cstring>

// 0 mutante, 1 simple, 2 crecido, 3 mutagenico; s[ini..fin] inclusive
int clasificar(const char *s, int ini, int fin) {
    int r = 0;
    int n = fin - ini + 1;
    if (n == 1 && s[ini] == 'A') {
        r = 1;
    } else if (n >= 3 && s[fin - 1] == 'A' && s[fin] == 'B' && clasificar(s, ini, fin - 2) != 0) {
        r = 2;
    } else if (n >= 3 && s[ini] == 'B' && s[fin] == 'A' && clasificar(s, ini + 1, fin - 1) != 0) {
        r = 3;
    }
    return r;
}

int main() {
    const char *nombres[4] = {"MUTANT", "SIMPLE", "FULLY-GROWN", "MUTAGENIC"};
    static char s[1000005];
    int casos;
    if (scanf("%d", &casos) == 1) {
        int t = 0;
        while (t < casos && scanf("%1000000s", s) == 1) {
            printf("%s\n", nombres[clasificar(s, 0, (int)strlen(s) - 1)]);
            t = t + 1;
        }
    }
    return 0;
}
