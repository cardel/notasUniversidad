// UVa 10815 - Andy's First Dictionary: las palabras distintas, en minuscula y
// en orden alfabetico. Cada palabra entra a un set<string>: O(log d) por palabra.
#include <cstdio>
#include <set>
#include <string>
using std::set;
using std::string;

bool esLetra(char c) {
  return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z');
}

char minuscula(char c) {
  char res = c;
  if (c >= 'A' && c <= 'Z') {
    res = (char) (c - 'A' + 'a');
  }
  return res;
}

// Parte el trozo en las rachas de letras y mete cada una, en minuscula, al set.
void agregarPalabras(char trozo[], set<string> &dic) {
  char pal[201];
  int largo = 0;
  int i = 0;
  while (trozo[i] != '\0') {
    if (esLetra(trozo[i])) {
      pal[largo] = minuscula(trozo[i]);
      largo = largo + 1;
    } else if (largo > 0) {
      pal[largo] = '\0';
      dic.insert(string(pal));
      largo = 0;
    }
    i = i + 1;
  }
  if (largo > 0) {
    pal[largo] = '\0';
    dic.insert(string(pal));
  }
}

int main() {
  set<string> dic;
  char trozo[201];
  while (scanf("%200s", trozo) == 1) {
    agregarPalabras(trozo, dic);
  }
  set<string>::iterator it = dic.begin();
  while (it != dic.end()) {
    printf("%s\n", it->c_str());
    ++it;
  }
  return 0;
}
