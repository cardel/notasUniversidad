// Un iterador apunta a la pareja; una copia del valor no toca el map.
// Las claves string se ordenan por codigo: las mayusculas van antes.
#include <cstdio>
#include <map>
#include <string>
using std::map;
using std::string;

int main() {
  map<int, int> inv;
  inv[87] = 6;
  inv[112] = 2;
  inv[305] = 5;

  map<int, int>::iterator f = inv.find(112);
  int copia = f->second;   // copia el valor: 2
  copia = 9;               // cambia la copia, no el map
  printf("tras cambiar la copia: inv[112] = %d\n", inv[112]);
  f->second = 9;           // cambia la pareja a la que apunta f
  printf("tras cambiar f->second: inv[112] = %d\n", inv[112]);
  printf("copia = %d\n", copia);

  map<string, int> nombres;
  nombres["carlos"] = 1;
  nombres["Carlos"] = 2;
  nombres["Zoe"] = 3;
  map<string, int>::iterator it = nombres.begin();
  while (it != nombres.end()) {
    printf("%s %d\n", it->first.c_str(), it->second);
    ++it;
  }
  return 0;
}
