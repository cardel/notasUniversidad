#include <cstdio>
#include <map>
#include <queue>
#include <vector>

using namespace std;

int indiceDe(map<int, int> &indice, vector<vector<int> > &adj, int nodo) {
  // El indice del nodo; si es la primera vez que aparece, se le asigna uno.
  if (indice.count(nodo) == 0) {
    int nuevo = (int)indice.size();
    indice[nodo] = nuevo;
    adj.push_back(vector<int>());
  }
  return indice[nodo];
}

int bfs(const vector<vector<int> > &adj, int inicio, int ttl) {
  // Cuantos nodos quedan a distancia menor o igual a ttl desde inicio.
  vector<int> dist(adj.size(), -1);
  queue<int> cola;
  dist[inicio] = 0;
  cola.push(inicio);
  int alcanzados = 1;
  while (!cola.empty()) {
    int u = cola.front();
    cola.pop();
    if (dist[u] < ttl) {
      for (size_t i = 0; i < adj[u].size(); i++) {
        int v = adj[u][i];
        if (dist[v] == -1) {
          dist[v] = dist[u] + 1;
          alcanzados = alcanzados + 1;
          cola.push(v);
        }
      }
    }
  }
  return alcanzados;
}

int main() {
  int conexiones;
  int caso = 0;
  while (scanf("%d", &conexiones) == 1 && conexiones != 0) {
    map<int, int> indice;
    vector<vector<int> > adj;
    for (int i = 0; i < conexiones; i++) {
      int a, b;
      scanf("%d %d", &a, &b);
      int ia = indiceDe(indice, adj, a);
      int ib = indiceDe(indice, adj, b);
      adj[ia].push_back(ib);
      adj[ib].push_back(ia);
    }
    int nodo, ttl;
    while (scanf("%d %d", &nodo, &ttl) == 2 && (nodo != 0 || ttl != 0)) {
      caso = caso + 1;
      int alcanzados = 0;
      if (indice.count(nodo) > 0) {
        alcanzados = bfs(adj, indice[nodo], ttl);
      }
      printf("Case %d: %d nodes not reachable from node %d with TTL = %d.\n",
             caso, (int)adj.size() - alcanzados, nodo, ttl);
    }
  }
  return 0;
}
