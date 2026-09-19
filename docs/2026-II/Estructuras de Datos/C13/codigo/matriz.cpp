// Un vector de vectores como matriz de 3 filas y 4 columnas.
#include <cstdio>
#include <vector>
// cada nombre de la biblioteca vive en el espacio std: se trae solo lo que se usa
using std::vector;

int main() {
  vector<vector<int> > m(3, vector<int>(4, 0));
  int i = 0;
  while (i < 3) {
    int j = 0;
    while (j < 4) {
      m[i][j] = i * 4 + j;
      j = j + 1;
    }
    i = i + 1;
  }
  m[1].push_back(99);
  i = 0;
  while (i < 3) {
    int j = 0;
    while (j < (int) m[i].size()) {
      printf("%3d", m[i][j]);
      j = j + 1;
    }
    printf("\n");
    i = i + 1;
  }
  return 0;
}
