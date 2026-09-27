// Un iterador guardado antes de insert o erase deja de valer.
#include <cstdio>
#include <vector>
using std::vector;

int main() {
  vector<int> v = {7, 2, 9, 4};
  vector<int>::iterator it = v.begin() + 1;       // senala el 2
  printf("antes: *it = %d\n", *it);
  it = v.insert(v.begin(), 5);                    // insert devuelve la posicion del 5
  printf("insert devolvio *it = %d, indice %d\n", *it, (int) (it - v.begin()));
  it = v.begin() + 2;                             // se vuelve a tomar: ahora el 2
  it = v.erase(it);                               // erase devuelve la posicion siguiente
  printf("erase devolvio *it = %d, indice %d\n", *it, (int) (it - v.begin()));
  vector<int>::iterator q = v.begin();
  while (q != v.end()) {
    printf(" %d", *q);
    ++q;
  }
  printf("\n");
  return 0;
}
