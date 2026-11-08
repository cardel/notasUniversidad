// UVa 11516 - WiFi: solo la lectura, con scanf
// Imprime cada caso que lee: las antenas y las casas, ya ordenadas.
#include <algorithm>
#include <cstdio>
#include <vector>

using namespace std;

int main() {
  int casos;
  scanf("%d", &casos);
  for (int caso = 1; caso <= casos; caso++) {
    int n, m;
    scanf("%d %d", &n, &m);
    vector<int> casas(m);
    for (int i = 0; i < m; i++) {
      scanf("%d", &casas[i]);
    }
    sort(casas.begin(), casas.end());
    printf("caso %d: %d antenas, %d casas\n", caso, n, m);
    printf("    casas:");
    for (int i = 0; i < m; i++) {
      printf(" %d", casas[i]);
    }
    printf("\n");
    // aquí va la bisección sobre el ancho
  }
  return 0;
}
