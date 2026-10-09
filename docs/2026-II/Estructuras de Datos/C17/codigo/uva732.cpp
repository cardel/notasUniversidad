// UVa 732 - Anagrams by Stack: todas las secuencias de i y o que convierten
// la palabra de entrada en la de salida, en orden alfabetico.
#include <cstdio>
#include <cstring>
#include "pila_nodos.h"

const int MAXIMO = 100;  // letras que caben en cada palabra

// + 1 para el '\0' que cierra cada cadena
char entrada[MAXIMO + 1];
char salida[MAXIMO + 1];
// las dos palabras miden lo mismo cuando se busca
int largo;
// la secuencia en construccion: 2 * largo jugadas
char jugadas[2 * MAXIMO];

void imprimir() {
  int k = 0;
  while (k < 2 * largo) {
    if (k > 0) {
      printf(" ");
    }
    printf("%c", jugadas[k]);
    k = k + 1;
  }
  printf("\n");
}

// metidas: letras de la entrada que ya estan en la pila o salieron de ella.
// escritas: letras de la salida ya escritas.
// La jugada que se decide aqui es la numero metidas + escritas.
void buscar(Pila &p, int metidas, int escritas) {
  if (escritas == largo) {
    imprimir();
  } else {
    if (metidas < largo) {
      p.apilar(entrada[metidas]);
      jugadas[metidas + escritas] = 'i';
      buscar(p, metidas + 1, escritas);
      p.desapilar();
    }
    if (!p.vacia() && p.tope() == salida[escritas]) {
      Elemento letra = p.tope();
      p.desapilar();
      jugadas[metidas + escritas] = 'o';
      buscar(p, metidas, escritas + 1);
      p.apilar(letra);
    }
  }
}

int main() {
  while (scanf("%s %s", entrada, salida) == 2) {
    printf("[\n");
    if (strlen(entrada) == strlen(salida)) {
      largo = strlen(entrada);
      Pila p;
      buscar(p, 0, 0);
    }
    printf("]\n");
  }
  return 0;
}
