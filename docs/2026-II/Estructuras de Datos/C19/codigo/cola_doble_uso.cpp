// La cola doble: entra y sale por los dos extremos.
#include <cstdio>
#include "cola_doble.h"

int main() {
  ColaDoble d;
  d.insertarFinal(4);
  d.insertarFinal(7);
  d.insertarFrente(1);
  printf("frente %d, final %d, tamano %d\n", d.frente(), d.final(), d.tamano());
  d.eliminarFinal();
  printf("sin el final: frente %d, final %d\n", d.frente(), d.final());
  d.eliminarFrente();
  d.eliminarFinal();
  printf("vacia: %d\n", d.vacia());
  d.insertarFrente(9);
  printf("de nuevo: frente %d, final %d\n", d.frente(), d.final());
  return 0;
}
