// El contenedor map: insertar con [], count, find, erase y recorrido en orden.
#include <cstdio>
#include <map>
using std::map;

// recorre el map con su iterador: las claves salen de menor a mayor
void imprimir(map<int, int> &m) {
  map<int, int>::iterator it = m.begin();
  while (it != m.end()) {
    printf(" (%d, %d)", it->first, it->second);
    ++it;
  }
  printf("   size = %d\n", (int) m.size());
}

int main() {
  map<int, int> inv;
  inv[305] = 4;
  imprimir(inv);
  inv[112] = 2;
  imprimir(inv);
  inv[305] = inv[305] + 1;
  imprimir(inv);
  inv[87] = 6;
  imprimir(inv);
  printf("count(112) = %d, count(200) = %d\n", (int) inv.count(112), (int) inv.count(200));
  map<int, int>::iterator f = inv.find(112);
  if (f != inv.end()) {
    printf("find(112): clave %d, valor %d\n", f->first, f->second);
  }
  printf("find(200) == end(): %d\n", (int) (inv.find(200) == inv.end()));
  printf("erase(305) = %d\n", (int) inv.erase(305));
  printf("erase(305) = %d\n", (int) inv.erase(305));
  imprimir(inv);
  return 0;
}
