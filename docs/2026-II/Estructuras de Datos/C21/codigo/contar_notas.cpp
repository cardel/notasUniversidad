// Cuantas veces aparece cada nota. Las notas van en decimas: 35 es 3,5.
#include <cstdio>

const int M = 51;    // notas de 0 a 50

// cuenta[k] termina con las veces que aparecio la nota k
void contar(int cuenta[]) {
  int k = 0;
  while (k < M) {
    cuenta[k] = 0;
    k = k + 1;
  }
  int nota;
  while (scanf("%d", &nota) == 1) {
    cuenta[nota] = cuenta[nota] + 1;     // la nota es la casilla
  }
}

void imprimir(int cuenta[]) {
  int k = 0;
  while (k < M) {
    if (cuenta[k] > 0) {
      printf("%d,%d: %d\n", k / 10, k % 10, cuenta[k]);
    }
    k = k + 1;
  }
}

int main() {
  int cuenta[M];
  contar(cuenta);
  imprimir(cuenta);
  return 0;
}
