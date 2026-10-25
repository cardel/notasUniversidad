// UVa 507 - Jill Rides Again
#include <cstdio>
#include <vector>

using namespace std;

// arr tiene los size tramos de una ruta; el tramo i va de la parada i + 1
// a la i + 2. Imprime el mejor tramo, el más largo si hay empate y, entre
// los de igual largo, el que empieza antes.
void solve(const vector<int> &arr, int size, int cnt) {
  int ini = 1;
  int fin = 2;
  int iniTemp = 1;

  int mejor = arr[0];
  int curr = arr[0];

  for (int i = 1; i < size; i++) {
    if (curr < 0) {
      curr = arr[i];
      iniTemp = i + 1;
    } else {
      curr += arr[i];
    }

    int longitudActual = i + 1 - iniTemp + 1;
    int longitudMejor = fin - ini;

    if (curr > mejor || (curr == mejor && longitudActual > longitudMejor)) {
      ini = iniTemp;
      mejor = curr;
      fin = i + 2;
    }
  }

  if (mejor <= 0) {
    printf("Route %d has no nice parts\n", cnt);
  } else {
    printf("The nicest part of route %d is between stops %d and %d\n", cnt, ini,
           fin);
  }
}

int main() {
  int b;
  scanf("%d", &b);

  for (int r = 1; r <= b; r++) {
    int s;
    scanf("%d", &s);

    vector<int> arr(s - 1);

    for (int i = 0; i < s - 1; i++) {
      scanf("%d", &arr[i]);
    }

    solve(arr, s - 1, r);
  }

  return 0;
}
