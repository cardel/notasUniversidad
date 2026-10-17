#include "stdio.h"
#include "stdlib.h"

int main() {
  int n = 10;
  int *arr = (int *)malloc(n * sizeof(int));

  // int arr[10];
  for (int i = 0; i < n; i++) {
    *(arr + i) = 10; // O(1) porque es una suma
    // arr[i] = 10; // O(1) porque es una suma
    printf("%p \n", arr + i);
  }
}
