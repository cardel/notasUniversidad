// UVa 10295 - Hay Points: el diccionario es un map<string, double> y se consulta con find. O((m + w) log m).
#include <cstdio>
#include <cstring>
#include <map>
#include <string>
using std::map;
using std::string;

int main() {
  int m, n;
  scanf("%d %d", &m, &n);
  map<string, double> valor;
  char pal[1005];
  int i = 0;
  while (i < m) {
    double v;
    scanf("%s %lf", pal, &v);
    valor[string(pal)] = v;
    i = i + 1;
  }
  i = 0;
  while (i < n) {
    double total = 0;
    scanf("%s", pal);
    while (strcmp(pal, ".") != 0) {
      map<string, double>::iterator it = valor.find(string(pal));   // find no inserta
      if (it != valor.end()) {
        total = total + it->second;
      }
      scanf("%s", pal);
    }
    printf("%.0f\n", total);
    i = i + 1;
  }
  return 0;
}
