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

bool bipartito(const vector<vector<int> > &adj) {
  // Un recorrido por cada pedazo del grafo.
  vector<int> color(adj.size(), -1);
  bool resultado = true;
  for (size_t u = 0; u < adj.size(); u++) {
    if (color[u] == -1) {
      if (!pintar(adj, color, u, 0)) {
        resultado = false;
      }
    }
  }
  return resultado;
}

int main() {
  vector<vector<int> > par = {{1, 3}, {0, 2}, {1, 3, 4}, {0, 2}, {2}};
  vector<vector<int> > triangulo = {{1, 2}, {0, 2}, {0, 1}};
  vector<vector<int> > pedazos = {{1}, {0}, {3, 4}, {2, 4}, {2, 3}};
  printf("%d\n", bipartito(par) ? 1 : 0);
  printf("%d\n", bipartito(triangulo) ? 1 : 0);
  printf("%d\n", bipartito(pedazos) ? 1 : 0);
  return 0;
}
