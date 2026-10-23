// Personas como clave de un map: operator<, comparador aparte y un comparador malo.
#include <cstdio>
#include <map>
#include "persona.h"
using std::map;

int main() {
  map<Persona, int> turno;                     // usa operator< de Persona
  map<Persona, int, CompararPersona> turno2;   // usa el comparador aparte
  map<Persona, int, SoloEdad> malo;            // compara solo la edad
  char nom[101];
  int e, s;
  int i = 0;
  while (scanf("%s %d %d", nom, &e, &s) == 3) {
    Persona p;
    p.nombre = nom;
    p.edad = e;
    p.salario = s;
    turno[p] = i;
    turno2[p] = i;
    malo[p] = i;
    i = i + 1;
  }
  map<Persona, int>::iterator it = turno.begin();
  while (it != turno.end()) {
    printf("%d %d %s (llego %d)\n", it->first.edad, it->first.salario,
           it->first.nombre.c_str(), it->second);
    ++it;
  }
  printf("size: %d con operator<, %d con CompararPersona, %d con SoloEdad\n",
         (int) turno.size(), (int) turno2.size(), (int) malo.size());
  map<Persona, int, SoloEdad>::iterator m = malo.begin();
  while (m != malo.end()) {
    printf("SoloEdad: %d %d %s -> %d\n", m->first.edad, m->first.salario,
           m->first.nombre.c_str(), m->second);
    ++m;
  }
  return 0;
}
