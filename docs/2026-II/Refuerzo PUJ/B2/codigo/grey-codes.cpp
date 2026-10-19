// UVa 11173 - Grey Codes
#include <cstdio>

// código que ocupa la posición k del rango [ini, fin) de posiciones
long long gris(long long ini, long long fin, long long k) {
    long long codigo;
    if (fin - ini == 1) {
        codigo = 0;
    } else {
        long long mitad = (ini + fin) / 2;
        if (k < mitad) {
            // mitad de arriba: bit 0, mismo orden
            codigo = gris(ini, mitad, k);
        } else {
            // mitad de abajo: bit 1, la de arriba reflejada
            codigo = (mitad - ini) + gris(ini, mitad, ini + fin - 1 - k);
        }
    }
    return codigo;
}

int main() {
    int casos;
    scanf("%d", &casos);
    for (int c = 0; c < casos; c++) {
        int n;
        long long k;
        scanf("%d %lld", &n, &k);
        long long fin = 1;
        for (int i = 0; i < n; i++) {
            fin = fin * 2;
        }
        printf("%lld\n", gris(0, fin, k));
    }
    return 0;
}
