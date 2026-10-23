// Ejercicio: personas de mayor a menor salario; en empate, por nombre.
#include <cstdio>
#include <map>
#include "persona.h"
using std::map;

struct PorSalario {
  bool operator()(const Persona &a, const Persona &b) const {
    bool menor;
    if (a.salario != b.salario) {
      menor = a.salario > b.salario;   // el salario mayor va primero
    } else {
      menor = a.nombre < b.nombre;
    }
    return menor;
  }
};

int main() {
  map<Persona, int, PorSalario> lista;
  char nom[101];
  int e, s;
  while (scanf("%s %d %d", nom, &e, &s) == 3) {
    Persona p;
    p.nombre = nom;
    p.edad = e;
    p.salario = s;
    lista[p] = e;
  }
  map<Persona, int, PorSalario>::iterator it = lista.begin();
  while (it != lista.end()) {
    printf("%d %s\n", it->first.salario, it->first.nombre.c_str());
    ++it;
  }
  printf("size = %d\n", (int) lista.size());
  return 0;
}
