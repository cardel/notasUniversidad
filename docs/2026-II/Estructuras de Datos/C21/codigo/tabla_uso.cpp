// Registrar quien entra al laboratorio con una tabla de 10 casillas.
#include <cstdio>
#include "tabla_directa.h"

void consultar(TablaDirecta &t, int clave) {
  Registro *r = t.buscar(clave);
  if (r == NULL) {
    printf("buscar(%d): no esta\n", clave);
  } else {
    printf("buscar(%d): %s\n", clave, r->nombre);
  }
}

int main() {
  TablaDirecta t(10);
  t.insertar(3, "Ana");
  t.insertar(7, "Luis");
  t.insertar(0, "Eva");
  t.imprimir();
  consultar(t, 7);
  consultar(t, 5);
  t.eliminar(3);
  consultar(t, 3);
  t.imprimir();
  return 0;
}
