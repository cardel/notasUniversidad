// Pasar un vector por valor copia todo; por referencia, no.
#include <cstdio>
#include <vector>
// cada nombre de la biblioteca vive en el espacio std: se trae solo lo que se usa
using std::vector;

void duplicarCopia(vector<int> v) {
  int p = 0;
  while (p < (int) v.size()) {
    v[p] = 2 * v[p];
    p = p + 1;
  }
}

void duplicar(vector<int> &v) {
  int p = 0;
  while (p < (int) v.size()) {
    v[p] = 2 * v[p];
    p = p + 1;
  }
}

int main() {
  vector<int> v;
  v.push_back(3);
  v.push_back(4);
  duplicarCopia(v);
  printf("tras duplicarCopia: %d %d\n", v[0], v[1]);
  duplicar(v);
  printf("tras duplicar:      %d %d\n", v[0], v[1]);
  return 0;
}
