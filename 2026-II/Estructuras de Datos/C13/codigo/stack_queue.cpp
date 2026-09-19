// Los contratos de pila y cola tal como los trae la STL.
#include <cstdio>
#include <stack>
#include <queue>
// cada nombre de la biblioteca vive en el espacio std: se trae solo lo que se usa
using std::stack;
using std::queue;

bool cierra(char a, char c) {
  return (a == '(' && c == ')') || (a == '[' && c == ']');
}

bool balanceado(const char *s) {
  stack<char> p;
  bool ok = true;
  int i = 0;
  while (ok && s[i] != '\0') {
    if (s[i] == '(' || s[i] == '[') {
      p.push(s[i]);
    } else if (p.empty()) {
      ok = false;
    } else if (cierra(p.top(), s[i])) {
      p.pop();
    } else {
      ok = false;
    }
    i = i + 1;
  }
  return ok && p.empty();
}

// imprime del frente al final y deja la cola como estaba
void imprimir(queue<int> &c) {
  int i = 0;
  int n = (int) c.size();
  while (i < n) {
    int x = c.front();
    printf(" %d", x);
    c.pop();
    c.push(x);
    i = i + 1;
  }
  printf("\n");
}

int main() {
  printf("([])() %s\n", balanceado("([])()") ? "si" : "no");
  printf("([)]   %s\n", balanceado("([)]") ? "si" : "no");
  queue<int> c;
  c.push(7);
  c.push(2);
  c.push(9);
  imprimir(c);
  c.pop();
  imprimir(c);
  printf("size: %d\n", (int) c.size());
  return 0;
}
