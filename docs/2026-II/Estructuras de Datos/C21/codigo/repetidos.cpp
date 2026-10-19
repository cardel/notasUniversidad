// Hay un valor repetido? Los valores van de 0 a 999.
#include <cstdio>

const int M = 1000;

// compara cada par: Theta(n^2) en el peor caso
bool repetidoDirecto(int a[], int n) {
  bool hay = false;
  int i = 0;
  while (i < n && !hay) {
    int j = i + 1;
    while (j < n && !hay) {
      if (a[i] == a[j]) {
        hay = true;
      }
      j = j + 1;
    }
    i = i + 1;
  }
  return hay;
}

// una bandera por valor posible: O(n + m)
bool repetidoTabla(int a[], int n) {
  bool visto[M];
  int k = 0;
  while (k < M) {
    visto[k] = false;
    k = k + 1;
  }
  bool hay = false;
  int i = 0;
  while (i < n && !hay) {
    if (visto[a[i]]) {
      hay = true;
    }
    visto[a[i]] = true;
    i = i + 1;
  }
  return hay;
}

int main() {
  int a[] = {412, 87, 903, 15, 87, 230};
  int b[] = {5, 999, 0, 314};
  printf("a: %s %s\n", repetidoDirecto(a, 6) ? "si" : "no", repetidoTabla(a, 6) ? "si" : "no");
  printf("b: %s %s\n", repetidoDirecto(b, 4) ? "si" : "no", repetidoTabla(b, 4) ? "si" : "no");
  return 0;
}
