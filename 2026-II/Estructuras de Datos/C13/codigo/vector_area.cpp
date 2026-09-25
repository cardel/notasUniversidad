// El area del programador de la sesion de contratos, ahora sobre vector.
#include <cstdio>
#include <vector>
// cada nombre de la biblioteca vive en el espacio std: se trae solo lo que se usa
using std::vector;

void imprimir(vector<int> &v) {
  int p = 0;
  printf("<");
  while (p < (int) v.size()) {
    printf(" %d", v[p]);
    p = p + 1;
  }
  printf(" >\n");
}

// copia al final de r los elementos de l desde la posicion p
void copiarDesde(vector<int> &r, vector<int> &l, int p) {
  while (p < (int) l.size()) {
    r.push_back(l[p]);
    p = p + 1;
  }
}

// a y b vienen ordenadas de menor a mayor; devuelve la union ordenada
vector<int> mezclar(vector<int> &a, vector<int> &b) {
  vector<int> r;
  int i = 0;
  int j = 0;
  while (i < (int) a.size() && j < (int) b.size()) {
    if (a[i] <= b[j]) {
      r.push_back(a[i]);
      i = i + 1;
    } else {
      r.push_back(b[j]);
      j = j + 1;
    }
  }
  copiarDesde(r, a, i);
  copiarDesde(r, b, j);
  return r;
}

// devuelve un vector nuevo con los mismos elementos en orden inverso
vector<int> revertir(vector<int> &l) {
  vector<int> r;
  int p = 0;
  while (p < (int) l.size()) {
    r.insert(r.begin(), l[p]);
    p = p + 1;
  }
  return r;
}

int main() {
  vector<int> a = {4, 5, 9};
  vector<int> b = {1, 5, 8};
  vector<int> m = mezclar(a, b);
  imprimir(m);
  vector<int> r = revertir(m);
  imprimir(r);
  return 0;
}
