// Tiempo de procesador de n inserciones y n busquedas en unordered_map.
#include <cstdio>
#include <ctime>
#include <unordered_map>
using std::unordered_map;

const int P = 1000003;   // las mismas claves de medir.cpp: (i * 7919) % P

void medirUnordered(int n) {
  clock_t ini = clock();
  unordered_map<int, int> u;
  int i = 0;
  while (i < n) {
    u[(int) ((long long) i * 7919 % P)] = i;
    i = i + 1;
  }
  int hallados = 0;
  i = 0;
  while (i < n) {
    if (u.count((int) ((long long) i * 7919 % P)) == 1) {
      hallados = hallados + 1;
    }
    i = i + 1;
  }
  double s = (double) (clock() - ini) / CLOCKS_PER_SEC;
  printf("unordered_map, n = %d: %.3f s (%d hallados)", n, s, hallados);
  printf(", %d cubetas\n", (int) u.bucket_count());
}

int main() {
  medirUnordered(100000);
  medirUnordered(1000000);
  return 0;
}
