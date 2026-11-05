// UVa 11286 - Conformity
#include <algorithm>
#include <cstdio>
#include <map>
#include <vector>

using namespace std;

int main() {
    int n = 0;
    scanf("%d", &n);
    while (n != 0) {
        // la clave es el vector de cursos ya ordenado
        map<vector<int>, int> cuenta;
        for (int i = 0; i < n; i++) {
            vector<int> cursos(5);
            for (int j = 0; j < 5; j++) {
                scanf("%d", &cursos[j]);
            }
            sort(cursos.begin(), cursos.end());
            cuenta[cursos] = cuenta[cursos] + 1;
        }
        int mayor = 0;
        int total = 0;
        for (map<vector<int>, int>::iterator it = cuenta.begin(); it != cuenta.end(); it++) {
            if (it->second > mayor) {
                mayor = it->second;
                total = it->second;
            } else if (it->second == mayor) {
                total = total + it->second;
            }
        }
        printf("%d\n", total);
        n = 0;
        scanf("%d", &n);
    }
    return 0;
}
