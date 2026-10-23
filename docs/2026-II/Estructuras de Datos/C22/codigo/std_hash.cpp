// Que devuelve std::hash en g++ y como se reduce a una cubeta.
#include <cstdio>
#include <string>
#include <unordered_map>
using std::hash;
using std::string;
using std::unordered_map;

int main() {
  hash<int> hEntero;
  hash<string> hTexto;
  unordered_map<int, int> u;
  int claves[4] = {305, 112, 87, 450};
  int i = 0;
  while (i < 4) {
    u[claves[i]] = 1;
    i = i + 1;
  }
  i = 0;
  while (i < 4) {
    unsigned long long h = hEntero(claves[i]);
    printf("hash<int>(%d) = %llu, %llu mod %d = %d, bucket = %d\n", claves[i], h, h,
           (int) u.bucket_count(), (int) (h % u.bucket_count()), (int) u.bucket(claves[i]));
    i = i + 1;
  }
  string s = "amor";
  printf("hash<string>(amor) = %llu\n", (unsigned long long) hTexto(s));
  s = "roma";
  printf("hash<string>(roma) = %llu\n", (unsigned long long) hTexto(s));
  return 0;
}
