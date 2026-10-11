// UVa 12207 - That is Your Queue: solo cuentan los primeros min(P, C). O(C min(P, C)) por caso.
#include <cstdio>
#include <deque>
using std::deque;

int main() {
  int p, c;
  int caso = 1;
  scanf("%d %d", &p, &c);
  while (p != 0 || c != 0) {
    deque<int> fila;
    int i = 1;
    while (i <= p && i <= c) {
      fila.push_back(i);
      i = i + 1;
    }
    printf("Case %d:\n", caso);
    int k = 0;
    while (k < c) {
      char orden[4];
      scanf("%s", orden);
      if (orden[0] == 'N') {
        int x = fila.front();
        printf("%d\n", x);
        fila.pop_front();
        fila.push_back(x);
      } else {
        int x;
        scanf("%d", &x);
        // si x ya esta en la fila, sale de su puesto antes de pasar al frente
        deque<int>::iterator it = fila.begin();
        while (it != fila.end() && *it != x) {
          ++it;
        }
        if (it != fila.end()) {
          fila.erase(it);
        }
        fila.push_front(x);
      }
      k = k + 1;
    }
    caso = caso + 1;
    scanf("%d %d", &p, &c);
  }
  return 0;
}
