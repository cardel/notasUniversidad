// Maximo de cada ventana de k casillas: directo y con deque.
#include <cstdio>
#include <deque>
using std::deque;

// Theta((n - k + 1) k): cada ventana se recorre entera
void maximosDirecto(int a[], int n, int k) {
  int j = k - 1;
  while (j < n) {
    int m = a[j - k + 1];
    int i = j - k + 2;
    while (i <= j) {
      if (a[i] > m) {
        m = a[i];
      }
      i = i + 1;
    }
    printf(" %d", m);
    j = j + 1;
  }
  printf("\n");
}

// Theta(n): cada indice entra y sale del deque a lo sumo una vez
void maximosDeque(int a[], int n, int k) {
  deque<int> d;          // indices; valores decrecientes
  int j = 0;
  while (j < n) {
    while (!d.empty() && a[d.back()] <= a[j]) {
      d.pop_back();            // ya no puede ser maximo
    }
    d.push_back(j);
    if (d.front() <= j - k) {
      d.pop_front();           // salio de la ventana
    }
    if (j >= k - 1) {
      printf(" %d", a[d.front()]);
    }
    j = j + 1;
  }
  printf("\n");
}

int main() {
  int a[8] = {4, 2, 12, 3, 8, 7, 1, 5};
  maximosDirecto(a, 8, 3);
  maximosDeque(a, 8, 3);
  return 0;
}
