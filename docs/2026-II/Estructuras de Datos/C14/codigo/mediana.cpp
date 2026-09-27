// La mediana: ordenar y tomar el del medio.
#include <cstdio>
#include <vector>
#include <algorithm>
using std::vector;
using std::sort;

double mediana(vector<int> v) {                   // por valor: se ordena una copia
  sort(v.begin(), v.end());
  int n = (int) v.size();
  double m = 0;
  if (n % 2 == 1) {
    m = v[n / 2];
  } else {
    m = (v[n / 2 - 1] + v[n / 2]) / 2.0;
  }
  return m;
}

int main() {
  vector<int> a = {9, 1, 7, 3, 5};
  vector<int> b = {9, 1, 7, 4};
  printf("mediana de a: %.1f\n", mediana(a));
  printf("mediana de b: %.1f\n", mediana(b));
  printf("a sigue como estaba: %d %d %d %d %d\n", a[0], a[1], a[2], a[3], a[4]);
  return 0;
}
