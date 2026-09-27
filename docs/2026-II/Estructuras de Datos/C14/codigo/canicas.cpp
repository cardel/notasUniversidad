// lower_bound: la primera posicion cuyo valor no es menor que x, en un vector ordenado.
#include <cstdio>
#include <vector>
#include <algorithm>
using std::vector;
using std::sort;
using std::lower_bound;

int main() {
  vector<int> v = {5, 2, 3, 5, 1, 5, 8};
  sort(v.begin(), v.end());                       // < 1 2 3 5 5 5 8 >
  int consultas[4] = {5, 4, 9, 1};
  int i = 0;
  while (i < 4) {
    int x = consultas[i];
    vector<int>::iterator it = lower_bound(v.begin(), v.end(), x);
    int pos = (int) (it - v.begin());
    if (it != v.end() && *it == x) {
      printf("%d esta, la primera vez en la posicion %d\n", x, pos);
    } else {
      printf("%d no esta; iria en la posicion %d\n", x, pos);
    }
    i = i + 1;
  }
  return 0;
}
