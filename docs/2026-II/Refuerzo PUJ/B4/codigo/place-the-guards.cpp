#include <cstdio>
#include <vector>
using namespace std;

bool pintar(const vector<vector<int> > &adj, vector<int> &color,
            int u, int c, vector<int> &cuenta) {
  // Pinta u con c, cuenta cuántos quedan de cada color y avisa si hubo choque.
  color[u] = c;
  cuenta[c] = cuenta[c] + 1;
  bool sin_choque = true;
  for (size_t i = 0; i < adj[u].size(); i++) {
    int v = adj[u][i];
    if (color[v] == -1) {
      if (!pintar(adj, color, v, 1 - c, cuenta)) {
        sin_choque = false;
      }
    } else if (color[v] == c) {
      sin_choque = false;
    }
  }
  return sin_choque;
}

int guardias(const vector<vector<int> > &adj) {
  // Suma, pedazo por pedazo, el color menos usado; -1 si un pedazo choca.
  vector<int> color(adj.size(), -1);
  int total = 0;
  bool posible = true;
  for (size_t u = 0; u < adj.size(); u++) {
    if (color[u] == -1) {
      vector<int> cuenta(2, 0);
      if (!pintar(adj, color, u, 0, cuenta)) {
        posible = false;
      } else if (cuenta[1] == 0) {
        total = total + 1;
      } else if (cuenta[0] < cuenta[1]) {
        total = total + cuenta[0];
      } else {
        total = total + cuenta[1];
      }
    }
  }
  int respuesta = -1;
  if (posible) {
    respuesta = total;
  }
  return respuesta;
}

int main() {
  int casos;
  scanf("%d", &casos);
  for (int caso = 1; caso <= casos; caso++) {
    int v, e;
    scanf("%d %d", &v, &e);
    vector<vector<int> > adj(v);
    for (int i = 0; i < e; i++) {
      int f, t;
      scanf("%d %d", &f, &t);
      adj[f].push_back(t);
      adj[t].push_back(f);
    }
    printf("%d\n", guardias(adj));
  }
  return 0;
}
