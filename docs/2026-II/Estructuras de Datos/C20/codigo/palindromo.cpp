// Una palabra es palindromo si sus extremos coinciden hasta agotarse.
#include <cstdio>
#include <deque>
using std::deque;

bool palindromo(const char *s) {
  deque<char> d;
  int i = 0;
  while (s[i] != '\0') {
    d.push_back(s[i]);
    i = i + 1;
  }
  bool iguales = true;
  while (iguales && d.size() >= 2) {
    if (d.front() == d.back()) {
      d.pop_front();
      d.pop_back();
    } else {
      iguales = false;
    }
  }
  return iguales;
}

int main() {
  char palabra[101];
  while (scanf("%s", palabra) == 1) {
    printf("%s %s\n", palabra, palindromo(palabra) ? "si" : "no");
  }
  return 0;
}
