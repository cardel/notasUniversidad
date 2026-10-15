// Suma de una matriz de 10.000 x 10.000 repartida entre hilos de OpenMP.
// Dura lo suficiente para observarlo desde otra terminal con top o ps.
#include <cstdio>
#include <cstdlib>
#include <omp.h>

int SIZE = 10000;

int **crearMatriz() {
  int **arr = new int *[SIZE];
  for (int i = 0; i < SIZE; i++) {
    arr[i] = new int[SIZE];
    for (int j = 0; j < SIZE; j++) arr[i][j] = i + j;
  }
  return arr;
}

long sumaParalela(int **arr) {
  long suma = 0;
#pragma omp parallel for reduction(+ : suma)
  for (int i = 0; i < SIZE; i++)
    for (int j = 0; j < SIZE; j++) suma += arr[i][j];
  return suma;
}

int main(int argc, char *argv[]) {
  // Número de repeticiones de la suma, por la línea de comandos
  int repeticiones = argc > 1 ? atoi(argv[1]) : 1;
  int **arr = crearMatriz();
  long total = 0;
  for (int r = 0; r < repeticiones; r++) {
    total += sumaParalela(arr) % 7;
  }
  printf("%ld\n", total);
  return 0;
}
