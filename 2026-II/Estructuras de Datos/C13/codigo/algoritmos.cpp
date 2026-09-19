// Los primeros algoritmos de la STL sobre un vector.
#include <cstdio>
#include <vector>
#include <string>
#include <algorithm>
// cada nombre de la biblioteca vive en el espacio std: se trae solo lo que se usa
using std::vector;
using std::string;
using std::sort;
using std::reverse;
using std::count;
using std::find;
using std::binary_search;
using std::min_element;
using std::max_element;

void imprimir(vector<int> &v) {
  int p = 0;
  printf("<");
  while (p < (int) v.size()) {
    printf(" %d", v[p]);
    p = p + 1;
  }
  printf(" >\n");
}

int main() {
  vector<int> v = {9, 4, 7, 1, 4, 8};
  sort(v.begin(), v.end());
  imprimir(v);
  printf("binary_search 7: %d\n", (int) binary_search(v.begin(), v.end(), 7));
  printf("binary_search 5: %d\n", (int) binary_search(v.begin(), v.end(), 5));
  vector<int>::iterator it = find(v.begin(), v.end(), 8);
  if (it != v.end()) {
    printf("8 esta en la posicion %d\n", (int) (it - v.begin()));
  }
  it = find(v.begin(), v.end(), 3);
  printf("3 %s\n", it == v.end() ? "no esta" : "esta");
  printf("count 4: %d\n", (int) count(v.begin(), v.end(), 4));
  printf("menor %d, mayor %d\n", *min_element(v.begin(), v.end()), *max_element(v.begin(), v.end()));
  reverse(v.begin(), v.end());
  imprimir(v);
  return 0;
}
