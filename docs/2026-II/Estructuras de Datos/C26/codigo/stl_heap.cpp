// El montículo de la STL: funciones de <algorithm> que trabajan sobre un
// vector y lo mantienen en orden de montículo de máximos.
#include <cstdio>
#include <vector>
#include <algorithm>
#include <functional>
using std::vector;
using std::make_heap;
using std::push_heap;
using std::pop_heap;
using std::sort_heap;
using std::is_heap;
using std::greater;

void imprimir(const char *rotulo, vector<int> &v) {
  printf("%-14s", rotulo);
  int i = 0;
  while (i < (int) v.size()) {
    printf(" %d", v[i]);
    i = i + 1;
  }
  printf("\n");
}

// Arma el montículo y agrega una clave.
void armarYAgregar(vector<int> &v) {
  imprimir("arreglo:", v);
  printf("is_heap: %d\n", (int) is_heap(v.begin(), v.end()));
  make_heap(v.begin(), v.end());
  imprimir("make_heap:", v);
  printf("is_heap: %d\n", (int) is_heap(v.begin(), v.end()));
  v.push_back(88);
  imprimir("push_back(88):", v);
  push_heap(v.begin(), v.end());
  imprimir("push_heap:", v);
}

// Saca el máximo y ordena lo que queda.
void sacarYOrdenar(vector<int> &v) {
  pop_heap(v.begin(), v.end());
  imprimir("pop_heap:", v);
  printf("back() = %d\n", v.back());
  v.pop_back();
  imprimir("pop_back:", v);
  sort_heap(v.begin(), v.end());
  imprimir("sort_heap:", v);
  printf("is_heap: %d\n", (int) is_heap(v.begin(), v.end()));
}

// Con greater<int>() el menor queda en w[0].
void minimos() {
  int claves[7] = {36, 81, 49, 95, 53, 77, 91};
  vector<int> w(claves, claves + 7);
  make_heap(w.begin(), w.end(), greater<int>());
  imprimir("min make_heap:", w);
  pop_heap(w.begin(), w.end(), greater<int>());
  printf("sale el menor: %d\n", w.back());
  w.pop_back();
  imprimir("min pop_back:", w);
}

int main() {
  int claves[7] = {36, 81, 49, 95, 53, 77, 91};
  vector<int> v(claves, claves + 7);
  armarYAgregar(v);
  sacarYOrdenar(v);
  minimos();
  return 0;
}
