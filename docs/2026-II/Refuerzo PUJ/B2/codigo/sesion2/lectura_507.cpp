// UVa 507 - Jill Rides Again: solo la lectura, con scanf
// Imprime cada ruta que lee: cuántas paradas tiene y la bondad de cada
// tramo entre dos paradas consecutivas.
#include <cstdio>
#include <vector>

using namespace std;

int main() {
    int b;
    scanf("%d", &b);
    for (int r = 1; r <= b; r++) {
        int s;
        scanf("%d", &s);
        // s paradas dejan s - 1 tramos; el tramo k va de la parada k + 1
        // a la k + 2, contando las paradas desde 1
        vector<int> v(s - 1);
        for (int k = 0; k < s - 1; k++) {
            scanf("%d", &v[k]);
        }
        printf("ruta %d: %d paradas, %d tramos\n", r, s, s - 1);
        for (int k = 0; k < s - 1; k++) {
            printf("    tramo de la parada %d a la %d: %d\n", k + 1, k + 2, v[k]);
        }
    }
    return 0;
}
