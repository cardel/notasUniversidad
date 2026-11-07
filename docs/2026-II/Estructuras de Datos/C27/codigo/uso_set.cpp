// El contenedor set: cada clave entra una sola vez y sale en orden.
#include <cstdio>
#include <set>
using std::set;

// recorre el set con su iterador: las claves salen de menor a mayor
void imprimir(set<int> &s) {
  set<int>::iterator it = s.begin();
  while (it != s.end()) {
    printf(" %d", *it);
    ++it;
  }
  printf("   size = %d\n", (int) s.size());
}

// count, find y erase sobre la lista de asistencia
void consultar(set<int> &s) {
  printf("count(17) = %d, count(18) = %d\n", (int) s.count(17),
         (int) s.count(18));
  printf("find(63) == end(): %d\n", (int) (s.find(63) == s.end()));
  printf("erase(17) = %d\n", (int) s.erase(17));
  printf("erase(17) = %d\n", (int) s.erase(17));
}

// la menor, la mayor y las primeras claves >= x y > x
void bordes(set<int> &s) {
  printf("menor: %d\n", *s.begin());
  set<int>::iterator ult = s.end();
  --ult;                     // end() queda despues del mayor
  printf("mayor: %d\n", *ult);
  printf("lower_bound(42) = %d\n", *s.lower_bound(42));
  printf("upper_bound(42) = %d\n", *s.upper_bound(42));
  printf("lower_bound(50) = %d\n", *s.lower_bound(50));
  printf("lower_bound(90) == end(): %d\n",
         (int) (s.lower_bound(90) == s.end()));
}

int main() {
  set<int> s;
  int llegan[8] = {42, 17, 88, 17, 5, 63, 42, 30};
  int i = 0;
  while (i < 8) {
    s.insert(llegan[i]);     // los segundos 17 y 42 no entran
    i = i + 1;
  }
  imprimir(s);
  consultar(s);
  imprimir(s);
  bordes(s);
  return 0;
}
