// accumulate suma un rango; el tipo de la suma es el del valor inicial.
#include <cstdio>
#include <vector>
#include <numeric>
using std::vector;
using std::accumulate;

int main() {
  vector<int> v(3, 1000000000);                   // tres veces 10^9
  int chico = accumulate(v.begin(), v.end(), 0);
  long long grande = accumulate(v.begin(), v.end(), 0LL);
  printf("con 0:   %d\n", chico);
  printf("con 0LL: %lld\n", grande);
  return 0;
}
