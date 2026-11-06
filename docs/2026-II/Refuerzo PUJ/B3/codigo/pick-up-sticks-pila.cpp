#include <cstdio>
#include <vector>

using namespace std;

const int SIN_VISITAR = 0;
const int EN_CAMINO = 1;
const int TERMINADO = 2;

void dfs(const vector<vector<int> > &adj, vector<int> &color,
         vector<size_t> &siguiente, vector<int> &orden, bool &hayCiclo,
         int inicio) {
  // La pila guarda el camino actual; siguiente[u] es la arista de u que
  // toca revisar, lo que en la recursiva guarda la variable i de cada llamada.
  vector<int> pila;
  color[inicio] = EN_CAMINO;
  pila.push_back(inicio);
  while (!pila.empty()) {
    int u = pila.back();
    if (siguiente[u] < adj[u].size()) {
      int v = adj[u][siguiente[u]];
      siguiente[u] = siguiente[u] + 1;
      if (color[v] == EN_CAMINO) {
        hayCiclo = true;
      } else if (color[v] == SIN_VISITAR) {
        color[v] = EN_CAMINO;
        pila.push_back(v);
      }
    } else {
      color[u] = TERMINADO;
      orden.push_back(u);
      pila.pop_back();
    }
  }
}

int main() {
  int n, m;
  while (scanf("%d %d", &n, &m) == 2 && (n != 0 || m != 0)) {
    vector<vector<int> > adj(n + 1);
    for (int i = 0; i < m; i++) {
      int a, b;
      scanf("%d %d", &a, &b);
      adj[a].push_back(b);
    }
    vector<int> color(n + 1, SIN_VISITAR);
    vector<size_t> siguiente(n + 1, 0);
    vector<int> orden;
    bool hayCiclo = false;
    for (int u = 1; u <= n; u++) {
      if (color[u] == SIN_VISITAR) {
        dfs(adj, color, siguiente, orden, hayCiclo, u);
      }
    }
    if (hayCiclo) {
      printf("IMPOSSIBLE\n");
    } else {
      for (int i = n - 1; i >= 0; i--) {
        printf("%d\n", orden[i]);
      }
    }
  }
  return 0;
}
