// Construir un montículo de máximos sobre un arreglo cualquiera y ordenar
// con él, sin arreglo auxiliar. Índices desde 0, como en monticulo.h.
#include <cstdio>
#include <vector>
using std::vector;

// Cuenta los intercambios, para comparar los dos caminos de construir.
long long intercambios = 0;

void intercambiar(vector<int> &a, int i, int j) {
  int aux = a[i];
  a[i] = a[j];
  a[j] = aux;
  intercambios = intercambios + 1;
}

// Sube la clave de i mientras sea mayor que la de su padre.
void subir(vector<int> &a, int i) {
  while (i > 0 && a[(i - 1) / 2] < a[i]) {
    intercambiar(a, i, (i - 1) / 2);
    i = (i - 1) / 2;
  }
}

// Baja la clave de i dentro de a[0..n-1].
void bajar(vector<int> &a, int n, int i) {
  bool sigue = true;
  while (sigue) {
    int izq = 2 * i + 1;
    int der = 2 * i + 2;
    int mayor = i;
    if (izq < n && a[izq] > a[mayor]) {
      mayor = izq;
    }
    if (der < n && a[der] > a[mayor]) {
      mayor = der;
    }
    if (mayor != i) {
      intercambiar(a, i, mayor);
      i = mayor;
    } else {
      sigue = false;
    }
  }
}

// Versión ingenua: inserta las claves una por una.
void construirSubiendo(vector<int> &a) {
  int i = 1;
  while (i < (int) a.size()) {
    subir(a, i);
    i = i + 1;
  }
}

// Convierte un arreglo cualquiera en montículo de máximos.
void construir(vector<int> &a) {
  int n = (int) a.size();
  int i = n / 2 - 1;
  while (i >= 0) {
    bajar(a, n, i);
    i = i - 1;
  }
}

// Ordena de menor a mayor sin arreglo auxiliar.
void heapsort(vector<int> &a) {
  construir(a);
  int fin = (int) a.size() - 1;
  while (fin > 0) {
    intercambiar(a, 0, fin);
    bajar(a, fin, 0);
    fin = fin - 1;
  }
}

// Error: baja la nueva raíz sobre todo el arreglo.
void heapsortSinAcortar(vector<int> &a) {
  construir(a);
  int n = (int) a.size();
  int fin = n - 1;
  while (fin > 0) {
    intercambiar(a, 0, fin);
    bajar(a, n, 0);
    fin = fin - 1;
  }
}

void imprimir(vector<int> &a) {
  int i = 0;
  while (i < (int) a.size()) {
    printf(" %d", a[i]);
    i = i + 1;
  }
  printf("\n");
}

// Un arreglo con las claves 1, 2, ..., n en orden creciente.
vector<int> creciente(int n) {
  vector<int> a;
  int k = 1;
  while (k <= n) {
    a.push_back(k);
    k = k + 1;
  }
  return a;
}

// La traza de construir: el arreglo después de cada llamado a bajar.
void trazaConstruir() {
  int claves[9] = {16, 44, 13, 58, 37, 92, 75, 11, 64};
  vector<int> a(claves, claves + 9);
  printf("arreglo:          ");
  imprimir(a);
  int n = (int) a.size();
  int i = n / 2 - 1;
  intercambios = 0;
  while (i >= 0) {
    bajar(a, n, i);
    printf("tras bajar(%d):    ", i);
    imprimir(a);
    i = i - 1;
  }
  printf("intercambios: %lld\n", intercambios);
  vector<int> b(claves, claves + 9);
  intercambios = 0;
  construirSubiendo(b);
  printf("subiendo:         ");
  imprimir(b);
  printf("intercambios: %lld\n", intercambios);
}

// El peor caso de los dos caminos: las claves llegan en orden creciente.
void peorCaso(int n) {
  vector<int> a = creciente(n);
  intercambios = 0;
  construir(a);
  long long conBajar = intercambios;
  vector<int> b = creciente(n);
  intercambios = 0;
  construirSubiendo(b);
  printf("n = %d: construir %lld, subiendo %lld\n", n, conBajar, intercambios);
}

// La traza de heapsort: el arreglo después de cada ronda.
void trazaHeapsort() {
  int claves[6] = {24, 57, 34, 68, 15, 46};
  vector<int> a(claves, claves + 6);
  construir(a);
  printf("montículo:        ");
  imprimir(a);
  int fin = (int) a.size() - 1;
  while (fin > 0) {
    intercambiar(a, 0, fin);
    bajar(a, fin, 0);
    printf("ronda fin = %d:    ", fin);
    imprimir(a);
    fin = fin - 1;
  }
  vector<int> b(claves, claves + 6);
  heapsortSinAcortar(b);
  printf("sin acortar:      ");
  imprimir(b);
}

int main() {
  trazaConstruir();
  peorCaso(31);
  peorCaso(1048575);
  trazaHeapsort();
  return 0;
}
