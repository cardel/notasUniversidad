// El contenedor unordered_map: la misma interfaz que map, sin orden de clave.
#include <cstdio>
#include <unordered_map>
using std::unordered_map;

// recorre con su iterador: las claves salen en el orden de las cubetas
void imprimir(unordered_map<int, int> &m) {
  unordered_map<int, int>::iterator it = m.begin();
  while (it != m.end()) {
    printf(" (%d, %d)", it->first, it->second);
    ++it;
  }
  printf("   size = %d\n", (int) m.size());
}

int main() {
  unordered_map<int, int> inv;
  inv[305] = 4;
  inv[112] = 2;
  inv[305] = inv[305] + 1;
  inv[87] = 6;
  imprimir(inv);
  printf("count(112) = %d, count(200) = %d\n", (int) inv.count(112), (int) inv.count(200));
  unordered_map<int, int>::iterator f = inv.find(112);
  if (f != inv.end()) {
    printf("find(112): clave %d, valor %d\n", f->first, f->second);
  }
  printf("erase(305) = %d\n", (int) inv.erase(305));
  imprimir(inv);
  return 0;
}
