// Las mismas cuatro claves en map y en unordered_map: en que orden salen.
#include <cstdio>
#include <map>
#include <unordered_map>
using std::map;
using std::unordered_map;

void imprimirMap(map<int, int> &m) {
  printf("map:");
  map<int, int>::iterator it = m.begin();
  while (it != m.end()) {
    printf(" %d", it->first);
    ++it;
  }
  printf("\n");
}

void imprimirHash(unordered_map<int, int> &u) {
  printf("unordered_map:");
  unordered_map<int, int>::iterator it = u.begin();
  while (it != u.end()) {
    printf(" %d", it->first);
    ++it;
  }
  printf("\n");
}

int main() {
  int claves[4] = {305, 112, 87, 450};
  map<int, int> m;
  unordered_map<int, int> u;
  int i = 0;
  while (i < 4) {
    m[claves[i]] = 1;
    u[claves[i]] = 1;
    i = i + 1;
  }
  imprimirMap(m);
  imprimirHash(u);
  return 0;
}
