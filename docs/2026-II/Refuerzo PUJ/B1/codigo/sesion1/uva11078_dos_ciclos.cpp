// UVa 11078, Open Credit System: la forma directa, con dos ciclos.
// Revisa todas las parejas i < j en O(n^2); con n = 100000 no alcanza el tiempo.
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
    int diferencia = pts[0] - pts[1];
    for (int i = 0; i < npts - 1; i++) {
      for (int j = i + 1; j < npts; j++) {
        if (pts[i] - pts[j] > diferencia) {
          diferencia = pts[i] - pts[j];
        }
      }
    }
    printf("%d\n", diferencia);
  }
  return 0;
}
