// UVa 12100 - Printer Queue: cola de indices y nueve contadores. O(n^2) por caso.
#include <cstdio>
#include "cola_nodos.h"

const int MAX_TRABAJOS = 100;

int prioridad[MAX_TRABAJOS];  // prioridad[i]: prioridad del trabajo i

// Indica si queda algun trabajo con prioridad estrictamente mayor que p.
bool hayMayor(int cuantos[], int p) {
  bool hay = false;
  int q = p + 1;
  while (q <= 9 && !hay) {
    hay = cuantos[q] > 0;
    q = q + 1;
  }
  return hay;
}

int main() {
  int casos;
  scanf("%d", &casos);
  while (casos > 0) {
    int n;
    int m;
    scanf("%d %d", &n, &m);
    int cuantos[10] = {0};  // cuantos[p]: trabajos de prioridad p en la cola
    Cola trabajos;          // guarda la posicion original de cada trabajo
    int i = 0;
    while (i < n) {
      scanf("%d", &prioridad[i]);
      cuantos[prioridad[i]] = cuantos[prioridad[i]] + 1;
      trabajos.encolar(i);
      i = i + 1;
    }
    int minutos = 0;
    bool impreso = false;
    while (!impreso) {
      int j = trabajos.frente();
      trabajos.desencolar();
      if (hayMayor(cuantos, prioridad[j])) {
        trabajos.encolar(j);
      } else {
        minutos = minutos + 1;
        cuantos[prioridad[j]] = cuantos[prioridad[j]] - 1;
        impreso = j == m;
      }
    }
    printf("%d\n", minutos);
    casos = casos - 1;
  }
  return 0;
}
