// deque: entra y sale por los dos extremos y se lee por indice.
#include <cstdio>
#include <deque>
using std::deque;

void imprimir(deque<int> &d) {
  int i = 0;
  while (i < (int) d.size()) {
    printf(" %d", d[i]);
    i = i + 1;
  }
  printf("\n");
}

int main() {
  deque<int> d;
  d.push_back(4);
  d.push_back(7);
  d.push_front(1);
  d.push_front(3);
  imprimir(d);                     // 3 1 4 7
  printf("d[2] = %d\n", d[2]);
  printf("front %d, back %d\n", d.front(), d.back());

  d.pop_front();
  d.pop_back();
  imprimir(d);                     // 1 4
  d.insert(d.begin() + 1, 9);      // corre el lado corto
  imprimir(d);                     // 1 9 4
  printf("size: %d\n", (int) d.size());
  return 0;
}
