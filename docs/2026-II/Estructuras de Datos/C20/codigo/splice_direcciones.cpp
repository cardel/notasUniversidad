#include <cstdio>
#include <list>
using namespace std;

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
  list<int> a = {1, 2, 3};
  list<int> b = {4, 5};
  list<int>::iterator it = a.begin();
  ++it;                            // senala el 2
  list<int>::iterator cuatro = b.begin();
  printf("antes:   &b = %p, el 4 en %p\n", (void *) &b, (void *) &*cuatro);
  a.splice(it, b);                 // b entra antes del 2
  imprimir("a", a);                // 1 4 5 2 3
  imprimir("b", b);                // vacia
  printf("despues: &b = %p, el 4 en %p\n", (void *) &b, (void *) &*cuatro);
  --it;                            // del 2 retrocede al 5
  --it;                            // y al 4
  printf("*cuatro = %d, it en el 4: %d\n", *cuatro, (int) (it == cuatro));
  return 0;
}
