// Que pasa al leer fuera del rango: [] no vigila, at si.
#include <cstdio>
#include <vector>
// cada nombre de la biblioteca vive en el espacio std: se trae solo lo que se usa
using std::vector;

int main() {
  vector<int> v;
  v.push_back(7);
  v.push_back(2);
  printf("v.at(1) = %d\n", v.at(1));
  printf("v.at(5) = %d\n", v.at(5));
  printf("esta linea no se alcanza\n");
  return 0;
}
