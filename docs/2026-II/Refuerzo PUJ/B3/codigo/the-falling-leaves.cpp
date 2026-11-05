// UVa 699 - The Falling Leaves
#include <cstdio>
#include <map>

using namespace std;

// lee un subárbol cuya raíz está en la columna x y suma sus valores a las
// pilas; ya se sabe que la raíz vale raiz y no es -1
void subarbol(int raiz, int x, map<int, long long>& pilas) {
    pilas[x] = pilas[x] + raiz;
    int izq;
    scanf("%d", &izq);
    if (izq != -1) {
        subarbol(izq, x - 1, pilas);
    }
    int der;
    scanf("%d", &der);
    if (der != -1) {
        subarbol(der, x + 1, pilas);
    }
}

int main() {
    int caso = 1;
    int raiz = -1;
    scanf("%d", &raiz);
    while (raiz != -1) {
        map<int, long long> pilas;
        subarbol(raiz, 0, pilas);
        printf("Case %d:\n", caso);
        bool primera = true;
        for (map<int, long long>::iterator it = pilas.begin(); it != pilas.end(); it++) {
            if (primera) {
                printf("%lld", it->second);
                primera = false;
            } else {
                printf(" %lld", it->second);
            }
        }
        printf("\n\n");
        caso = caso + 1;
        raiz = -1;
        scanf("%d", &raiz);
    }
    return 0;
}
