// Claves 1..n que llegan en orden: el ABB sin balancear frente al set.
// Del ABB se mide la altura y el tiempo; del set solo el tiempo, porque
// la biblioteca no deja ver su arbol.
#include <cstdio>
#include <ctime>
#include <set>
#include "abb.h"
using std::set;

double segundos(clock_t inicio) {
  return (double) (clock() - inicio) / CLOCKS_PER_SEC;
}

// inserta 1..n en un ABB vacio con la version iterativa
Nodo *construirABB(int n) {
  Nodo *r = NULL;
  int k = 1;
  while (k <= n) {
    r = insertarIterativa(r, k);
    k = k + 1;
  }
  return r;
}

// inserta 1..n en un set vacio
void construirSet(set<int> &s, int n) {
  int k = 1;
  while (k <= n) {
    s.insert(k);
    k = k + 1;
  }
}

void medir(int n) {
  clock_t t = clock();
  Nodo *abb = construirABB(n);
  double sABB = segundos(t);
  set<int> s;
  t = clock();
  construirSet(s, n);
  double sSet = segundos(t);
  printf("%7d %7d %9.4f %9.4f\n", n, altura(abb), sABB, sSet);
  liberar(abb);
}

int main() {
  printf("%7s %7s %9s %9s\n", "n", "h ABB", "s ABB", "s set");
  int n = 1000;
  while (n <= 32000) {
    medir(n);
    n = n * 2;
  }
  set<int> grande;
  clock_t t = clock();
  construirSet(grande, 1000000);
  printf("set con 1000000 claves en orden: %.4f s\n", segundos(t));
  return 0;
}
