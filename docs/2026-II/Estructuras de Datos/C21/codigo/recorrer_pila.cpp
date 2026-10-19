// stack y queue no tienen iteradores: para recorrerlas se vacia una copia.
#include <cstdio>
#include <stack>
#include <queue>
using std::stack;
using std::queue;

// s llega por valor: es una copia, y la original no cambia
void imprimirPila(stack<int> s) {
  printf("pila, de la cima al fondo:");
  while (!s.empty()) {
    printf(" %d", s.top());
    s.pop();
  }
  printf("\n");
}

void imprimirCola(queue<int> c) {
  printf("cola, del frente al final:");
  while (!c.empty()) {
    printf(" %d", c.front());
    c.pop();
  }
  printf("\n");
}

int main() {
  stack<int> s;
  queue<int> c;
  int i = 1;
  while (i <= 4) {
    s.push(10 * i);
    c.push(10 * i);
    i = i + 1;
  }
  imprimirPila(s);   // 40 30 20 10
  imprimirCola(c);   // 10 20 30 40
  printf("siguen con %d y %d\n", (int) s.size(), (int) c.size());
  return 0;
}
