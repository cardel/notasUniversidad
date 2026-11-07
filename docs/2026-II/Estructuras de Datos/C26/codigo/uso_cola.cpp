// La cola de prioridad: primero con el montículo de la clase, después con
// el contenedor priority_queue de la STL.
#include <cstdio>
#include <queue>
#include <vector>
#include "monticulo.h"
using std::priority_queue;
using std::vector;

// Las operaciones del TAD sobre el montículo de máximos.
void conMonticulo() {
  Monticulo cola;
  cola.insertar(61);
  cola.insertar(27);
  printf("maximo() = %d\n", cola.maximo());
  cola.insertar(88);
  cola.insertar(43);
  printf("extraerMax() = %d\n", cola.extraerMax());
  printf("extraerMax() = %d\n", cola.extraerMax());
  cola.insertar(70);
  printf("tamano() = %d, maximo() = %d\n", cola.tamano(), cola.maximo());
}

// push, top, pop, size y empty: sale siempre el mayor.
void enteros() {
  priority_queue<int> pq;
  int llegan[5] = {64, 15, 90, 37, 52};
  int i = 0;
  while (i < 5) {
    pq.push(llegan[i]);
    i = i + 1;
  }
  printf("top() = %d, size() = %d\n", pq.top(), (int) pq.size());
  pq.pop();
  printf("tras pop(): top() = %d\n", pq.top());
  printf("salen:");
  while (!pq.empty()) {
    printf(" %d", pq.top());
    pq.pop();
  }
  printf("\n");
}

// a va detrás de b cuando a es mayor: arriba queda el menor.
struct MenorArriba {
  bool operator()(int a, int b) const {
    return a > b;
  }
};

void minimos() {
  priority_queue<int, vector<int>, MenorArriba> pq;
  int llegan[5] = {71, 55, 83, 9, 55};
  int i = 0;
  while (i < 5) {
    pq.push(llegan[i]);
    i = i + 1;
  }
  printf("salen:");
  while (!pq.empty()) {
    printf(" %d", pq.top());
    pq.pop();
  }
  printf("\n");
}

// Un paciente: más gravedad se atiende antes y,
// con la misma gravedad, el que llegó primero.
struct Paciente {
  int llegada;
  int gravedad;

  bool operator<(const Paciente &o) const {
    bool menos;
    if (gravedad != o.gravedad) {
      menos = gravedad < o.gravedad;
    } else {
      menos = llegada > o.llegada;
    }
    return menos;
  }
};

void urgencias() {
  priority_queue<Paciente> sala;
  int gravedad[5] = {3, 1, 4, 3, 4};
  int i = 0;
  while (i < 5) {
    Paciente p;
    p.llegada = i + 1;
    p.gravedad = gravedad[i];
    sala.push(p);
    i = i + 1;
  }
  while (!sala.empty()) {
    Paciente p = sala.top();
    sala.pop();
    printf("atender: llegada %d, gravedad %d\n", p.llegada, p.gravedad);
  }
}

int main() {
  conMonticulo();
  enteros();
  minimos();
  urgencias();
  return 0;
}
