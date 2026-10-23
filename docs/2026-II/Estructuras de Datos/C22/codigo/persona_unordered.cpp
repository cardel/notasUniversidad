// Personas como clave de un unordered_map: un struct hash y operator==.
#include <cstdio>
#include <unordered_map>
#include "persona.h"
using std::unordered_map;

int main() {
  unordered_map<Persona, int, HashPersona> turno;
  char nom[101];
  int e, s;
  int i = 0;
  while (scanf("%s %d %d", nom, &e, &s) == 3) {
    Persona p;
    p.nombre = nom;
    p.edad = e;
    p.salario = s;
    turno[p] = i;
    i = i + 1;
  }
  Persona q;
  q.nombre = "carla";
  q.edad = 30;
  q.salario = 2000;
  printf("size = %d, count(carla 30 2000) = %d\n", (int) turno.size(), (int) turno.count(q));
  q.salario = 1500;
  printf("count(carla 30 1500) = %d\n", (int) turno.count(q));
  return 0;
}
