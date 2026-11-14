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

struct Recorrido {
  vector<Arista> aristas;
  vector<int> d;
  vector<int> f;
};

string tipo_de(const vector<int> &color, const vector<int> &d,
               int u, int v) {
  // La regla: el estado de v y, si es negro, los tiempos.
  string tipo = "cruzada";
  if (color[v] == BLANCO) {
    tipo = "arbol";
  } else if (color[v] == GRIS) {
    tipo = "retroceso";
  } else if (d[u] < d[v]) {
    tipo = "avance";
  }
  return tipo;
}

void visitar(const vector<vector<int> > &adj, int u,
             vector<int> &color, int &reloj, Recorrido &r) {
  // Recorre desde u y anota el tipo de cada arista que mira.
  color[u] = GRIS;
  reloj = reloj + 1;
  r.d[u] = reloj;
  for (size_t i = 0; i < adj[u].size(); i++) {
    int v = adj[u][i];
    Arista a = {u, v, tipo_de(color, r.d, u, v)};
    r.aristas.push_back(a);
    if (color[v] == BLANCO) {
      visitar(adj, v, color, reloj, r);
    }
  }
  color[u] = NEGRO;
  reloj = reloj + 1;
  r.f[u] = reloj;
}

Recorrido clasificar(const vector<vector<int> > &adj) {
  // Un arranque por cada nodo que siga en blanco.
  int n = adj.size();
  vector<int> color(n, BLANCO);
  Recorrido r;
  r.d.assign(n, 0);
  r.f.assign(n, 0);
  int reloj = 0;
  for (int u = 0; u < n; u++) {
    if (color[u] == BLANCO) {
      visitar(adj, u, color, reloj, r);
    }
  }
  return r;
}

#ifndef SIN_MAIN
int main() {
  vector<vector<int> > g1 = {{1, 2}, {2}, {0}, {1, 4}, {}};
  Recorrido r = clasificar(g1);
  for (size_t i = 0; i < r.aristas.size(); i++) {
    printf("%d -> %d %s\n", r.aristas[i].u, r.aristas[i].v,
           r.aristas[i].tipo.c_str());
  }
  for (size_t u = 0; u < g1.size(); u++) {
    printf("%zu: d=%d f=%d\n", u, r.d[u], r.f[u]);
  }
  return 0;
}
#endif
