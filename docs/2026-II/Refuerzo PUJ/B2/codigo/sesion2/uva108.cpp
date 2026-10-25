// UVa 108 - Maximum Sum
#include <cstdio>
#include <vector>

using namespace std;

int mejor_tramo(const vector<int> &v) {
  int mejor = v[0];
  int suma = 0;
  for (int c = 0; c < (int)v.size(); c++) {
    suma = suma + v[c];
    if (suma > mejor) {
      mejor = suma;
    }
    if (suma < 0) {
      suma = 0;
    }
  }
  return mejor;
}

int mayor_rectangulo(const vector<vector<int>> &m) {
  int n = m.size();
  int mejor = m[0][0];
  for (int arriba = 0; arriba < n; arriba++) {
    vector<int> col(n, 0);
    for (int abajo = arriba; abajo < n; abajo++) {
      for (int c = 0; c < n; c++) {
        col[c] = col[c] + m[abajo][c];
      }
      int s = mejor_tramo(col);
      if (s > mejor) {
        mejor = s;
      }
    }
  }
  return mejor;
}

int main() {
  int n;
  scanf("%d", &n);
  vector<vector<int>> m(n, vector<int>(n));
  for (int i = 0; i < n; i++) {
    for (int j = 0; j < n; j++) {
      scanf("%d", &m[i][j]);
    }
  }
  printf("%d\n", mayor_rectangulo(m));
  return 0;
}
