// list: la lista doblemente enlazada de la biblioteca.
#include <cstdio>
#include <list>
using std::list;

void imprimir(list<int> &l) {
  list<int>::iterator it = l.begin();
  while (it != l.end()) {
    printf(" %d", *it);
    ++it;
  }
  printf("\n");
}

// insertar y borrar donde senala el iterador
void conIterador(list<int> &l) {
  list<int>::iterator it = l.begin();
  ++it;                            // senala el 4
  l.insert(it, 9);                 // entra antes del 4
  imprimir(l);                     // 1 9 4 7
  printf("*it = %d\n", *it);       // sigue en el 4
  it = l.erase(it);                // devuelve el siguiente: el 7
  printf("*it = %d\n", *it);
  --it;                            // retrocede al 9
  printf("*it = %d\n", *it);
}

int main() {
  list<int> l;
  l.push_back(4);
  l.push_back(7);
  l.push_front(1);
  imprimir(l);                     // 1 4 7
  conIterador(l);
  l.pop_front();
  l.pop_back();
  imprimir(l);                     // 9
  printf("size: %d\n", (int) l.size());
  return 0;
}
