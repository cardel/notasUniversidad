// Altura del ABB y tiempo de procesador de n inserciones: claves 1..n en
// orden frente a n claves desordenadas con una permutacion multiplicativa.
#include <cstdio>
#include <ctime>
#include "abb.h"

// Con P primo mayor que n y 0 < A < P, (i * A) % P da claves distintas
// para i = 1..n; con A = 623820, cerca de 0,62 P, salen desordenadas.
const int P = 1000003;
const int A = 623820;

// a[i] = ((i + 1) * A) % P, para i = 0..n-1.
void desordenar(int a[], int n) {
  int i = 0;
  while (i < n) {
    a[i] = (int) ((long long) (i + 1) * A % P);
    i = i + 1;
  }
}

// Altura minima posible con n nodos: piso de log2 n.
int pisoLog2(int n) {
  int h = 0;
  while (n > 1) {
    n = n / 2;
    h = h + 1;
  }
  return h;
}

double segundos(clock_t inicio) {
  return (double) (clock() - inicio) / CLOCKS_PER_SEC;
}

// Inserta a[0..n-1] en un ABB vacio, con la version iterativa.
Nodo *construirIterativa(int a[], int n) {
  Nodo *r = NULL;
  int i = 0;
  while (i < n) {
    r = insertarIterativa(r, a[i]);
    i = i + 1;
  }
  return r;
}

// Inserta a[0..n-1] en un ABB vacio, con la version recursiva.
Nodo *construirRecursiva(int a[], int n) {
  Nodo *r = NULL;
  int i = 0;
  while (i < n) {
    r = insertar(r, a[i]);
    i = i + 1;
  }
  return r;
}

void medir(int n) {
  int *a = new int[n];
  int i = 0;
  while (i < n) {
    a[i] = i + 1;
    i = i + 1;
  }
  clock_t t = clock();
  Nodo *orden = construirIterativa(a, n);
  double sOrden = segundos(t);
  desordenar(a, n);
  t = clock();
  Nodo *perm = construirRecursiva(a, n);
  double sPerm = segundos(t);
  printf("%6d %6d %9.4f %6d %9.4f %6d\n", n, altura(orden), sOrden,
         altura(perm), sPerm, pisoLog2(n));
  liberar(orden);
  liberar(perm);
  delete[] a;
}

int main() {
  printf("%6s %6s %9s %6s %9s %6s\n", "n", "h ord", "s orden", "h perm", "s perm", "log2n");
  int n = 1000;
  while (n <= 16000) {
    medir(n);
    n = n * 2;
  }
  return 0;
}
