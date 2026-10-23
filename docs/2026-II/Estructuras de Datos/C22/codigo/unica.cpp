// La primera palabra que aparece una sola vez, con unordered_map<string, int>.
#include <cstdio>
#include <string>
#include <unordered_map>
#include <vector>
using std::string;
using std::unordered_map;
using std::vector;

int main() {
  vector<string> texto;              // las palabras en el orden de llegada
  unordered_map<string, int> veces;
  char pal[101];
  while (scanf("%s", pal) == 1) {
    string clave = pal;
    texto.push_back(clave);
    veces[clave] = veces[clave] + 1;
  }
  int i = 0;
  while (i < (int) texto.size() && veces[texto[i]] != 1) {
    i = i + 1;
  }
  if (i < (int) texto.size()) {
    printf("%s\n", texto[i].c_str());
  } else {
    printf("ninguna\n");
  }
  return 0;
}
