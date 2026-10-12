// UVa 11988 - Broken Keyboard: el cursor es un iterador de list. Theta(n) por linea.
#include <cstdio>
#include <list>
using std::list;

char linea[100005];
char pantalla[100005];

int main() {
  while (scanf("%s", linea) == 1) {
    list<char> texto;
    list<char>::iterator cursor = texto.end();
    int i = 0;
    while (linea[i] != '\0') {
      if (linea[i] == '[') {
        cursor = texto.begin();
      } else if (linea[i] == ']') {
        cursor = texto.end();
      } else {
        texto.insert(cursor, linea[i]);   // entra antes del cursor, que no se mueve
      }
      i = i + 1;
    }
    int k = 0;
    list<char>::iterator it = texto.begin();
    while (it != texto.end()) {
      pantalla[k] = *it;
      k = k + 1;
      ++it;
    }
    pantalla[k] = '\0';
    printf("%s\n", pantalla);
  }
  return 0;
}
