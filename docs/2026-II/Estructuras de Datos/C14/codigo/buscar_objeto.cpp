// find sobre objetos: la biblioteca pregunta con == y la clase decide que significa.
#include <cstdio>
#include <vector>
#include <string>
#include <algorithm>
using std::vector;
using std::string;
using std::find;

class Estudiante {
public:
  string nombre;
  double nota;
  Estudiante(string n, double x) {
    nombre = n;
    nota = x;
  }
  // dos estudiantes son el mismo si tienen el mismo nombre
  bool operator==(const Estudiante &otro) const {
    return nombre == otro.nombre;
  }
};

int main() {
  vector<Estudiante> g;
  g.push_back(Estudiante("Sara", 3.8));
  g.push_back(Estudiante("Luis", 4.5));
  g.push_back(Estudiante("Ana", 3.8));
  vector<Estudiante>::iterator it = find(g.begin(), g.end(), Estudiante("Ana", 0));
  if (it != g.end()) {
    printf("Ana esta en la posicion %d con nota %.1f\n", (int) (it - g.begin()), it->nota);
  }
  it = find(g.begin(), g.end(), Estudiante("Juan", 0));
  printf("Juan %s\n", it == g.end() ? "no esta" : "esta");
  return 0;
}
