// Monticulo de maximos sobre un vector, con indices desde 0:
// el padre de i esta en (i - 1) / 2 y sus hijos en 2i + 1 y 2i + 2.
// Cada nodo es mayor o igual que sus hijos, asi que el maximo esta en a[0].
#ifndef MONTICULO_H
#define MONTICULO_H
#include <cstdio>
#include <cassert>
#include <vector>
using std::vector;

class Monticulo {
private:
  vector<int> a;

  void intercambiar(int i, int j) {
    int aux = a[i];
    a[i] = a[j];
    a[j] = aux;
  }

  // Sube la clave de i mientras sea mayor que la de su padre.
  void subir(int i) {
    while (i > 0 && a[(i - 1) / 2] < a[i]) {
      intercambiar(i, (i - 1) / 2);
      i = (i - 1) / 2;
    }
  }

  // Baja la clave de i, cambiandola por el mayor de sus hijos.
  void bajar(int i) {
    int n = (int) a.size();
    bool sigue = true;
    while (sigue) {
      int izq = 2 * i + 1;
      int der = 2 * i + 2;
      int mayor = i;
      if (izq < n && a[izq] > a[mayor]) {
        mayor = izq;
      }
      if (der < n && a[der] > a[mayor]) {
        mayor = der;
      }
      if (mayor != i) {
        intercambiar(i, mayor);
        i = mayor;
      } else {
        sigue = false;
      }
    }
  }

public:
  // La clave entra en la primera casilla libre y sube.
  void insertar(int k) {
    a.push_back(k);
    subir((int) a.size() - 1);
  }

  int maximo() {
    assert(!a.empty());
    return a[0];
  }

  // La ultima clave pasa a la raiz y baja hasta su lugar.
  int extraerMax() {
    assert(!a.empty());
    int res = a[0];
    a[0] = a[a.size() - 1];
    a.pop_back();
    if (!a.empty()) {
      bajar(0);
    }
    return res;
  }

  bool vacio() {
    return a.empty();
  }

  int tamano() {
    return (int) a.size();
  }

  // Imprime el vector por dentro, casilla por casilla.
  void imprimir() {
    int i = 0;
    while (i < (int) a.size()) {
      printf(" %d", a[i]);
      i = i + 1;
    }
    printf("\n");
  }
};
#endif
