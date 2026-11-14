#include <cstdio>
#include <queue>
#include <vector>
using namespace std;

vector<int> grados_de_entrada(const vector<vector<int> > &adj) {
  // Cuantas aristas llegan a cada nodo.
  vector<int> grado(adj.size(), 0);
  for (size_t u = 0; u < adj.size(); u++) {
    for (size_t i = 0; i < adj[u].size(); i++) {
      grado[adj[u][i]] = grado[adj[u][i]] + 1;
    }
  }
  return grado;
}

vector<int> sin_salir(const vector<bool> &salio) {
  // Los nodos que la cola nunca entrego.
  vector<int> quedan;
  for (size_t u = 0; u < salio.size(); u++) {
    if (!salio[u]) {
      quedan.push_back(u);
    }
  }
  return quedan;
}

queue<int> cola_de_ceros(const vector<int> &grado) {
  // Los que no tienen aristas que les lleguen.
  queue<int> cola;
  for (size_t u = 0; u < grado.size(); u++) {
    if (grado[u] == 0) {
      cola.push(u);
    }
  }
  return cola;
}

bool tiene_ciclo_kahn(const vector<vector<int> > &adj,
                      vector<int> &quedan) {
  // Devuelve si hay ciclo; en quedan, los que nunca salen.
  vector<int> grado = grados_de_entrada(adj);
  queue<int> cola = cola_de_ceros(grado);
  vector<bool> salio(adj.size(), false);
  while (!cola.empty()) {
    int u = cola.front();
    cola.pop();
    salio[u] = true;
    for (size_t i = 0; i < adj[u].size(); i++) {
      int v = adj[u][i];
      grado[v] = grado[v] - 1;
      if (grado[v] == 0) {
        cola.push(v);
      }
    }
  }
  quedan = sin_salir(salio);
  return !quedan.empty();
}

#ifndef SIN_MAIN
int main() {
  vector<vector<int> > g1 = {{1, 2}, {2}, {0}, {1, 4}, {}};
  vector<vector<int> > sin_2_0 = {{1, 2}, {2}, {}, {1, 4}, {}};
  vector<int> quedan;
  printf("%d", tiene_ciclo_kahn(g1, quedan) ? 1 : 0);
  for (size_t i = 0; i < quedan.size(); i++) {
    printf(" %d", quedan[i]);
  }
  printf("\n%d\n", tiene_ciclo_kahn(sin_2_0, quedan) ? 1 : 0);
  return 0;
}
#endif
