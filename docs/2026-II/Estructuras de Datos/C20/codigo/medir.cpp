// Mide el tiempo de procesador de dos tareas sobre vector, deque y list.
#include <cstdio>
#include <ctime>
#include <vector>
#include <deque>
#include <list>
using std::vector;
using std::deque;
using std::list;

void alFrenteVector(int n) {
  vector<int> v;
  int i = 0;
  while (i < n) {
    v.insert(v.begin(), i);
    i = i + 1;
  }
}

void alFrenteDeque(int n) {
  deque<int> d;
  int i = 0;
  while (i < n) {
    d.push_front(i);
    i = i + 1;
  }
}

void alFrenteList(int n) {
  list<int> l;
  int i = 0;
  while (i < n) {
    l.push_front(i);
    i = i + 1;
  }
}

long sumarDeque(deque<int> &d) {
  long s = 0;
  int i = 0;
  while (i < (int) d.size()) {
    s = s + d[i];
    i = i + 1;
  }
  return s;
}

// el elemento i se alcanza caminando i pasos desde el comienzo
long sumarListPorIndice(list<int> &l) {
  long s = 0;
  int i = 0;
  while (i < (int) l.size()) {
    list<int>::iterator it = l.begin();
    int pasos = 0;
    while (pasos < i) {
      ++it;
      pasos = pasos + 1;
    }
    s = s + *it;
    i = i + 1;
  }
  return s;
}

long sumarListRecorrido(list<int> &l) {
  long s = 0;
  list<int>::iterator it = l.begin();
  while (it != l.end()) {
    s = s + *it;
    ++it;
  }
  return s;
}

double segundos(clock_t inicio) {
  return (double) (clock() - inicio) / CLOCKS_PER_SEC;
}

int main() {
  int tam[4] = {25000, 50000, 100000, 200000};
  int k = 0;
  printf("insertar al frente n veces (segundos)\n");
  printf("%8s %10s %10s %10s\n", "n", "vector", "deque", "list");
  while (k < 4) {
    int n = tam[k];
    clock_t t = clock();
    alFrenteVector(n);
    double tv = segundos(t);
    t = clock();
    alFrenteDeque(n);
    double td = segundos(t);
    t = clock();
    alFrenteList(n);
    double tl = segundos(t);
    printf("%8d %10.4f %10.4f %10.4f\n", n, tv, td, tl);
    k = k + 1;
  }

  int tam2[4] = {5000, 10000, 20000, 40000};
  k = 0;
  printf("sumar los n elementos (segundos)\n");
  printf("%8s %10s %12s %12s\n", "n", "deque d[i]", "list indice", "list iter");
  while (k < 4) {
    int n = tam2[k];
    deque<int> d;
    list<int> l;
    int i = 0;
    while (i < n) {
      d.push_back(i);
      l.push_back(i);
      i = i + 1;
    }
    clock_t t = clock();
    long s1 = sumarDeque(d);
    double td = segundos(t);
    t = clock();
    long s2 = sumarListPorIndice(l);
    double ti = segundos(t);
    t = clock();
    long s3 = sumarListRecorrido(l);
    double tr = segundos(t);
    printf("%8d %10.4f %12.4f %12.4f %s\n", n, td, ti, tr,
           (s1 == s2 && s2 == s3) ? "" : "distintas");
    k = k + 1;
  }
  return 0;
}
