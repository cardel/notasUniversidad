// El mismo Fibonacci como se escribio en Introduccion a la Programacion:
// dos variables que se van corriendo y un ciclo. Un solo marco de pila y
// tiempo proporcional a n. Aqui esta permitido; en Scala, en este curso, no.

#include <cstdio>

int main() {
  int n = 6;      // 0 1 1 2 3 5 8
  int ant = 0;
  int act = 1;
  for (int i = 1; i < n; i++) {
    int aux = act;
    act = act + ant;
    ant = aux;
  }
  printf("El fibonacci de %d es %d\n", n, act);
  return 0;
}
