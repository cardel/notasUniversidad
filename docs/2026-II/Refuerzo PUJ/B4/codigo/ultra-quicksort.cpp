#include <cstdio>
#include <vector>

using namespace std;

long long mezclar(vector<int> &a, vector<int> &aux, int ini, int medio, int fin) {
  // Mezcla a[ini:medio) con a[medio:fin) y cuenta las parejas fuera de orden.
  int i = ini, j = medio, k = ini;
  long long cruzadas = 0;
  while (k < fin) {
    if (i < medio && (j >= fin || a[i] <= a[j])) {
      aux[k] = a[i];
      i = i + 1;
    } else {
      aux[k] = a[j];
      j = j + 1;
      cruzadas = cruzadas + (medio - i);
    }
    k = k + 1;
  }
  for (k = ini; k < fin; k++) {
    a[k] = aux[k];
  }
  return cruzadas;
}

long long contar(vector<int> &a, vector<int> &aux, int ini, int fin) {
  // Ordena a[ini:fin) en el lugar y devuelve cuantas inversiones tenia.
  long long total = 0;
  if (fin - ini > 1) {
    int medio = (ini + fin) / 2;
    total = contar(a, aux, ini, medio);
    total = total + contar(a, aux, medio, fin);
    total = total + mezclar(a, aux, ini, medio, fin);
  }
  return total;
}

int main() {
  int n;
  while (scanf("%d", &n) == 1 && n != 0) {
    vector<int> a(n), aux(n);
    for (int i = 0; i < n; i++) {
      scanf("%d", &a[i]);
    }
    printf("%lld\n", contar(a, aux, 0, n));
  }
  return 0;
}
