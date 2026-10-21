// Cuantas veces aparece cada palabra, en orden alfabetico, con map<string, int>.
#include <cstdio>
#include <map>
#include <string>
using std::map;
using std::string;

int main() {
  map<string, int> veces;
  char pal[101];
  while (scanf("%s", pal) == 1) {
    string clave = pal;     // copia las letras: dos string se comparan por su texto
    veces[clave] = veces[clave] + 1;
  }
  map<string, int>::iterator it = veces.begin();
  while (it != veces.end()) {
    printf("%s %d\n", it->first.c_str(), it->second);
    ++it;
  }
  return 0;
}
