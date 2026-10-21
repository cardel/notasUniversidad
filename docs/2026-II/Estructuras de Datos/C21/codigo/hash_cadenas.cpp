// Dos funciones hash para cadenas: la suma de los codigos y el polinomio en base 31.
#include <cstdio>

// Suma los codigos de los caracteres y toma el residuo.
int hashSuma(const char *s, int m) {
  int suma = 0;
  int i = 0;
  while (s[i] != '\0') {
    suma = suma + s[i];
    i = i + 1;
  }
  return suma % m;
}

// Lee la cadena como un numero en base 31 (Horner), reduciendo en cada paso.
int hashPolinomio(const char *s, int m) {
  int h = 0;
  int i = 0;
  while (s[i] != '\0') {
    h = (h * 31 + s[i]) % m;
    i = i + 1;
  }
  return h;
}

int main() {
  const char *palabras[4] = {"sol", "los", "gato", "toga"};
  int i = 0;
  while (i < 4) {
    printf("%-5s suma %2d  polinomio %2d\n", palabras[i],
           hashSuma(palabras[i], 13), hashPolinomio(palabras[i], 13));
    i = i + 1;
  }
  return 0;
}
