/*
Implementacion Algoritmo Bellman-Ford para SSSP
Autor: Carlos Ramirez
Fecha: Marzo 29 de 2025

Se almacenan los resultados de cada iteración en un vector que se va actualizando. La operación bellmanFord produce true si no se encontraron ciclos negativos y false en caso contrario. Cuando se encuentra un ciclo se almacena en el vector ciclo los elementos del ciclo negativo encontrado.

*/

#include <climits>
#include <vector>
#include <iostream>

using namespace std;

int n;
vector<vector<pair<int, int> > > adj(500);
vector<int> p(500);
vector<int> d(500);
vector<int> ciclo;

bool bellmanFord(int s){
  int i, j, u, v, peso, t, cur;
  bool ans = true, flag = true;

  for(i = 0; i < n; ++i){
    p[i] = -1;
    d[i] = INT_MAX;
  }

  d[s] = 0;
  i = 0;
  while(i < n){
    t = -1;
    for(v = 0; v < n; v++){
      for(j = 0; j < adj[v].size(); ++j){
	u = adj[v][j].first;
	peso = adj[v][j].second;
	if(d[v] != INT_MAX && d[u] > d[v] + peso){
	  d[u] = d[v] + peso;
	  p[u] = v;
	  t = v;
	}
      }
    }
    ++i;
  }

  if(t != -1){
    for(i = 0; i < n; ++i)
      t = p[t];
    cur = t;
    ciclo = vector<int>();

    while(cur != t || ciclo.size() == 0){
      ciclo.push_back(cur);
      cur = p[cur];
      printf("aqui\n");
    }
    ans = false;
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
  else{
    cout << "El grafo tiene ciclos negativos" << endl;
    cout << "Elementos ciclo negativo:" << endl;
    for(i = 0; i < ciclo.size(); ++i)
      cout << ciclo[i] << endl;
  }
  
  return 0;
}

/*
5 10
0 1 5
0 4 -1
1 4 -4
1 2 2
2 4 1
2 3 5
2 0 -6
3 0 2
3 1 4
4 2 2
*/
