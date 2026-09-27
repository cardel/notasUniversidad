// Frecuencia de cada palabra: ordenar y contar en un solo recorrido.
#include <cstdio>
#include <vector>
#include <string>
#include <algorithm>
using std::vector;
using std::string;
using std::sort;

int main() {
  vector<string> p = {"cola", "pila", "cola", "lista", "cola", "pila"};
  sort(p.begin(), p.end());
  vector<string>::iterator it = p.begin();
  while (it != p.end()) {
    string actual = *it;
    int cuenta = 0;
    while (it != p.end() && *it == actual) {
      cuenta = cuenta + 1;
      ++it;
    }
    printf("%s %d\n", actual.c_str(), cuenta);
  }
  return 0;
}
