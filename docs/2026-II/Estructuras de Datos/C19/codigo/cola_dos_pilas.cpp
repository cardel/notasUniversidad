#include <cstdio>
#include "pila_nodos.h"

class ColaDosPilas {
private:
  Pila entrada;
  Pila salida;

  // vuelca la entrada en la salida solo si la salida esta vacia
  void volcar() {
    if (salida.vacia()) {
      while (!entrada.vacia()) {
        salida.apilar(entrada.tope());
        entrada.desapilar();
      }
    }
  }

public:
  void encolar(Elemento e) {
    entrada.apilar(e);
  }

  // exige !vacia()
  Elemento frente() {
    volcar();
    return salida.tope();
  }

  // exige !vacia()
  void desencolar() {
    volcar();
    salida.desapilar();
  }

  bool vacia() {
    return entrada.vacia() && salida.vacia();
  }
};

int main() {
  ColaDosPilas c;
  int v = 3;
  while (v <= 7) {
    c.encolar(v);
    v = v + 1;
  }
  printf("frente %d\n", c.frente());
  c.encolar(6);
  c.encolar(7);
  c.encolar(8);
  printf("sale:");
  while (!c.vacia()) {
    printf(" %d", c.frente());
    c.desencolar();
  }
  printf("\n");
  return 0;
}
