int SIZE = 10000;

long sumaMatriz(int **matriz) {
  long suma = 0;
  for (int i = 0; i < SIZE; i++) {
    for (int j = 0; j < SIZE; j++) {
      suma += matriz[i][j];
    }
  }
  return suma;
}

#include <cstdio>

int main(int, char *[]) {
  int **arr = new int *[SIZE];
  for (int i = 0; i < SIZE; i++) {
    arr[i] = new int[SIZE];
    for (int j = 0; j < SIZE; j++) {
      arr[i][j] = i + j;
    }
  }
  long res = sumaMatriz(arr);
  printf("%ld\n", res);
  return 0;
}
