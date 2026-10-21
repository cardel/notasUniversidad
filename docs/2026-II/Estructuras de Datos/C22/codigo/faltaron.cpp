// Quienes faltaron: los inscritos que no estan entre los asistentes.
#include <cstdio>
#include <map>
#include "tabla_hash.h"
using std::map;

// en el orden de la lista de inscritos: n_b inserciones y n_a busquedas, O(n_a + n_b) en promedio
void faltaronHash(int a[], int na, int b[], int nb) {
  TablaHash vinieron(11);
  int i = 0;
  while (i < nb) {
    vinieron.insertar(b[i]);
    i = i + 1;
  }
  i = 0;
  while (i < na) {
    if (!vinieron.buscar(a[i])) {
      printf(" %d", a[i]);
    }
    i = i + 1;
  }
  printf("\n");
}

// de menor a mayor codigo: n_a + n_b operaciones de O(log n_a)
void faltaronMap(int a[], int na, int b[], int nb) {
  map<int, int> falta;
  int i = 0;
  while (i < na) {
    falta[a[i]] = 1;
    i = i + 1;
  }
  i = 0;
  while (i < nb) {
    falta.erase(b[i]);
    i = i + 1;
  }
  map<int, int>::iterator it = falta.begin();
  while (it != falta.end()) {
    printf(" %d", it->first);
    ++it;
  }
  printf("\n");
}

int main() {
  int inscritos[6] = {4021, 3307, 5590, 1288, 4410, 2765};
  int asistentes[3] = {5590, 4021, 4410};
  printf("tabla hash:");
  faltaronHash(inscritos, 6, asistentes, 3);
  printf("map:");
  faltaronMap(inscritos, 6, asistentes, 3);
  return 0;
}
