// Quitar repetidos: sort + unique + erase, frente a la version cuadratica.
#include <cstdio>
#include <vector>
#include <algorithm>
using std::vector;
using std::sort;
using std::unique;

void imprimir(vector<int> &v) {
  vector<int>::iterator it = v.begin();
  while (it != v.end()) {
    printf(" %d", *it);
    ++it;
  }
  printf("\n");
}

int main() {
  vector<int> v = {4, 1, 4, 9, 1, 1, 4};
  sort(v.begin(), v.end());                       // < 1 1 1 4 4 4 9 >
  imprimir(v);
  vector<int>::iterator fin = unique(v.begin(), v.end());
  printf("unique dejo %d distintos al frente\n", (int) (fin - v.begin()));
  imprimir(v);                                    // lo que hay despues de fin no vale
  v.erase(fin, v.end());
  imprimir(v);
  return 0;
}
