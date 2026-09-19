// Una cola construida solo con el contrato de Pila.
#include <cstdio>
#include "pila.h"

class ColaDP {
private:
  Pila entrada;
  Pila salida;
  // pasa todo lo que hay en entrada a salida, invirtiendo el orden
  void trasvasar() {
    while (!entrada.vacia()) {
      salida.apilar(entrada.tope());
      entrada.desapilar();
    }
  }
public:
  void encolar(Elemento e) {
    entrada.apilar(e);
  }
  // exige !vacia()
  Elemento frente() {
    if (salida.vacia()) {
      trasvasar();
    }
    return salida.tope();
  }
  // exige !vacia()
  void desencolar() {
    if (salida.vacia()) {
      trasvasar();
    }
    salida.desapilar();
  }
  bool vacia() {
    return entrada.vacia() && salida.vacia();
  }
};

int main() {
  ColaDP c;
  c.encolar(7);
  c.encolar(2);
  c.encolar(9);
  printf("frente: %d\n", c.frente());
  c.desencolar();
  c.encolar(4);
  printf("frente: %d\n", c.frente());
  c.desencolar();
  c.desencolar();
  printf("frente: %d\n", c.frente());
  c.desencolar();
  printf("vacia: %d\n", c.vacia());
  return 0;
}
