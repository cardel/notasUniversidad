// Cuantas cubetas tiene unordered_map mientras entran claves de una en una.
#include <cstdio>
#include <unordered_map>
using std::unordered_map;

const int P = 1000003;

int main() {
  unordered_map<int, int> u;
  int antes = (int) u.bucket_count();
  printf("n = 0: bucket_count = %d\n", antes);
  int i = 0;
  while (i < 1000) {
    u[(int) ((long long) i * 7919 % P)] = i;
    int ahora = (int) u.bucket_count();
    if (ahora != antes) {
      // solo las filas donde la tabla crecio
      printf("n = %d: bucket_count = %d (antes %d)\n", (int) u.size(), ahora, antes);
      antes = ahora;
    }
    i = i + 1;
  }
  return 0;
}
