// Evaluar una expresion postfija de un digito, con +, - y *, sobre stack<int>.
// "3 4 + 2 *" da 14 y "8 2 - 3 *" da 18.
#include <cstdio>
#include <cstring>
#include <stack>
using std::stack;

int evaluar(const char *s) {
  stack<int> p;
  int i = 0;
  while (s[i] != '\0') {
    if (s[i] >= '0' && s[i] <= '9') {
      p.push(s[i] - '0');
    } else if (s[i] != ' ') {
      int b = p.top();
      p.pop();
      int a = p.top();
      p.pop();
      if (s[i] == '+') {
        p.push(a + b);
      } else if (s[i] == '-') {
        p.push(a - b);
      } else {
        p.push(a * b);
      }
    }
    i = i + 1;
  }
  return p.top();
}

int main() {
  printf("3 4 + 2 * = %d\n", evaluar("3 4 + 2 *"));
  printf("8 2 - 3 * = %d\n", evaluar("8 2 - 3 *"));
  return 0;
}
