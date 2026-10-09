/*
CAPCITY - Capital City
https://www.spoj.com/problems/CAPCITY/

SCC

*/

#include <vector>
#include <stack>
#include <iostream>

using namespace std;

int n, numSCC, t;
vector<vector<int> > adj(100001);
int visitado[100001];
int sccInd[100001];
stack<int> pilaS, pilaP;

void gabowAux(int);

void gabow(){
  int i;

  for(i = 1; i <= n; i++)
    sccInd[i] = visitado[i] = -1;

  for(i = 1; i <= n; i++)
    if(visitado[i] == -1)
      gabowAux(i);
}

void gabowAux(int v){
  int w;
  visitado[v] = ++t;
  pilaS.push(v);
  pilaP.push(v);
  
  for(int i = 0; i < adj[v].size(); i++){
    w = adj[v][i];
    if(visitado[w] == -1)
      gabowAux(w);
    else if(sccInd[w] == -1){
      while(visitado[pilaP.top()] > visitado[w])
	pilaP.pop();
    }
  }

  if(v == pilaP.top()){
    numSCC++;
    while(pilaS.top() != v){
      sccInd[pilaS.top()] = numSCC - 1;
      pilaS.pop();
    }

    sccInd[pilaS.top()] = numSCC - 1;
    pilaS.pop();
    pilaP.pop();
  }
}

int main(){
  int m, i, j, u, v, cnt;
  vector<int> outDeg, ans;

  while(cin >> n >> m){
    cnt = numSCC = t = 0;
    outDeg.clear();
    ans.clear();
    for(i = 0; i <= n; ++i)
      adj[i].clear();
    for(i = 0; i < m; i++){
      cin >> u >> v;
      adj[u].push_back(v);
    }

    gabow();
    outDeg.assign(numSCC, 0);

    for(i = 1; i <= n; ++i){
      for(j = 0; j < adj[i].size(); ++j){
	if(sccInd[i] != sccInd[adj[i][j]])
	  ++outDeg[sccInd[i]];
      }
    }

    for(i = 0; i < numSCC; ++i){
      if(outDeg[i] == 0)
	++cnt;
    }

    if(cnt > 1)
      printf("0\n");
    else{
      for(i = 1; i <= n; ++i){
	if(outDeg[sccInd[i]] == 0)
	  ans.push_back(i);
      }
      printf("%d\n", ans.size());
      for(i = 0; i < ans.size(); ++i)
	printf("%d%c", ans[i], (i == ans.size() - 1) ? '\n' : ' ');
    }
  }
  
  return 0;
}
