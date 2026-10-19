// UVa 484 - The Department of Redundancy Department: cuenta cada entero
// con una tabla hash con encadenamiento. O(1 + alfa) por numero en promedio.
#include <cstdio>
#include <vector>
using std::vector;

struct Nodo {
  int clave;
  int cuenta;
  Nodo *siguiente;
};

const int M = 100003;  // primo, lejos de las potencias de 2
Nodo *casillas[M];

// El residuo de C++ conserva el signo: -7 % 5 da -2. Se corre a [0, M).
int h(int k) {
  return ((k % M) + M) % M;
}

// Suma uno a la cuenta de k. Devuelve si k aparecio por primera vez.
bool sumar(int k) {
  int i = h(k);
  Nodo *actual = casillas[i];
  while (actual != NULL && actual->clave != k) {
    actual = actual->siguiente;
  }
  bool nueva = actual == NULL;
  if (nueva) {
    actual = new Nodo;
    actual->clave = k;
    actual->cuenta = 0;
    actual->siguiente = casillas[i];
    casillas[i] = actual;
  }
  actual->cuenta = actual->cuenta + 1;
  return nueva;
}

// Exige que k este en la tabla.
int cuenta(int k) {
  Nodo *actual = casillas[h(k)];
  while (actual->clave != k) {
    actual = actual->siguiente;
  }
  return actual->cuenta;
}

void liberar() {
  int i = 0;
  while (i < M) {
    while (casillas[i] != NULL) {
      Nodo *muerto = casillas[i];
      casillas[i] = casillas[i]->siguiente;
      delete muerto;
    }
    i = i + 1;
  }
}

int main() {
  vector<int> orden;  // las claves distintas, en el orden en que llegaron
  int k;
  while (scanf("%d", &k) == 1) {
    if (sumar(k)) {
      orden.push_back(k);
    }
  }
  int j = 0;
  while (j < (int) orden.size()) {
    printf("%d %d\n", orden[j], cuenta(orden[j]));
    j = j + 1;
  }
  liberar();
  return 0;
}
