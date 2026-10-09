// UVa 10901 - Ferry Loading III: una cola por orilla; el caso cuesta Theta(m).
#include <iostream>
#include <string>
#include "cola_nodos.h"

using std::cin;
using std::cout;
using std::string;

const int MAX_CARROS = 10000;

int llegada[MAX_CARROS];  // llegada[i]: minuto en que llega el carro i
int salida[MAX_CARROS];   // salida[i]: minuto en que el carro i llega al otro lado

// Primera llegada entre los frentes de las dos orillas; exige que
// alguna de las dos tenga carros.
int primeraLlegada(Cola orilla[]) {
  int menor;
  if (orilla[0].vacia()) {
    menor = llegada[orilla[1].frente()];
  } else if (orilla[1].vacia()) {
    menor = llegada[orilla[0].frente()];
  } else if (llegada[orilla[0].frente()] < llegada[orilla[1].frente()]) {
    menor = llegada[orilla[0].frente()];
  } else {
    menor = llegada[orilla[1].frente()];
  }
  return menor;
}

// Simula el ferri: orilla[0] es la izquierda y orilla[1] la derecha; en
// cada cola van los indices de los carros, en orden de llegada.
void simular(Cola orilla[], int n, int t) {
  int reloj = 0;
  int lado = 0;
  while (!orilla[0].vacia() || !orilla[1].vacia()) {
    int primera = primeraLlegada(orilla);
    if (reloj < primera) {
      reloj = primera;
    }
    int cargados = 0;
    while (cargados < n && !orilla[lado].vacia() &&
           llegada[orilla[lado].frente()] <= reloj) {
      salida[orilla[lado].frente()] = reloj + t;
      orilla[lado].desencolar();
      cargados = cargados + 1;
    }
    // Con carga o sin ella, el ferri cruza: si nadie esperaba de este
    // lado, es porque alguien ya espera en el otro.
    reloj = reloj + t;
    lado = 1 - lado;
  }
}

int main() {
  std::ios::sync_with_stdio(false);
  cin.tie(NULL);
  int c;
  cin >> c;
  int caso = 0;
  while (caso < c) {
    int n, t, m;
    cin >> n >> t >> m;
    Cola orilla[2];
    int i = 0;
    while (i < m) {
      string lado;
      cin >> llegada[i] >> lado;
      if (lado == "left") {
        orilla[0].encolar(i);
      } else {
        orilla[1].encolar(i);
      }
      i = i + 1;
    }
    simular(orilla, n, t);
    if (caso > 0) {
      cout << "\n";
    }
    i = 0;
    while (i < m) {
      cout << salida[i] << "\n";
      i = i + 1;
    }
    caso = caso + 1;
  }
  return 0;
}
