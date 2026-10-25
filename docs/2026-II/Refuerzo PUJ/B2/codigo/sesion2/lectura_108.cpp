// UVa 108 - Maximum Sum: solo la lectura, con scanf y printf
// Lee N y los N * N números de la matriz, que llegan por filas pero
// repartidos en las líneas de cualquier forma, y la imprime ordenada.
#include <cstdio>
#include <vector>

using namespace std;

int main() {
    int n;
    scanf("%d", &n);
    vector<vector<int>> m(n, vector<int>(n));
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            scanf("%d", &m[i][j]);
        }
    }
    printf("matriz de %d x %d\n", n, n);
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            printf("%4d", m[i][j]);
        }
        printf("\n");
    }
    return 0;
}
