#include <cstdio>
#include <valgrind/callgrind.h>

int SIZE = 10000;
int **arr;

void inicializar_datos() {
  arr = new int *[SIZE];
  for (int i = 0; i < SIZE; i++) {
    arr[i] = new int[SIZE];
    for (int j = 0; j < SIZE; j++) {
      arr[i][j] = i + j;
    }
  }
}

long funcion_sospechosa() {
  long suma = 0;
  for (int i = 0; i < SIZE; i++) {
    for (int j = 0; j < SIZE; j++) {
      suma += arr[i][j];
    }
  }
  return suma;
}

void procesar_resultados(long res) { printf("%ld\n", res); }

int main() {
  inicializar_datos();  // NO se perfila

  CALLGRIND_START_INSTRUMENTATION;
  CALLGRIND_TOGGLE_COLLECT;
  long res = funcion_sospechosa();  // SE perfila
  CALLGRIND_TOGGLE_COLLECT;
  CALLGRIND_STOP_INSTRUMENTATION;

  procesar_resultados(res);  // NO se perfila
}
