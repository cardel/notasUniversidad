#include <cstdio>
#include <vector>

using namespace std;

const int SIN_VISITAR = 0;
const int EN_CAMINO = 1;
const int TERMINADO = 2;

void dfs(const vector<vector<int> > &adj, vector<int> &color,
         vector<int> &orden, bool &hayCiclo, int u) {
  // Recorre lo que sale de u; una arista a un nodo en camino cierra un ciclo.
  color[u] = EN_CAMINO;
  for (size_t i = 0; i < adj[u].size(); i++) {
    int v = adj[u][i];
    if (color[v] == EN_CAMINO) {
      hayCiclo = true;
    } else if (color[v] == SIN_VISITAR) {
      dfs(adj, color, orden, hayCiclo, v);
    }
  }
  color[u] = TERMINADO;
  orden.push_back(u);
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
    vector<int> orden;
    bool hayCiclo = false;
    for (int u = 1; u <= n; u++) {
      if (color[u] == SIN_VISITAR) {
        dfs(adj, color, orden, hayCiclo, u);
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
