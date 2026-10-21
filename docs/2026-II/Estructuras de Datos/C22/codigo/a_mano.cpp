// Ejercicio a mano: que queda en el map despues de estas lineas.
#include <cstdio>
#include <map>
using std::map;

int main() {
  map<int, int> m;
  m[40] = 3;
  m[15] = 8;
  m[72] = 1;
  m[15] = m[15] - 8;
  m.erase(72);
  m.erase(99);
  if (m[60] == 0) {
    m[33] = 2;
  }
  map<int, int>::iterator it = m.begin();
  while (it != m.end()) {
    printf(" (%d, %d)", it->first, it->second);
    ++it;
  }
  printf("\nsize = %d\n", (int) m.size());
  return 0;
}
