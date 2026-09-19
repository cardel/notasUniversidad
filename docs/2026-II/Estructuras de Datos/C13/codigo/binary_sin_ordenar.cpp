// binary_search sobre un vector sin ordenar: responde, pero mal.
#include <cstdio>
#include <vector>
#include <algorithm>
// cada nombre de la biblioteca vive en el espacio std: se trae solo lo que se usa
using std::vector;
using std::find;
using std::binary_search;

int main() {
  vector<int> v = {9, 4, 7, 1, 4, 8};
  printf("sin ordenar, binary_search 7: %d\n", (int) binary_search(v.begin(), v.end(), 7));
  printf("sin ordenar, find 7: %s\n", find(v.begin(), v.end(), 7) != v.end() ? "esta" : "no esta");
  return 0;
}
