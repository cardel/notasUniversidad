/*
Implementacion Algoritmo Bellman-Ford para SSSP
Autor: Carlos Ramirez
Fecha: Marzo 29 de 2025


Se almacenan los resultados de cada iteración en una matriz. Los caminos más cortos al final están en la fila n - 1. La operación bellmanFord produce true si no se encontraron ciclos negativos y false en caso contrario.

*/

#include <climits>
#include <vector>
#include <iostream>

using namespace std;

int n;
vector<vector<pair<int, int> > > G(500);
vector<int> p(500);
vector<vector<int>> d(500, vector<int>(500));

bool bellmanFord(int s){
  int i, j, u, v, peso;
  bool ans = true;

  for(i = 0; i < n; ++i){
    p[i] = -1;
    for(j = 0; j < n; ++j)
      d[i][j] = INT_MAX;
  }

  d[0][s] = 0;
  for(i = 1; i <= n - 1; ++i){
    for(j = 0; j < n; ++j)
	d[i][j] = d[i - 1][j];
    for(u = 0; u < n; u++){
      for(j = 0; j < G[u].size(); ++j){
	v = G[u][j].first;
	peso = G[u][j].second;
	if(d[i - 1][u] != INT_MAX && d[i - 1][u] + peso < d[i][v]){
	  d[i][v] = d[i - 1][u] + peso;
	  p[v] = u;
	}
      }
    }
  }

  u = 0;
  while(ans && u < n){
    i = 0;
    while(ans && i < G[u].size()){
      v = G[u][i].first;
      peso = G[u][i].second;
      if(d[n - 1][u] != INT_MAX && d[n - 1][u] + peso < d[n - 1][v])
	ans = false;
      i += 1;
    }
    u += 1;
  }

  return ans;
}

int main(){
  int m, i, u, v, peso;

  cin >> n >> m;

  for(i = 0; i < m; i++){
    cin >> u >> v >> peso;
    G[u].push_back(make_pair(v, peso));
  }

  if(bellmanFord(0)){
    for(i = 0; i < n; ++i)
      cout << "Distancia a nodo " << i << ": " << d[n - 1][i] << endl;

    for(i = 0; i < n; ++i)
      cout << "Predecesor nodo " << i << ": " << p[i] << endl;
  }
  else
    cout << "El grafo tiene ciclos negativos" << endl;
  
  return 0;
}

/*
5 9
0 1 5
0 4 -1
1 4 -2
1 2 2
2 4 1
2 3 5
3 0 2
3 1 4
4 2 2
*/

