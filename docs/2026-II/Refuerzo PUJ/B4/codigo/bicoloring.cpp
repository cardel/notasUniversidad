#include <cstdio>
#include <vector>
using namespace std;

bool pintar(const vector<vector<int> > &adj, vector<int> &color,
            int u, int c) {
  // Pinta u con c y sigue; devuelve si no hubo choque.
  color[u] = c;
  bool sin_choque = true;
  for (size_t i = 0; i < adj[u].size(); i++) {
    int v = adj[u][i];
    if (color[v] == -1) {
      if (!pintar(adj, color, v, 1 - c)) {
        sin_choque = false;
      }
    } else if (color[v] == c) {
      sin_choque = false;
    }
  }
  return sin_choque;
}

int main() {
  int n;
  scanf("%d", &n);
  while (n != 0) {
    int l;
    scanf("%d", &l);
    vector<vector<int> > adj(n);
    for (int i = 0; i < l; i++) {
      int a, b;
      scanf("%d %d", &a, &b);
      adj[a].push_back(b);
      adj[b].push_back(a);
    }
    vector<int> color(n, -1);
    // el grafo es conexo: basta arrancar desde 0
    if (pintar(adj, color, 0, 0)) {
      printf("BICOLORABLE.\n");
    } else {
      printf("NOT BICOLORABLE.\n");
    }
    scanf("%d", &n);
  }
  return 0;
}
