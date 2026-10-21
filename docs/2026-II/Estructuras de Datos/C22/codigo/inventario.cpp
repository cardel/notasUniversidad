// Total por producto, de menor a mayor codigo. Cada registro cuesta O(log n).
#include <cstdio>
#include <map>
using std::map;

int main() {
  int n;
  scanf("%d", &n);
  map<int, int> total;
  int i = 0;
  while (i < n) {
    int codigo, cantidad;
    scanf("%d %d", &codigo, &cantidad);
    total[codigo] = total[codigo] + cantidad;   // si no estaba, entra con 0
    i = i + 1;
  }
  map<int, int>::iterator it = total.begin();
  while (it != total.end()) {
    printf("%d %d\n", it->first, it->second);
    ++it;
  }
  return 0;
}
