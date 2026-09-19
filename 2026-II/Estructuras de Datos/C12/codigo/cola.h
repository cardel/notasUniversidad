// TAD Cola: contrato y una implementacion provisional (arreglo circular).
#ifndef COLA_H
#define COLA_H
#include <cassert>

#ifndef TAD_COMUN
#define TAD_COMUN
typedef int Elemento;
const int CAPACIDAD = 100;
#endif

class Cola {
private:
  Elemento datos[CAPACIDAD];
  int inicio;   // posicion del frente
  int n;
public:
  Cola() {
    inicio = 0;
    n = 0;
  }
  void encolar(Elemento e) {
    assert(n < CAPACIDAD);
    datos[(inicio + n) % CAPACIDAD] = e;
    n = n + 1;
  }
  // exige !vacia()
  void desencolar() {
    assert(n > 0);
    inicio = (inicio + 1) % CAPACIDAD;
    n = n - 1;
  }
  // exige !vacia()
  Elemento frente() {
    assert(n > 0);
    return datos[inicio];
  }
  int tamano() {
    return n;
  }
  bool vacia() {
    return n == 0;
  }
};
#endif
