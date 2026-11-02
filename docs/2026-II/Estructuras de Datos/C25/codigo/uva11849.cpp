// UVa 11849 - CD: cuantos titulos tienen Jack y Jill a la vez. Los de Jack
// entran a un set y cada uno de Jill se busca: O((N + M) log N) por caso.
#include <cstdio>
#include <set>
using std::set;

int main() {
  int n, m;
  scanf("%d %d", &n, &m);
  while (n != 0 || m != 0) {
    set<int> jack;
    int i = 0;
    while (i < n) {
      int cd;
      scanf("%d", &cd);
      jack.insert(cd);
      i = i + 1;
    }
    int comunes = 0;
    i = 0;
    while (i < m) {
      int cd;
      scanf("%d", &cd);
      comunes = comunes + (int) jack.count(cd);
      i = i + 1;
    }
    printf("%d\n", comunes);
    scanf("%d %d", &n, &m);
  }
  return 0;
}
