/*
Implementacion Algoritmo Bellman-Ford para SSSP
Autor: Carlos Ramirez
Fecha: Marzo 29 de 2025


Se almacenan los resultados de cada iteración en un vector que se va actualizando. La operación bellmanFord produce true si no se encontraron ciclos negativos y false en caso contrario.

*/

#include <climits>
#include <vector>
#include <iostream>

using namespace std;

int n;
vector<vector<pair<int, int> > > G(500);
vector<int> p(500);
vector<int> d(500);

bool bellmanFord(int s){
  int i, j, u, v, peso;
  bool ans = true;

  for(i = 0; i < n; ++i){
    p[i] = -1;
    d[i] = INT_MAX;
  }

  d[s] = 0;
  for(i = 1; i <= n - 1; ++i){
    for(u = 0; u < n; u++){
      for(j = 0; j < G[u].size(); ++j){
	v = G[u][j].first;
	peso = G[u][j].second;
	if(d[u] != INT_MAX && d[u] + peso < d[v]){
	  d[v] = d[u] + peso;
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
      if(d[u] != INT_MAX && d[u] + peso < d[v])
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
      cout << "Distancia a nodo " << i << ": " << d[i] << endl;

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

