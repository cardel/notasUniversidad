// Catorce inserciones, una por una: cubetas, factor de carga y cubeta del 31.
#include <cstdio>
#include <unordered_map>
using std::unordered_map;

int main() {
  int claves[14] = {5, 18, 31, 1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12};
  unordered_map<int, int> u;
  int i = 0;
  while (i < 14) {
    u[claves[i]] = 1;
    printf("entra %2d: n = %2d, m = %2d, alfa = %.2f, bucket(5) = %d, bucket(18) = %d, bucket(31) = %d\n",
           claves[i], (int) u.size(), (int) u.bucket_count(), u.load_factor(),
           (int) u.bucket(5), (int) u.bucket(18), (int) u.bucket(31));
    i = i + 1;
  }
  return 0;
}
