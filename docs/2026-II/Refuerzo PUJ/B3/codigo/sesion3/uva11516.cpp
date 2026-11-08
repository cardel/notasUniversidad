// UVa 11516 - WiFi
#include <algorithm>
#include <cstdio>
#include <vector>

using namespace std;

int antenasNecesarias(const vector<int> &casas, int ancho) {
  // Cuántas antenas hacen falta si cada una cubre un tramo de 'ancho' metros.
  // casas viene ordenado; cada antena se pone para la primera casa sin cubrir.
  int antenas = 1;
  int cubreHasta = casas[0] + ancho;
  for (int i = 0; i < (int)casas.size(); i++) {
    if (casas[i] > cubreHasta) {
      antenas = antenas + 1;
      cubreHasta = casas[i] + ancho;
    }
  }
  return antenas;
}

int menorAncho(const vector<int> &casas, int n) {
  // El menor ancho entero con el que alcanzan n antenas. lo y hi son
  // enteros, así que hi - lo > 0.001 es lo mismo que lo < hi.
  int lo = 0;
  int hi = casas[casas.size() - 1] - casas[0];
  while (lo < hi) {
    int medio = (lo + hi) / 2;
    if (antenasNecesarias(casas, medio) <= n) {
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
  for (int caso = 0; caso < casos; caso++) {
    int n, m;
    scanf("%d %d", &n, &m);
    vector<int> casas(m);
    for (int i = 0; i < m; i++) {
      scanf("%d", &casas[i]);
    }
    sort(casas.begin(), casas.end());
    int ancho = menorAncho(casas, n);
    // la distancia máxima es la mitad del ancho: termina en .0 o en .5
    if (ancho % 2 == 0) {
      printf("%d.0\n", ancho / 2);
    } else {
      printf("%d.5\n", ancho / 2);
    }
  }
  return 0;
}
