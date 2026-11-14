#include <cstdio>
#include <string>
#include <vector>
using namespace std;

const int BLANCO = 0;
const int GRIS = 1;
const int NEGRO = 2;

struct Arista {
  int u;
  int v;
  string tipo;
};

void visitar_nd(const vector<vector<int> > &adj, int u,
                int padre, vector<int> &color,
                vector<Arista> &aristas) {
  // Como en el dirigido, pero se salta la del padre.
  color[u] = GRIS;
  for (size_t i = 0; i < adj[u].size(); i++) {
    int v = adj[u][i];
    Arista a = {u, v, "repetida"};
    if (v == padre) {
      a.tipo = "padre";
    } else if (color[v] == BLANCO) {
      a.tipo = "arbol";
    } else if (color[v] == GRIS) {
      a.tipo = "retroceso";
    }
    aristas.push_back(a);
    if (v != padre && color[v] == BLANCO) {
      visitar_nd(adj, v, u, color, aristas);
    }
  }
  color[u] = NEGRO;
}

vector<Arista> clasificar_no_dirigido(
    const vector<vector<int> > &adj) {
  // La raiz de cada arranque no tiene padre: se usa -1.
  int n = adj.size();
  vector<int> color(n, BLANCO);
  vector<Arista> aristas;
  for (int u = 0; u < n; u++) {
    if (color[u] == BLANCO) {
      visitar_nd(adj, u, -1, color, aristas);
    }
  }
  return aristas;
}

#ifndef SIN_MAIN
int main() {
  vector<vector<int> > g2 = {{1, 2}, {0, 2, 3}, {0, 1}, {1, 4}, {3}};
  vector<Arista> r = clasificar_no_dirigido(g2);
  for (size_t i = 0; i < r.size(); i++) {
    printf("%d - %d %s\n", r[i].u, r[i].v, r[i].tipo.c_str());
  }
  return 0;
}
#endif
