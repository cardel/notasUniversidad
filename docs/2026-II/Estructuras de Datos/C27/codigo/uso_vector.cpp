// El mismo recorrido de uso_list.py, con vector.
#include <cstdio>
#include <vector>
#include <algorithm>
using std::vector;
using std::find;

void imprimir(vector<int> &v) {
  int i = 0;
  while (i < (int) v.size()) {
    printf(" %d", v[i]);
    i = i + 1;
  }
  printf("\n");
}

int main() {
  vector<int> notas;
  notas.push_back(38);
  notas.push_back(45);
  notas.push_back(29);
  notas.push_back(41);
  imprimir(notas);
  printf("%d\n", notas[2]);
  notas[0] = 40;
  notas.insert(notas.begin() + 1, 33);
  imprimir(notas);
  int ultima = notas.back();
  notas.pop_back();
  printf("%d\n", ultima);
  int primera = notas[0];
  notas.erase(notas.begin());
  printf("%d\n", primera);
  imprimir(notas);
  printf("%d %d\n", (int) (find(notas.begin(), notas.end(), 45) != notas.end()),
         (int) (find(notas.begin(), notas.end(), 50) != notas.end()));
  return 0;
}
