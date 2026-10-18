// UVa 11078, Open Credit System: mayor a[i] - a[j] con i < j en un recorrido.
// mayor guarda el maximo de los anteriores a la posicion i.
#include <cstdio>
#include <vector>

using std::vector;

vector<int> pts(100000);

int main() {
  int casos;
  scanf("%d", &casos);
  for (int c = 0; c < casos; c++) {
    int npts;
    scanf("%d", &npts);
    for (int p = 0; p < npts; p++) {
      scanf("%d", &pts[p]);
    }

    int mayor = pts[0];
    int diferencia = pts[0] - pts[1];
    for (int i = 1; i < npts; i++) {
      if (mayor - pts[i] > diferencia) {
        diferencia = mayor - pts[i];
      }
      if (pts[i] > mayor) {
        mayor = pts[i];
      }
    }
    printf("%d\n", diferencia);
  }
  return 0;
}
