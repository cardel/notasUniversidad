/*
UVa 11695 Flight Planning
Autor: Carlos A Delgado S
Fecha: Noviembre 6 de 2026

*/

#include <cstdio>
#include <vector>

using namespace std;

int n, cortadaU, cortadaV;
vector<vector<int>> G;
vector<int> grado, pieza, capa, siguiente;
vector<bool> visto;

bool cortada(int v, int w) {
  return (v == cortadaU && w == cortadaV) || (v == cortadaV && w == cortadaU);
}

/* los vertices del pedazo que contiene a s, sin cruzar el vuelo quitado */
void pedazo(int s) {
  pieza.clear();
  pieza.push_back(s);
  visto[s] = true;
  for (size_t i = 0; i < pieza.size(); i++) {
    int v = pieza[i];
    for (size_t j = 0; j < G[v].size(); j++) {
      int w = G[v][j];
      if (!visto[w] && !cortada(v, w)) {
        visto[w] = true;
        pieza.push_back(w);
      }
    }
  }
}

void grados() {
  for (size_t i = 0; i < pieza.size(); i++) {
    int v = pieza[i];
    grado[v] = 0;
    for (size_t j = 0; j < G[v].size(); j++) {
      if (!cortada(v, G[v][j])) {
        grado[v]++;
      }
    }
  }
}

void capaDeHojas() {
  capa.clear();
  for (size_t i = 0; i < pieza.size(); i++) {
    if (grado[pieza[i]] <= 1) {
      capa.push_back(pieza[i]);
    }
  }
}

void pelarCapa() {
  siguiente.clear();
  for (size_t i = 0; i < capa.size(); i++) {
    int v = capa[i];
    for (size_t j = 0; j < G[v].size(); j++) {
      int u = G[v][j];
      if (!cortada(v, u) && grado[u] > 0) {
        grado[u]--;
        if (grado[u] == 1) {
          siguiente.push_back(u);
        }
      }
    }
    grado[v] = 0;
  }
  capa = siguiente;
}

/* radio, diametro y un centro del pedazo que contiene a s */
void medir(int s, int &radio, int &diametro, int &centro) {
  pedazo(s);
  grados();
  capaDeHojas();
  int vivos = pieza.size(), vueltas = 0;
  while (vivos > 2) {
    vivos = vivos - capa.size();
    pelarCapa();
    vueltas++;
  }
  radio = vueltas;
  diametro = 2 * vueltas;
  if (capa.size() == 2) {
    radio = vueltas + 1;
    diametro = 2 * vueltas + 1;
  }
  centro = capa[0];
  for (size_t i = 0; i < pieza.size(); i++) {
    visto[pieza[i]] = false;
  }
}

int main() {
  int casos;
  scanf("%d", &casos);
  for (int caso = 0; caso < casos; caso++) {
    scanf("%d", &n);
    G.assign(n + 1, vector<int>());
    grado.assign(n + 1, 0);
    visto.assign(n + 1, false);
    vector<int> a(n - 1), b(n - 1);
    for (int i = 0; i < n - 1; i++) {
      scanf("%d %d", &a[i], &b[i]);
      G[a[i]].push_back(b[i]);
      G[b[i]].push_back(a[i]);
    }
    int mejor = -1, quitaU = 0, quitaV = 0, poneU = 0, poneV = 0;
    for (int i = 0; i < n - 1; i++) {
      cortadaU = a[i];
      cortadaV = b[i];
      int r1, d1, c1, r2, d2, c2;
      medir(a[i], r1, d1, c1);
      medir(b[i], r2, d2, c2);
      int nuevo = r1 + r2 + 1;
      if (d1 > nuevo) {
        nuevo = d1;
      }
      if (d2 > nuevo) {
        nuevo = d2;
      }
      if (mejor == -1 || nuevo < mejor) {
        mejor = nuevo;
        quitaU = a[i];
        quitaV = b[i];
        poneU = c1;
        poneV = c2;
      }
    }
    printf("%d\n%d %d\n%d %d\n", mejor, quitaU, quitaV, poneU, poneV);
  }
  return 0;
}
