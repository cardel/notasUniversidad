/*
  UVa 11631, Dark roads
  Noviembre 13 de 2026

  Lo que se ahorra es el peso de todas las calles menos el peso del
  arbol de cubrimiento minimo.
*/
#include <cstdio>
#include <vector>
#include <algorithm>
#include <utility>

using namespace std;

vector<int> p, rango;

void makeSet(int x) {
  p[x] = x;
  rango[x] = 0;
}

int findSet(int x) {
  if (p[x] != x) {
    p[x] = findSet(p[x]);
  }
  return p[x];
}

void unir(int x, int y) {
  int rx = findSet(x);
  int ry = findSet(y);
  if (rx != ry) {
    if (rango[rx] < rango[ry]) {
      p[rx] = ry;
    } else if (rango[rx] > rango[ry]) {
      p[ry] = rx;
    } else {
      p[ry] = rx;
      rango[rx] = rango[rx] + 1;
    }
  }
}

int main() {
  int m, n;
  scanf("%d %d", &m, &n);
  while (m != 0) {
    // la pareja (peso, (x, y)) se ordena por peso sin comparador propio
    vector<pair<int, pair<int, int> > > aristas(n);
    long long total = 0;
    for (int i = 0; i < n; i++) {
      int x, y, z;
      scanf("%d %d %d", &x, &y, &z);
      aristas[i] = make_pair(z, make_pair(x, y));
      total = total + z;
    }
    sort(aristas.begin(), aristas.end());
    p.assign(m, 0);
    rango.assign(m, 0);
    for (int v = 0; v < m; v++) {
      makeSet(v);
    }
    long long tendido = 0;
    int puestas = 0;
    int i = 0;
    while (i < n && puestas < m - 1) {
      int z = aristas[i].first;
      int x = aristas[i].second.first;
      int y = aristas[i].second.second;
      if (findSet(x) != findSet(y)) {
        unir(x, y);
        tendido = tendido + z;
        puestas = puestas + 1;
      }
      i = i + 1;
    }
    printf("%lld\n", total - tendido);
    scanf("%d %d", &m, &n);
  }
  return 0;
}
