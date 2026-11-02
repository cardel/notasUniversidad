// Ejercicios con set: contar en un rango, el mas cercano y borrar los menores.
#include <cstdio>
#include <cassert>
#include <set>
using std::set;

void imprimir(set<int> &s) {
  set<int>::iterator it = s.begin();
  while (it != s.end()) {
    printf(" %d", *it);
    ++it;
  }
  printf("\n");
}

// Claves en [a, b]: se baja hasta a y se camina hasta pasar b.
int contarRango(set<int> &s, int a, int b) {
  int cuenta = 0;
  set<int>::iterator it = s.lower_bound(a);
  set<int>::iterator fin = s.upper_bound(b);
  while (it != fin) {
    cuenta = cuenta + 1;
    ++it;
  }
  return cuenta;
}

// La clave mas cercana a x; si empatan dos, la menor. s no vacio.
int masCercano(set<int> &s, int x) {
  assert(!s.empty());
  set<int>::iterator techo = s.lower_bound(x);   // la primera >= x
  set<int>::iterator piso = techo;               // la de antes
  int res;
  if (techo == s.begin()) {
    res = *techo;
  } else {
    --piso;
    if (techo == s.end() || x - *piso <= *techo - x) {
      res = *piso;
    } else {
      res = *techo;
    }
  }
  return res;
}

// Quita de una vez todas las claves menores que x.
void borrarMenores(set<int> &s, int x) {
  s.erase(s.begin(), s.lower_bound(x));
}

int main() {
  int claves[7] = {30, 9, 57, 4, 22, 41, 15};
  set<int> s(claves, claves + 7);
  printf("s:");
  imprimir(s);
  printf("contarRango(10, 40) = %d\n", contarRango(s, 10, 40));
  printf("contarRango(15, 22) = %d\n", contarRango(s, 15, 22));
  printf("contarRango(42, 56) = %d\n", contarRango(s, 42, 56));
  printf("masCercano(26) = %d\n", masCercano(s, 26));
  printf("masCercano(12) = %d\n", masCercano(s, 12));
  printf("masCercano(1) = %d\n", masCercano(s, 1));
  printf("masCercano(99) = %d\n", masCercano(s, 99));
  borrarMenores(s, 20);
  printf("borrarMenores(20):");
  imprimir(s);
  return 0;
}
