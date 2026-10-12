// splice mueve nodos entre listas; sort ordena reescribiendo enlaces.
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
  list<int> a = {8, 1, 6};
  list<int> b = {5, 3};
  list<int>::iterator it = a.begin();
  ++it;                            // senala el 1
  a.splice(it, b);                 // b entra antes del 1
  imprimir("a", a);                // 8 5 3 1 6
  imprimir("b", b);                // vacia
  printf("*it = %d\n", *it);       // sigue en el 1

  a.sort();
  imprimir("a", a);                // 1 3 5 6 8
  printf("*it = %d\n", *it);       // el 1, ahora al frente
  return 0;
}
