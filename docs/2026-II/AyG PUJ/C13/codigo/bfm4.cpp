/*
Implementacion Algoritmo Bellman-Ford para SSSP
Autor: Carlos Ramirez
Fecha: Marzo 29 de 2025

Se almacenan los resultados de cada iteración en un vector que se va actualizando. La operación bellmanFord produce true si no se encontraron ciclos negativos y false en caso contrario. En esta versión solo se realiza una iteración si en la iteración anterior se realizó algún cambio.

*/


#include <climits>
#include <vector>
#include <iostream>

using namespace std;

int n;
vector<vector<pair<int, int> > > adj(500);
vector<int> p(500);
vector<int> d(500);

bool bellmanFord(int s){
  int i, j, u, v, peso, t;
  bool ans = true;

  for(i = 0; i < n; ++i){
    p[i] = -1;
    d[i] = INT_MAX;
  }

  d[s] = 0;
  t = 0;
  for(i = 1; i < n && t != -1; ++i){
    t = -1;
    for(v = 0; v < n; v++){
      for(j = 0; j < adj[v].size(); ++j){
	u = adj[v][j].first;
	peso = adj[v][j].second;
	if(d[v] != INT_MAX && d[v] + peso < d[u]){
	  d[u] = d[v] + peso;
	  p[u] = v;
	  t = v;
	}
      }
    }
  }

  printf("Iteraciones realizadas: %d\n", i - 1);

  if(t != -1){
    u = 0;
    while(u < n){
      i = 0;
      while(ans && i < adj[u].size()){
	v = adj[u][i].first;
	peso = adj[u][i].second;
	if(d[u] + peso < d[v])
	  ans = false;
	i += 1;
      }
      u += 1;
    }
  }

  return ans;
}

int main(){
  int m, i, aux1, aux2, peso;

  cin >> n >> m;

  for(i = 0; i < m; i++){
    cin >> aux1 >> aux2 >> peso;
    adj[aux1].push_back(make_pair(aux2, peso));
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
