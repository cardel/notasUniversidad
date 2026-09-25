// TAD Pila: contrato y una implementacion provisional.
#ifndef PILA_H
#define PILA_H
#include <cassert>

#ifndef TAD_COMUN
#define TAD_COMUN
typedef int Elemento;
const int CAPACIDAD = 100;
#endif

class Pila {
private:
  Elemento datos[CAPACIDAD];
  int n;
public:
  Pila() {
    n = 0;
  }
  void apilar(Elemento e) {
    assert(n < CAPACIDAD);
    datos[n] = e;
    n = n + 1;
  }
  // exige !vacia()
  void desapilar() {
    assert(n > 0);
    n = n - 1;
  }
  // exige !vacia()
  Elemento tope() {
    assert(n > 0);
    return datos[n - 1];
  }
  int tamano() {
    return n;
  }
  bool vacia() {
    return n == 0;
  }
};
#endif
