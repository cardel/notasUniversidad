// UVa 12100 - Printer Queue
#include <cstdio>
#include <queue>
#include <utility>
#include <vector>

using namespace std;

bool hayMayorPrioridad(const vector<int>& cuenta, int p) {
    bool hay = false;
    for (int q = p + 1; q < 10; q++) {
        if (cuenta[q] > 0) {
            hay = true;
        }
    }
    return hay;
}

// cola de pares (prioridad, es_mio); cuenta[p] dice cuántos trabajos
// de prioridad p siguen en la cola
int minutosHastaImprimir(const vector<int>& prioridades, int m) {
    queue<pair<int, bool> > cola;
    vector<int> cuenta(10, 0);
    for (int i = 0; i < (int) prioridades.size(); i++) {
        cola.push(make_pair(prioridades[i], i == m));
        cuenta[prioridades[i]] = cuenta[prioridades[i]] + 1;
    }
    int minutos = 0;
    bool impreso = false;
    while (!impreso) {
        pair<int, bool> trabajo = cola.front();
        cola.pop();
        if (hayMayorPrioridad(cuenta, trabajo.first)) {
            cola.push(trabajo);
        } else {
            cuenta[trabajo.first] = cuenta[trabajo.first] - 1;
            minutos = minutos + 1;
            impreso = trabajo.second;
        }
    }
    return minutos;
}

int main() {
    int casos;
    scanf("%d", &casos);
    for (int c = 0; c < casos; c++) {
        int n, m;
        scanf("%d %d", &n, &m);
        vector<int> prioridades(n);
        for (int i = 0; i < n; i++) {
            scanf("%d", &prioridades[i]);
        }
        printf("%d\n", minutosHastaImprimir(prioridades, m));
    }
    return 0;
}
