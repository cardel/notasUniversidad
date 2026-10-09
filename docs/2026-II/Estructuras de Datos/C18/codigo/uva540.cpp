// UVa 540 - Team Queue: una cola de equipos y una cola por equipo.
// Encolar y desencolar cuestan Theta(1).
#include <cstdio>
#include <cstring>
#include "cola_nodos.h"

const int MAX_PERSONAS = 1000000;
const int MAX_EQUIPOS = 1000;

int equipo[MAX_PERSONAS];      // equipo[x]: equipo de la persona x
Cola filaEquipo[MAX_EQUIPOS];  // filaEquipo[e]: los de e que estan en la fila
Cola equipos;                  // los equipos con alguien en la fila, en orden

// La persona x entra detras del ultimo de su equipo; si su equipo no
// tiene a nadie en la fila, el equipo entra al final de la cola de equipos.
void encolar(int x) {
  int e = equipo[x];
  if (filaEquipo[e].vacia()) {
    equipos.encolar(e);
  }
  filaEquipo[e].encolar(x);
}

// Sale el primero del equipo que esta al frente; si el equipo queda
// vacio, sale tambien de la cola de equipos. Exige que la fila no este vacia.
int desencolar() {
  int e = equipos.frente();
  int x = filaEquipo[e].frente();
  filaEquipo[e].desencolar();
  if (filaEquipo[e].vacia()) {
    equipos.desencolar();
  }
  return x;
}

// Deja vacias todas las colas para el escenario siguiente.
void vaciar() {
  while (!equipos.vacia()) {
    int e = equipos.frente();
    while (!filaEquipo[e].vacia()) {
      filaEquipo[e].desencolar();
    }
    equipos.desencolar();
  }
}

int main() {
  int t;
  int escenario = 0;
  scanf("%d", &t);
  while (t != 0) {
    escenario = escenario + 1;
    int e = 0;
    while (e < t) {
      int m;
      scanf("%d", &m);
      int j = 0;
      while (j < m) {
        int x;
        scanf("%d", &x);
        equipo[x] = e;
        j = j + 1;
      }
      e = e + 1;
    }
    printf("Scenario #%d\n", escenario);
    char orden[16];
    scanf("%s", orden);
    while (strcmp(orden, "STOP") != 0) {
      if (strcmp(orden, "ENQUEUE") == 0) {
        int x;
        scanf("%d", &x);
        encolar(x);
      } else {
        printf("%d\n", desencolar());
      }
      scanf("%s", orden);
    }
    printf("\n");
    vaciar();
    scanf("%d", &t);
  }
  return 0;
}
