// La moda de un arreglo; si hay empate, la menor. O(n log n) con map.
#include <cstdio>
#include <map>
using std::map;

int moda(int a[], int n) {
  map<int, int> veces;
  int i = 0;
  while (i < n) {
    veces[a[i]] = veces[a[i]] + 1;
    i = i + 1;
  }
  int mejor = 0;
  int cuantas = 0;
  map<int, int>::iterator it = veces.begin();
  while (it != veces.end()) {
    if (it->second > cuantas) {     // con > estricto, en un empate se queda la menor
      mejor = it->first;
      cuantas = it->second;
    }
    ++it;
  }
  return mejor;
}

int main() {
  int a[8] = {5, 2, 8, 2, 5, 9, 5, 2};
  int b[5] = {7, 3, 7, 1, 3};
  printf("moda de a: %d\n", moda(a, 8));
  printf("moda de b: %d\n", moda(b, 5));
  return 0;
}
