// TAD Lista: contrato y una implementacion provisional.
// El resto del programa solo puede usar las operaciones publicas.
#ifndef LISTA_H
#define LISTA_H
#include <cassert>

#ifndef TAD_COMUN
#define TAD_COMUN
typedef int Elemento;
const int CAPACIDAD = 100;
#endif

class Lista {
private:
  Elemento datos[CAPACIDAD];
  int n;
public:
  Lista() {
    n = 0;
  }
  // exige 0 <= p <= tamano()
  void insertar(int p, Elemento e) {
    assert(0 <= p && p <= n && n < CAPACIDAD);
    int i = n;
    while (i > p) {
      datos[i] = datos[i - 1];
      i = i - 1;
    }
    datos[p] = e;
    n = n + 1;
  }
  // exige 0 <= p < tamano()
  void eliminar(int p) {
    assert(0 <= p && p < n);
    int i = p;
    while (i < n - 1) {
      datos[i] = datos[i + 1];
      i = i + 1;
    }
    n = n - 1;
  }
  // exige 0 <= p < tamano()
  Elemento obtener(int p) {
    assert(0 <= p && p < n);
    return datos[p];
  }
  // exige 0 <= p < tamano()
  void asignar(int p, Elemento e) {
    assert(0 <= p && p < n);
    datos[p] = e;
  }
  void agregar(Elemento e) {
    insertar(n, e);
  }
  int tamano() {
    return n;
  }
  bool vacia() {
    return n == 0;
  }
};
#endif
