// Ejercicios: contar en un rango con set, decidir si un arreglo es un
// monticulo, insertar claves en orden y bajar mirando solo un hijo.
#include <cstdio>
#include <set>
#include <vector>
#include "monticulo.h"
using std::set;
using std::vector;

// Claves en [a, b]: se baja hasta a y se camina hasta pasar b.
int contarRango(set<int> &s, int a, int b) {
  int cuenta = 0;
  set<int>::iterator it = s.lower_bound(a);
  set<int>::iterator fin = s.upper_bound(b);
  while (it != fin) {
    cuenta = cuenta + 1;
    ++it;
  }
  return cuenta;
}

// Cada casilla desde la 1 se compara con su padre, una sola vez.
bool esMonticulo(vector<int> &a) {
  bool res = true;
  int i = 1;
  while (i < (int) a.size() && res) {
    if (a[(i - 1) / 2] < a[i]) {
      res = false;
    }
    i = i + 1;
  }
  return res;
}

// Error: baja mirando solo el hijo izquierdo.
void bajarSoloIzq(vector<int> &a, int i) {
  int n = (int) a.size();
  while (2 * i + 1 < n && a[2 * i + 1] > a[i]) {
    int aux = a[i];
    a[i] = a[2 * i + 1];
    a[2 * i + 1] = aux;
    i = 2 * i + 1;
  }
}

void imprimir(vector<int> &a) {
  int i = 0;
  while (i < (int) a.size()) {
    printf(" %d", a[i]);
    i = i + 1;
  }
  printf("\n");
}

void ejemploRango() {
  int claves[7] = {30, 9, 57, 4, 22, 41, 15};
  set<int> s(claves, claves + 7);
  printf("contarRango(10, 40) = %d\n", contarRango(s, 10, 40));
  printf("contarRango(15, 22) = %d\n", contarRango(s, 15, 22));
  printf("contarRango(42, 56) = %d\n", contarRango(s, 42, 56));
}

void ejemploEsMonticulo() {
  int x[7] = {60, 35, 50, 20, 30, 50, 10};
  int y[7] = {60, 35, 50, 20, 38, 45, 10};
  int z[6] = {60, 50, 40, 30, 20, 10};
  vector<int> a(x, x + 7);
  vector<int> b(y, y + 7);
  vector<int> c(z, z + 6);
  printf("esMonticulo(A) = %d\n", (int) esMonticulo(a));
  printf("esMonticulo(B) = %d\n", (int) esMonticulo(b));
  printf("esMonticulo(C) = %d\n", (int) esMonticulo(c));
}

void ejemploEnOrden() {
  Monticulo m;
  int k = 10;
  while (k <= 70) {
    m.insertar(k);
    printf("insertar(%d):", k);
    m.imprimir();
    k = k + 10;
  }
}

void ejemploSoloIzq() {
  int x[9] = {25, 42, 40, 12, 31, 18, 7, 5, 9};
  vector<int> a(x, x + 9);
  bajarSoloIzq(a, 0);
  printf("bajarSoloIzq:");
  imprimir(a);
  printf("esMonticulo = %d\n", (int) esMonticulo(a));
}

int main() {
  ejemploRango();
  ejemploEsMonticulo();
  ejemploEnOrden();
  ejemploSoloIzq();
  return 0;
}
