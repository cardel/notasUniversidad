// Evaluacion de una expresion en notacion postfija con una pila.
#include <cstdio>
#include "pila.h"

int aplicar(char op, int a, int b) {
  int r = 0;
  if (op == '+') {
    r = a + b;
  } else if (op == '-') {
    r = a - b;
  } else if (op == '*') {
    r = a * b;
  } else {
    r = a / b;
  }
  return r;
}

// s trae digitos y operadores separados por espacios; exige que sea valida
int evaluar(const char *s) {
  Pila p;
  int i = 0;
  while (s[i] != '\0') {
    if (s[i] >= '0' && s[i] <= '9') {
      p.apilar(s[i] - '0');
    } else if (s[i] != ' ') {
      int b = p.tope();
      p.desapilar();
      int a = p.tope();
      p.desapilar();
      p.apilar(aplicar(s[i], a, b));
    }
    i = i + 1;
  }
  return p.tope();
}

int main() {
  printf("3 4 + 2 *   = %d\n", evaluar("3 4 + 2 *"));
  printf("5 3 -       = %d\n", evaluar("5 3 -"));
  printf("8 2 / 3 -   = %d\n", evaluar("8 2 / 3 -"));
  printf("2 3 4 * +   = %d\n", evaluar("2 3 4 * +"));
  return 0;
}
