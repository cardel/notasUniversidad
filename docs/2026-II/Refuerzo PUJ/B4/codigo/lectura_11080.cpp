// UVa 11080 - Place the Guards: solo la lectura, con scanf
#include <cstdio>
#include <vector>
using namespace std;

int main() {
  int casos;
  scanf("%d", &casos);
  for (int caso = 1; caso <= casos; caso++) {
    int v, e;
    scanf("%d %d", &v, &e);
    vector<vector<int> > adj(v);
    for (int i = 0; i < e; i++) {
      int f, t;
      scanf("%d %d", &f, &t);
      adj[f].push_back(t);
      adj[t].push_back(f);
    }
    // aquí va el coloreo de cada pedazo
    printf("caso %d: %d cruces, %d calles\n", caso, v, e);
    for (int u = 0; u < v; u++) {
      printf("    %d:", u);
      for (size_t i = 0; i < adj[u].size(); i++) {
        printf(" %d", adj[u][i]);
      }
      printf("\n");
    }
  }
  return 0;
}
