// En que cubeta guarda unordered_map cada clave.
#include <cstdio>
#include <unordered_map>
using std::unordered_map;

int main() {
  int claves[4] = {305, 112, 87, 450};
  unordered_map<int, int> m;
  int i = 0;
  while (i < 4) {
    m[claves[i]] = 1;
    i = i + 1;
  }
  printf("bucket_count() = %d\n", (int) m.bucket_count());
  printf("load_factor() = %.3f, max_load_factor() = %.1f\n", m.load_factor(), m.max_load_factor());
  i = 0;
  while (i < 4) {
    printf("bucket(%d) = %d\n", claves[i], (int) m.bucket(claves[i]));
    i = i + 1;
  }
  return 0;
}
