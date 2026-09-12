#include <stdio.h>

long factorial(int n) {
  if (n == 0 || n == 1) {
    return 1;
  } else {
    return n * factorial(n - 1);
  }
}

int main() { printf("Factorial of 10 is %ld\n", factorial(10)); }
