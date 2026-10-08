// UVa 732 - Anagrams by Stack: todas las secuencias de i y o que convierten
// la palabra de entrada en la de salida, en orden alfabetico.
#include <iostream>
#include <string>
#include "pila_nodos.h"

using std::cin;
using std::cout;
using std::endl;
using std::string;

string entrada;
string salida;
int largo;        // las dos palabras miden lo mismo cuando se busca
string jugadas;   // la secuencia en construccion: 2 * largo jugadas

void imprimir() {
  int k = 0;
  while (k < 2 * largo) {
    if (k > 0) {
      cout << " ";
    }
    cout << jugadas[k];
    k = k + 1;
  }
  cout << endl;
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
  while (cin >> entrada >> salida) {
    cout << "[" << endl;
    if (entrada.size() == salida.size()) {
      largo = entrada.size();
      jugadas = string(2 * largo, 'i');
      Pila p;
      buscar(p, 0, 0);
    }
    cout << "]" << endl;
  }
  return 0;
}
