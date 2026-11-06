#include <cstdio>
#include <vector>

using namespace std;

bool alcanza(const vector<int> &c, int m, int t) {
  // Con capacidad t, bastan m contenedores?
  int usados = 1;
  int lleno = 0;
  for (size_t i = 0; i < c.size(); i++) {
    if (lleno + c[i] > t) {
      usados = usados + 1;
      lleno = c[i];
    } else {
      lleno = lleno + c[i];
    }
  }
  return usados <= m;
}

int menorCapacidad(const vector<int> &c, int m) {
  // El menor t en [max(c), suma(c)] que cumple alcanza(c, m, t).
  int lo = 0;
  int hi = 0;
  for (size_t i = 0; i < c.size(); i++) {
    if (c[i] > lo) {
      lo = c[i];
    }
    hi = hi + c[i];
  }
  while (lo < hi) {
    int medio = lo + (hi - lo) / 2;
    if (alcanza(c, m, medio)) {
      hi = medio;
    } else {
      lo = medio + 1;
    }
  }
  return lo;
}

int main() {
  int n, m;
  while (scanf("%d %d", &n, &m) == 2) {
    vector<int> c(n);
    for (int i = 0; i < n; i++) {
      scanf("%d", &c[i]);
    }
    printf("%d\n", menorCapacidad(c, m));
  }
  return 0;
}
