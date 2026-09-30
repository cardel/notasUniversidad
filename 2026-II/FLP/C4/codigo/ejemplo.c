#include "stdlib.h"

int main() {

  int *arr = malloc(10 * sizeof(int));
  if (arr != NULL) {
    for (int i = 0; i < 10; i++) {
      *(arr + i) = i;
    }
  }
}
