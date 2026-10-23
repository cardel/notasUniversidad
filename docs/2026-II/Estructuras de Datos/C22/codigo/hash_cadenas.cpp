// Dos funciones hash para cadenas: sumar los codigos y el polinomio de Horner.
#include <cstdio>
#include <string>
using std::string;

int hashSuma(string s, int m) {
  int h = 0;
  int i = 0;
  while (i < (int) s.size()) {
    h = (h + s[i]) % m;
    i = i + 1;
  }
  return h;
}

// Horner en base 31, reduciendo modulo m en cada paso
int hashPolinomio(string s, int m) {
  int h = 0;
  int i = 0;
  while (i < (int) s.size()) {
    h = (h * 31 + s[i]) % m;
    i = i + 1;
  }
  return h;
}

int main() {
  char pal[101];
  while (scanf("%s", pal) == 1) {
    string s = pal;
    printf("%s: suma %d, polinomio %d\n", s.c_str(), hashSuma(s, 13), hashPolinomio(s, 13));
  }
  return 0;
}
