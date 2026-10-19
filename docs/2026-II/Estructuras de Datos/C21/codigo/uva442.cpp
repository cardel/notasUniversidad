// UVa 442 - Matrix Chain Multiplication: una pila de dimensiones. Theta(L) por expresion de largo L.
#include <cstdio>
#include <stack>
using std::stack;

struct Matriz {
  long long filas;
  long long columnas;
};

int main() {
  Matriz dim[26];            // la dimension de la matriz 'A' + i va en la casilla i
  int n;
  scanf("%d", &n);
  int k = 0;
  while (k < n) {
    char nombre[2];
    Matriz m;
    scanf("%s %lld %lld", nombre, &m.filas, &m.columnas);
    dim[nombre[0] - 'A'] = m;
    k = k + 1;
  }
  char e[1000];
  while (scanf("%s", e) == 1) {
    stack<Matriz> pila;
    long long total = 0;
    bool error = false;
    int i = 0;
    while (e[i] != '\0' && !error) {
      if (e[i] >= 'A' && e[i] <= 'Z') {
        pila.push(dim[e[i] - 'A']);
      } else if (e[i] == ')') {
        Matriz der = pila.top();   // la de la derecha salio de ultima
        pila.pop();
        Matriz izq = pila.top();
        pila.pop();
        if (izq.columnas != der.filas) {
          error = true;
        } else {
          total = total + izq.filas * izq.columnas * der.columnas;
          Matriz r;
          r.filas = izq.filas;
          r.columnas = der.columnas;
          pila.push(r);
        }
      }
      i = i + 1;
    }
    if (error) {
      printf("error\n");
    } else {
      printf("%lld\n", total);
    }
  }
  return 0;
}
