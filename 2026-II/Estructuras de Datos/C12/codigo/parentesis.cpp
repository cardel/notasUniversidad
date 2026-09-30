// Parentesis balanceados con una pila.
#include <cstdio>
#include "pila.h"

// dice si c cierra lo que a abre
bool cierra(Elemento a, Elemento c) {
  return (a == '(' && c == ')') || (a == '[' && c == ']');
}

bool balanceado(const char *s) {
  Pila p;
  bool ok = true;
  int i = 0;
  while (ok && s[i] != '\0') {
    if (s[i] == '(' || s[i] == '[') {
      p.apilar(s[i]);
    } else if (p.vacia()) {
      ok = false;
    } else if (cierra(p.tope(), s[i])) {
      p.desapilar();
    } else {
      ok = false;
    }
    i = i + 1;
  }
  return ok && p.vacia();
}

int main() {
  const char *casos[5] = {"([])()", "([)]", "((", ")(", ""};
  int i = 0;
  while (i < 5) {
    printf("%-8s %s\n", casos[i], balanceado(casos[i]) ? "si" : "no");
    i = i + 1;
  }
  return 0;
}
