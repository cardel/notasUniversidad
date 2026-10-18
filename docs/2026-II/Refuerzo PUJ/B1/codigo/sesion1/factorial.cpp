// Cada llamada de factorial ocupa un marco en la pila de llamadas con su propio n.
// Compilar con -g para ver los marcos en gdb.
#include <cstdio>

long factorial(int n) {
  long resultado;
  if (n == 0) {
    resultado = 1;
  } else {
    resultado = n * factorial(n - 1);
  }
  return resultado;
}

int main() {
  int numero = 5;
  long resultado = factorial(numero);
  printf("factorial de %d = %ld\n", numero, resultado);
  return 0;
}
