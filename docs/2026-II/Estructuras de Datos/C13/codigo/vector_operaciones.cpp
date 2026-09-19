// Las operaciones basicas de vector, una por una.
#include <cstdio>
#include <vector>
// cada nombre de la biblioteca vive en el espacio std: se trae solo lo que se usa
using std::vector;

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
  vector<int> v;
  imprimir(v);
  v.push_back(5);
  v.push_back(8);
  imprimir(v);
  v.insert(v.begin() + 1, 7);
  imprimir(v);
  v.erase(v.begin() + 0);
  imprimir(v);
  v[1] = 2;
  imprimir(v);
  printf("size: %d, empty: %d\n", (int) v.size(), (int) v.empty());
  return 0;
}
