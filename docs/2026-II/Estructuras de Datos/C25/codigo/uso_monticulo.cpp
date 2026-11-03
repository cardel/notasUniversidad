// El monticulo de maximos: las trazas de insertar y extraer, y los pedidos
// que se atienden siempre por el mas urgente.
#include <cstdio>
#include "monticulo.h"

// Inserta las nueve claves del ejemplo, el 42 y extrae el maximo.
void trazas() {
  Monticulo m;
  int claves[9] = {45, 31, 40, 12, 25, 18, 7, 5, 9};
  int i = 0;
  while (i < 9) {
    m.insertar(claves[i]);
    i = i + 1;
  }
  printf("inicial:         ");
  m.imprimir();
  m.insertar(42);
  printf("insertar(42):    ");
  m.imprimir();
  printf("maximo() = %d\n", m.maximo());
  int max = m.extraerMax();
  printf("extraerMax() = %d:", max);
  m.imprimir();
  printf("salen en orden:  ");
  while (!m.vacio()) {
    printf(" %d", m.extraerMax());
  }
  printf("\n");
}

// Cada pedido trae su urgencia; 0 es atender el mas urgente.
void pedidos() {
  Monticulo m;
  int ordenes[9] = {15, 40, 27, 8, 0, 27, 0, 0, 0};
  int i = 0;
  while (i < 9) {
    if (ordenes[i] == 0) {
      printf("atender: %d\n", m.extraerMax());
    } else {
      m.insertar(ordenes[i]);
    }
    i = i + 1;
  }
  printf("pendientes (%d):", m.tamano());
  m.imprimir();
}

int main() {
  trazas();
  pedidos();
  return 0;
}
