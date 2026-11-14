#include <cstdio>
#include <vector>
using namespace std;

vector<int> kahn(const vector<vector<int> > &adj, vector<int> &entrada,
                 int n) {
  // entrada[v] trae cuántas aristas llegan a v, contadas al leer.
  // Devuelve las tareas en el orden en que salen de la cola.
  vector<int> cola;
  for (int u = 1; u <= n; u++) {
    if (entrada[u] == 0) {
      cola.push_back(u);
    }
  }
  size_t frente = 0;
  while (frente < cola.size()) {
    int u = cola[frente];
    frente = frente + 1;
    for (size_t i = 0; i < adj[u].size(); i++) {
      int v = adj[u][i];
      entrada[v] = entrada[v] - 1;
      if (entrada[v] == 0) {
        cola.push_back(v);
      }
    }
  }
  return cola;
}

int main() {
  int n, m;
  scanf("%d %d", &n, &m);
  while (n != 0 || m != 0) {
    vector<vector<int> > adj(n + 1);
    vector<int> entrada(n + 1, 0);
    for (int i = 0; i < m; i++) {
      int a, b;
      scanf("%d %d", &a, &b);
      adj[a].push_back(b);
      entrada[b] = entrada[b] + 1;
    }
    vector<int> orden = kahn(adj, entrada, n);
    for (size_t i = 0; i < orden.size(); i++) {
      if (i > 0) {
        printf(" ");
      }
      printf("%d", orden[i]);
    }
    printf("\n");
    scanf("%d %d", &n, &m);
  }
  return 0;
}
