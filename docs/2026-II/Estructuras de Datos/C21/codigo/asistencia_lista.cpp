// La primera idea: los registros en una list, y buscar la recorre.
#include <cstdio>
#include <cstring>
#include <list>
using std::list;

struct Registro {
  int clave;
  char nombre[20];
};

// Theta(n) en el peor caso: camina hasta encontrar la clave o hasta el final
list<Registro>::iterator buscar(list<Registro> &l, int clave) {
  list<Registro>::iterator it = l.begin();
  while (it != l.end() && it->clave != clave) {
    ++it;
  }
  return it;
}

void insertar(list<Registro> &l, int clave, const char *nombre) {
  Registro r;
  r.clave = clave;
  strcpy(r.nombre, nombre);
  l.push_back(r);
}

void consultar(list<Registro> &l, int clave) {
  list<Registro>::iterator it = buscar(l, clave);
  if (it == l.end()) {
    printf("buscar(%d): no esta\n", clave);
  } else {
    printf("buscar(%d): %s\n", clave, it->nombre);
  }
}

int main() {
  list<Registro> l;
  insertar(l, 3, "Ana");
  insertar(l, 7, "Luis");
  insertar(l, 0, "Eva");
  consultar(l, 7);
  consultar(l, 5);
  list<Registro>::iterator it = buscar(l, 3);
  if (it != l.end()) {
    l.erase(it);
  }
  consultar(l, 3);
  return 0;
}
