// UVa 12100 - Printer Queue: solo la lectura, con scanf
// Imprime cada caso que lee: cuántos trabajos hay, cuál es el propio y la
// prioridad de cada uno.
#include <cstdio>
#include <vector>

using namespace std;

int main() {
    int casos;
    scanf("%d", &casos);
    for (int c = 1; c <= casos; c++) {
        int n, m;
        scanf("%d %d", &n, &m);
        vector<int> prioridades(n);
        for (int i = 0; i < n; i++) {
            scanf("%d", &prioridades[i]);
        }
        printf("caso %d: %d trabajos, el propio en la posicion %d\n", c, n, m);
        for (int i = 0; i < n; i++) {
            printf("    posicion %d: prioridad %d\n", i, prioridades[i]);
        }
    }
    return 0;
}
