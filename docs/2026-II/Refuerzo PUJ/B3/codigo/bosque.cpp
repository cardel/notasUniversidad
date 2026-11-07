#include <algorithm>
#include <cstdio>
#include <queue>
#include <string>
#include <utility>
#include <vector>
using namespace std;

vector<vector<bool> > marcar(const vector<string> &tablero,
                             const vector<vector<int> > &tripletas) {
  // Matriz con las casillas por las que no se puede pasar.
  int R = tablero.size();
  int C = tablero[0].size();
  vector<vector<bool> > prohibida(R, vector<bool>(C, false));
  for (int r = 0; r < R; r++) {
    for (int c = 0; c < C; c++) {
      prohibida[r][c] = tablero[r][c] == '#';
    }
  }
  for (size_t i = 0; i < tripletas.size(); i++) {
    int ri = tripletas[i][0], ci = tripletas[i][1], radio = tripletas[i][2];
    for (int r = max(0, ri - radio); r < min(R, ri + radio + 1); r++) {
      for (int c = max(0, ci - radio); c < min(C, ci + radio + 1); c++) {
        if ((r - ri) * (r - ri) + (c - ci) * (c - ci) <= radio * radio) {
          prohibida[r][c] = true;
        }
      }
    }
  }
  return prohibida;
}

void entrar(const vector<vector<bool> > &prohibida, vector<vector<int> > &dist,
            queue<pair<int, int> > &cola, int r, int c, int d) {
  // Mete (r, c) a la cola si existe, se puede pisar y es nueva.
  int R = dist.size();
  int C = dist[0].size();
  if (r >= 0 && r < R && c >= 0 && c < C) {
    if (!prohibida[r][c] && dist[r][c] == -1) {
      dist[r][c] = d;
      cola.push(make_pair(r, c));
    }
  }
}

int bosque(const vector<string> &tablero,
           const vector<vector<int> > &tripletas) {
  // Menor número de pasos de (0, 0) a (R-1, C-1); -1 si no se puede.
  vector<vector<bool> > prohibida = marcar(tablero, tripletas);
  int R = tablero.size();
  int C = tablero[0].size();
  vector<vector<int> > dist(R, vector<int>(C, -1));
  queue<pair<int, int> > cola;
  entrar(prohibida, dist, cola, 0, 0, 0);
  while (!cola.empty()) {
    int r = cola.front().first;
    int c = cola.front().second;
    cola.pop();
    int d = dist[r][c] + 1;
    entrar(prohibida, dist, cola, r - 1, c, d);
    entrar(prohibida, dist, cola, r + 1, c, d);
    entrar(prohibida, dist, cola, r, c - 1, d);
    entrar(prohibida, dist, cola, r, c + 1, d);
  }
  return dist[R - 1][C - 1];
}

int main() {
  vector<string> tablero = {".#.....", "..#.#..", ".......", ".......", "......."};
  printf("%d\n", bosque(tablero, {{4, 0, 2}, {3, 4, 1}}));
  printf("%d\n", bosque(tablero, {{4, 0, 2}, {3, 4, 1}, {1, 6, 1}}));
  printf("%d\n", bosque(tablero, {{4, 6, 0}}));
  return 0;
}
