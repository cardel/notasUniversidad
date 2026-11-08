/*
UVa 11695 Flight Planning, version optimizada
Autor: Carlos A Delgado S
Fecha: Noviembre 6 de 2026

Se pelan hojas igual que en la otra version, pero sin recorrer el pedazo para
delimitarlo. Un solo recorrido en profundidad por caso numera el arbol en
preorden y cuenta los tamanos de los subarboles: al quitar el vuelo (a,b) el
pedazo del hijo es su subarbol, se reconoce porque su numero de preorden cae
en el intervalo del hijo, y su cantidad de ciudades ya esta contada. Con eso
los dos pedazos se pelan a la vez, cada uno con su capa y su cuenta de vivos.

Cada vuelo quitado cuesta entonces un barrido del arbol en vez de los cuatro
recorridos de la version con dos amplitudes.
*/

#include <cstdio>

const int MAX = 2505;

int n;
int inicio[MAX + 1], vecino[2 * MAX], cursor[MAX + 1];
int extremoU[MAX], extremoV[MAX];
int gradoBase[MAX], grado[MAX];
int preorden[MAX], entrada[MAX], tamano[MAX], padre[MAX], pila[MAX];
int hojas[MAX], cuantasHojas;
int capa[2][MAX], siguiente[2][MAX], largoCapa[2], largoSiguiente[2];
int vivos[2], vueltas[2], veto[2], radio[2], diametro[2], centro[2];
int hijo, ladoDelHijo;

/* la lista de adyacencia en dos arreglos: los vecinos de v van de
   inicio[v] a inicio[v+1] */
void armarListas() {
  for (int v = 1; v <= n + 1; v++) {
    inicio[v] = 0;
  }
  for (int i = 0; i < n - 1; i++) {
    gradoBase[extremoU[i]]++;
    gradoBase[extremoV[i]]++;
  }
  inicio[1] = 0;
  for (int v = 1; v <= n; v++) {
    inicio[v + 1] = inicio[v] + gradoBase[v];
    cursor[v] = inicio[v];
  }
  for (int i = 0; i < n - 1; i++) {
    vecino[cursor[extremoU[i]]] = extremoV[i];
    cursor[extremoU[i]]++;
    vecino[cursor[extremoV[i]]] = extremoU[i];
    cursor[extremoV[i]]++;
  }
  cuantasHojas = 0;
  for (int v = 1; v <= n; v++) {
    if (gradoBase[v] == 1) {
      hojas[cuantasHojas] = v;
      cuantasHojas++;
    }
  }
}

/* numera el arbol en preorden y cuenta el tamano de cada subarbol */
void numerar() {
  int cima = 0, k = 0;
  padre[1] = 0;
  pila[cima] = 1;
  cima++;
  while (cima > 0) {
    cima--;
    int v = pila[cima];
    entrada[v] = k;
    preorden[k] = v;
    k++;
    for (int i = inicio[v]; i < inicio[v + 1]; i++) {
      int w = vecino[i];
      if (w != padre[v]) {
        padre[w] = v;
        pila[cima] = w;
        cima++;
      }
    }
  }
  for (int v = 1; v <= n; v++) {
    tamano[v] = 1;
  }
  for (int i = n - 1; i > 0; i--) {
    int v = preorden[i];
    tamano[padre[v]] += tamano[v];
  }
}

int lado(int v) {
  int l = 1 - ladoDelHijo;
  if (entrada[hijo] <= entrada[v] && entrada[v] < entrada[hijo] + tamano[hijo]) {
    l = ladoDelHijo;
  }
  return l;
}

/* radio, diametro y un centro de los dos pedazos que deja quitar (a,b) */
void medir(int a, int b) {
  hijo = b;
  ladoDelHijo = 1;
  if (padre[a] == b) {
    hijo = a;
    ladoDelHijo = 0;
  }
  for (int v = 1; v <= n; v++) {
    grado[v] = gradoBase[v];
  }
  grado[a]--;
  grado[b]--;
  largoCapa[0] = 0;
  largoCapa[1] = 0;
  for (int i = 0; i < cuantasHojas; i++) {
    int l = lado(hojas[i]);
    capa[l][largoCapa[l]] = hojas[i];
    largoCapa[l]++;
  }
  if (gradoBase[a] == 2) {
    int l = lado(a);
    capa[l][largoCapa[l]] = a;
    largoCapa[l]++;
  }
  if (gradoBase[b] == 2) {
    int l = lado(b);
    capa[l][largoCapa[l]] = b;
    largoCapa[l]++;
  }
  vivos[ladoDelHijo] = tamano[hijo];
  vivos[1 - ladoDelHijo] = n - tamano[hijo];
  veto[0] = b;
  veto[1] = a;
  for (int l = 0; l < 2; l++) {
    vueltas[l] = 0;
    while (vivos[l] > 2) {
      largoSiguiente[l] = 0;
      for (int i = 0; i < largoCapa[l]; i++) {
        int v = capa[l][i];
        for (int j = inicio[v]; j < inicio[v + 1]; j++) {
          int u = vecino[j];
          if (u != veto[l] && grado[u] > 0) {
            grado[u]--;
            if (grado[u] == 1) {
              siguiente[l][largoSiguiente[l]] = u;
              largoSiguiente[l]++;
            }
          }
        }
        grado[v] = 0;
      }
      vivos[l] = vivos[l] - largoCapa[l];
      largoCapa[l] = largoSiguiente[l];
      for (int i = 0; i < largoCapa[l]; i++) {
        capa[l][i] = siguiente[l][i];
      }
      vueltas[l]++;
    }
    radio[l] = vueltas[l];
    diametro[l] = 2 * vueltas[l];
    if (largoCapa[l] == 2) {
      radio[l] = vueltas[l] + 1;
      diametro[l] = 2 * vueltas[l] + 1;
    }
    centro[l] = capa[l][0];
  }
}

int main() {
  int casos;
  scanf("%d", &casos);
  for (int caso = 0; caso < casos; caso++) {
    scanf("%d", &n);
    for (int v = 1; v <= n; v++) {
      gradoBase[v] = 0;
    }
    for (int i = 0; i < n - 1; i++) {
      scanf("%d %d", &extremoU[i], &extremoV[i]);
    }
    armarListas();
    numerar();
    int mejor = -1, quitaU = 0, quitaV = 0, poneU = 0, poneV = 0;
    for (int i = 0; i < n - 1; i++) {
      medir(extremoU[i], extremoV[i]);
      int nuevo = radio[0] + radio[1] + 1;
      if (diametro[0] > nuevo) { nuevo = diametro[0]; }
      if (diametro[1] > nuevo) { nuevo = diametro[1]; }
      if (mejor == -1 || nuevo < mejor) {
        mejor = nuevo;
        quitaU = extremoU[i];
        quitaV = extremoV[i];
        poneU = centro[0];
        poneV = centro[1];
      }
    }
    printf("%d\n%d %d\n%d %d\n", mejor, quitaU, quitaV, poneU, poneV);
  }
  return 0;
}
