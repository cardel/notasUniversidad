/*
Implementacion Algoritmo Bellman-Ford para SSSP
Autor: Carlos Ramirez
Fecha: Marzo 29 de 2025

Se almacenan los resultados de cada iteración en un vector que se va actualizando. La operación bellmanFord produce true si no se encontraron ciclos negativos y false en caso contrario.
Esta es la versión más optimizada. Se usa una cola para saber los elementos sobre los cuáles ha ocurrido algún cambio. Para evitar colocar en la cola un nodo que ya está en ella se usa un arreglo enCola de booleanos en el que cualquier nodo que está en la cola está marcado con true. Inicialmente solo se pone en la cola el nodo origen s. Para detectar ciclos negativos se usa un arreglo conteo que cuenta cuántas veces se ha puesto un elemento en la cola. Si un elemento se ha puesto en la cola una cantidad veces mayor a n significa que se pudo mejorar su costo más de n veces lo cuál solo puede ocurrir si hay un ciclo negativo.

*/



#include <climits>
#include <vector>
#include <queue>
#include <iostream>

using namespace std;

int n;
vector<vector<pair<int, int> > > adj(50000);
vector<int> p(50000);
vector<int> d(50000);
vector<bool> enCola(50000);
vector<int> conteo(50000);

bool bellmanFordOpt(int s){
  int i, j, u, v, peso;
  queue<int> cola;
  bool ans = true;
  
  for(i = 0; i < n; ++i){
    p[i] = -1;
    d[i] = INT_MAX;
    enCola[i] = false;
    conteo[i] = 0;
  }

  d[s] = 0;
  cola.push(s);
  enCola[s] = true;
  
  while(ans && !cola.empty()){
    u = cola.front();
    cola.pop();
    enCola[u] = false;

    for(i = 0; i < adj[u].size(); ++i){
      v = adj[u][i].first;
      peso = adj[u][i].second;
      if(d[u] != INT_MAX && d[u] + peso < d[v]){
	d[v] = d[u] + peso;
	p[v] = u;

	if(!enCola[v]){
	  cola.push(v);
	  enCola[v] = true;
	  conteo[v]++;

	  //verifica si encontró un ciclo negativo
	  if(conteo[v] > n)
	    ans = false;
	}
      }
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

  if(bellmanFordOpt(0)){
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
