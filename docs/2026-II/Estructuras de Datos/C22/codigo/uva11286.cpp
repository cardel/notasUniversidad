// UVa 11286 - Conformity: la combinacion ordenada es la clave de un map. O(n log n) por caso.
#include <cstdio>
#include <map>
#include <algorithm>
using std::map;
using std::sort;

// los cinco cursos, ya ordenados, como un numero de 15 cifras: tres por curso
long long clave(int c[]) {
  long long k = 0;
  int j = 0;
  while (j < 5) {
    k = k * 1000 + c[j];
    j = j + 1;
  }
  return k;
}

int main() {
  int n;
  scanf("%d", &n);
  while (n != 0) {
    map<long long, int> veces;
    int i = 0;
    while (i < n) {
      int c[5];
      int j = 0;
      while (j < 5) {
        scanf("%d", &c[j]);
        j = j + 1;
      }
      sort(c, c + 5);
      long long k = clave(c);
      veces[k] = veces[k] + 1;
      i = i + 1;
    }
    int mayor = 0;
    int total = 0;
    map<long long, int>::iterator it = veces.begin();
    while (it != veces.end()) {
      if (it->second > mayor) {
        mayor = it->second;
        total = it->second;
      } else if (it->second == mayor) {
        total = total + it->second;
      }
      ++it;
    }
    printf("%d\n", total);
    scanf("%d", &n);
  }
  return 0;
}
