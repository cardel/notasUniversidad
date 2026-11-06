#include <cstdio>
#include <vector>

using namespace std;

bool alcanza(const vector<int> &saltos, int k) {
  // Con fuerza inicial k, se llega al ultimo peldano?
  int fuerza = k;
  bool puede = true;
  for (size_t i = 0; i < saltos.size(); i++) {
    if (saltos[i] > fuerza) {
      puede = false;
    } else if (saltos[i] == fuerza) {
      fuerza = fuerza - 1;
    }
  }
  return puede;
}

int minimaFuerza(const vector<int> &saltos) {
  // El menor k que cumple alcanza(saltos, k).
  int lo = 0;
  for (size_t i = 0; i < saltos.size(); i++) {
    if (saltos[i] > lo) {
      lo = saltos[i];
    }
  }
  int hi = lo + (int)saltos.size();
  while (lo < hi) {
    int medio = lo + (hi - lo) / 2;
    if (alcanza(saltos, medio)) {
      hi = medio;
    } else {
      lo = medio + 1;
    }
  }
  return lo;
}

int main() {
  int casos;
  scanf("%d", &casos);
  for (int caso = 1; caso <= casos; caso++) {
    int n;
    scanf("%d", &n);
    vector<int> alturas(n);
    for (int i = 0; i < n; i++) {
      scanf("%d", &alturas[i]);
    }
    vector<int> saltos;
    saltos.push_back(alturas[0]);
    for (int i = 1; i < n; i++) {
      saltos.push_back(alturas[i] - alturas[i - 1]);
    }
    printf("Case %d: %d\n", caso, minimaFuerza(saltos));
  }
  return 0;
}
