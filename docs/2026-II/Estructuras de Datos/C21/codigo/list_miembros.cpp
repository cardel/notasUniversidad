// Operaciones propias de list: remove, unique, reverse y merge.
#include <cstdio>
#include <list>
using std::list;

void imprimir(const char *nombre, list<int> &l) {
  printf("%s:", nombre);
  list<int>::iterator it = l.begin();
  while (it != l.end()) {
    printf(" %d", *it);
    ++it;
  }
  printf("\n");
}

int main() {
  list<int> l = {3, 3, 8, 1, 1, 1, 6};
  l.unique();                // borra los repetidos seguidos
  imprimir("unique", l);     // 3 8 1 6
  l.remove(8);               // borra todos los 8
  imprimir("remove", l);     // 3 1 6
  l.reverse();               // invierte los enlaces
  imprimir("reverse", l);    // 6 1 3

  list<int> a = {1, 4, 9};
  list<int> b = {2, 4, 7};
  a.merge(b);                // las dos ordenadas: empalma los nodos de b
  imprimir("a", a);          // 1 2 4 4 7 9
  imprimir("b", b);          // vacia
  return 0;
}
