// UVa 10905 - Children's Game: p va antes que q si p seguido de q
// forma un numero mayor que q seguido de p. Se ordena con quicksort.
#include <cstdio>
#include <cstring>

const int MAX_N = 50;
const int MAX_LARGO = 1000;

char numero[MAX_N][MAX_LARGO + 1];  // los numeros, como texto
int orden[MAX_N];                   // indices de los numeros, se ordenan estos

// Copia el texto de origen en destino a partir de la posicion desde y
// devuelve la posicion siguiente al ultimo caracter copiado.
int copiar(char destino[], int desde, const char origen[]) {
  int k = 0;
  while (origen[k] != '\0') {
    destino[desde + k] = origen[k];
    k = k + 1;
  }
  destino[desde + k] = '\0';
  return desde + k;
}

// Verdadero si el numero p va estrictamente antes que el numero q.
bool vaAntes(int p, int q) {
  char pq[2 * MAX_LARGO + 1];
  char qp[2 * MAX_LARGO + 1];
  copiar(pq, copiar(pq, 0, numero[p]), numero[q]);
  copiar(qp, copiar(qp, 0, numero[q]), numero[p]);
  return strcmp(pq, qp) > 0;
}

void intercambiar(int a[], int p, int q) {
  int temp = a[p];
  a[p] = a[q];
  a[q] = temp;
}

int particionar(int a[], int ini, int fin) {
  int x = a[fin];
  int i = ini - 1;
  int j = ini;
  while (j < fin) {
    if (!vaAntes(x, a[j])) {
      i = i + 1;
      intercambiar(a, i, j);
    }
    j = j + 1;
  }
  intercambiar(a, i + 1, fin);
  return i + 1;
}

void quicksort(int a[], int ini, int fin) {
  if (ini < fin) {
    int q = particionar(a, ini, fin);
    quicksort(a, ini, q - 1);
    quicksort(a, q + 1, fin);
  }
}

int main() {
  int n;
  scanf("%d", &n);
  while (n != 0) {
    int i = 0;
    while (i < n) {
      scanf("%s", numero[i]);
      orden[i] = i;
      i = i + 1;
    }
    quicksort(orden, 0, n - 1);
    i = 0;
    while (i < n) {
      printf("%s", numero[orden[i]]);
      i = i + 1;
    }
    printf("\n");
    scanf("%d", &n);
  }
  return 0;
}
