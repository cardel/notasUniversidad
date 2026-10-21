// Preguntar con [] tambien inserta: la forma correcta es count o find.
#include <cstdio>
#include <map>
using std::map;

int main() {
  map<int, int> inv;
  inv[305] = 5;
  inv[112] = 5;
  inv[87] = 6;
  int consultas[3] = {200, 112, 999};
  int i = 0;
  while (i < 3) {
    int k = consultas[i];
    if (inv[k] != 0) {            // si k no estaba, esta linea lo inserta con 0
      printf("%d: hay %d\n", k, inv[k]);
    } else {
      printf("%d: no hay\n", k);
    }
    printf("   size = %d\n", (int) inv.size());
    i = i + 1;
  }
  printf("con count:\n");
  map<int, int> otro;
  otro[305] = 5;
  otro[112] = 5;
  otro[87] = 6;
  i = 0;
  while (i < 3) {
    int k = consultas[i];
    if (otro.count(k) == 1) {
      printf("%d: hay %d\n", k, otro[k]);
    } else {
      printf("%d: no hay\n", k);
    }
    printf("   size = %d\n", (int) otro.size());
    i = i + 1;
  }
  return 0;
}
