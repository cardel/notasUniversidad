// Un iterador es un puntero que sabe recorrer su contenedor.
#include <cstdio>
#include <vector>
#include <string>
#include <algorithm>
// cada nombre de la biblioteca vive en el espacio std: se trae solo lo que se usa
using std::vector;
using std::string;
using std::sort;

// recorre con indice, como hasta ahora
void imprimirIndice(vector<int> &v) {
  int p = 0;
  while (p < (int) v.size()) {
    printf(" %d", v[p]);
    p = p + 1;
  }
  printf("\n");
}

// recorre con iterador: la forma que sirve para todo contenedor
void imprimirIterador(vector<int> &v) {
  vector<int>::iterator it = v.begin();
  while (it != v.end()) {
    printf(" %d", *it);
    ++it;
  }
  printf("\n");
}

// cuenta vocales recorriendo la cadena con su iterador
int vocales(string &s) {
  int c = 0;
  string::iterator it = s.begin();
  while (it != s.end()) {
    if (*it == 'a' || *it == 'e' || *it == 'i' || *it == 'o' || *it == 'u') {
      c = c + 1;
    }
    ++it;
  }
  return c;
}

int main() {
  vector<int> v = {7, 2, 9, 4};
  imprimirIndice(v);
  imprimirIterador(v);
  vector<int>::iterator it = v.begin() + 2;
  printf("*(v.begin() + 2) = %d, indice %d\n", *it, (int) (it - v.begin()));
  string s = "iterador";
  printf("vocales de %s: %d\n", s.c_str(), vocales(s));
  // un arreglo de C tambien se recorre con punteros: son iteradores
  int a[5] = {9, 1, 8, 3, 5};
  sort(a, a + 5);
  int *p = a;
  while (p != a + 5) {
    printf(" %d", *p);
    ++p;
  }
  printf("\n");
  return 0;
}
