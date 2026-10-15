// Las mismas líneas, pero la biblioteca acumula en un búfer y llama a write pocas veces.
#include <cstdio>

int main() {
  FILE *f = fopen("salida.txt", "w");
  for (int i = 0; i < 200000; i++) {
    fprintf(f, "%d\n", i);
  }
  fclose(f);
  return 0;
}
