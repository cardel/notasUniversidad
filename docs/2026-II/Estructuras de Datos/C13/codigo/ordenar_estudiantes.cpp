// sort con un criterio propio: por nota de mayor a menor, y por nombre en empate.
#include <cstdio>
#include <vector>
#include <string>
#include <algorithm>
// cada nombre de la biblioteca vive en el espacio std: se trae solo lo que se usa
using std::vector;
using std::string;
using std::sort;

class Estudiante {
public:
  string nombre;
  double nota;
  Estudiante(string n, double x) {
    nombre = n;
    nota = x;
  }
};

// dice si a debe ir antes que b
bool antes(Estudiante a, Estudiante b) {
  bool r = false;
  if (a.nota != b.nota) {
    r = a.nota > b.nota;
  } else {
    r = a.nombre < b.nombre;
  }
  return r;
}

int main() {
  vector<Estudiante> g;
  g.push_back(Estudiante("Sara", 3.8));
  g.push_back(Estudiante("Luis", 4.5));
  g.push_back(Estudiante("Ana", 3.8));
  g.push_back(Estudiante("Juan", 4.1));
  sort(g.begin(), g.end(), antes);
  int i = 0;
  while (i < (int) g.size()) {
    printf("%-5s %.1f\n", g[i].nombre.c_str(), g[i].nota);
    i = i + 1;
  }
  return 0;
}
