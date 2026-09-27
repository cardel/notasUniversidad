// Quitar los ceros de un vector: con erase mientras se recorre, y compactando.
#include <cstdio>
#include <vector>
using std::vector;

void imprimir(vector<int> &v) {
  vector<int>::iterator it = v.begin();
  while (it != v.end()) {
    printf(" %d", *it);
    ++it;
  }
  printf("\n");
}

// version 1: erase devuelve el siguiente; solo se avanza cuando no se borra
void quitarCerosErase(vector<int> &v) {
  vector<int>::iterator it = v.begin();
  while (it != v.end()) {
    if (*it == 0) {
      it = v.erase(it);
    } else {
      ++it;
    }
  }
}

// version 2: se copian los que quedan hacia el frente y se recorta el final
void quitarCeros(vector<int> &v) {
  int destino = 0;
  int p = 0;
  while (p < (int) v.size()) {
    if (v[p] != 0) {
      v[destino] = v[p];
      destino = destino + 1;
    }
    p = p + 1;
  }
  v.erase(v.begin() + destino, v.end());
}

int main() {
  vector<int> a = {0, 3, 0, 0, 8, 1, 0};
  vector<int> b = a;
  quitarCerosErase(a);
  quitarCeros(b);
  imprimir(a);
  imprimir(b);
  return 0;
}
