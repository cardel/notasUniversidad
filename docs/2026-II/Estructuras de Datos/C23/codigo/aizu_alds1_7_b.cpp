// Aizu ALDS1_7_B - Binary Trees: se enlazan los nodos de la tabla y se guarda
// el padre de cada id. La profundidad baja de la raiz a los hijos (d + 1) y la
// altura sube de los hijos al padre (la funcion altura del arbol). Profundidades
// en Theta(n); la altura de cada nodo recorre su subarbol, O(n^2) en total, con n <= 25.
#include <cstdio>
#include "arbol_binario.h"

const int MAX_NODOS = 25;

Nodo *nodos[MAX_NODOS];   // nodos[id]: el nodo con ese id
int padre[MAX_NODOS];     // padre[id]: id del padre, -1 en la raiz
int prof[MAX_NODOS];      // prof[id]: aristas de la raiz al nodo

// Lee las n lineas, cuelga cada hijo de su padre y devuelve la raiz.
Nodo *leerArbol(int n) {
  int i = 0;
  while (i < n) {
    nodos[i] = crearNodo(i, NULL, NULL);
    padre[i] = -1;
    i = i + 1;
  }
  i = 0;
  while (i < n) {
    int id, izq, der;
    scanf("%d %d %d", &id, &izq, &der);
    if (izq != -1) {
      nodos[id]->izq = nodos[izq];
      padre[izq] = id;
    }
    if (der != -1) {
      nodos[id]->der = nodos[der];
      padre[der] = id;
    }
    i = i + 1;
  }
  int raiz = 0;
  i = 0;
  while (i < n) {
    if (padre[i] == -1) {
      raiz = i;
    }
    i = i + 1;
  }
  return nodos[raiz];
}

// El nodo r esta a profundidad d; sus hijos, a d + 1.
void profundidades(Nodo *r, int d) {
  if (r != NULL) {
    prof[r->dato] = d;
    profundidades(r->izq, d + 1);
    profundidades(r->der, d + 1);
  }
}

// Id de un nodo, o -1 si es el arbol vacio.
int idDe(Nodo *r) {
  int res = -1;
  if (r != NULL) {
    res = r->dato;
  }
  return res;
}

// El otro hijo del padre de id, o -1 si no lo hay.
int hermano(int id) {
  int res = -1;
  int p = padre[id];
  if (p != -1) {
    if (nodos[p]->izq == nodos[id]) {
      res = idDe(nodos[p]->der);
    } else {
      res = idDe(nodos[p]->izq);
    }
  }
  return res;
}

// Hijos que no son el arbol vacio.
int grado(Nodo *r) {
  int res = 0;
  if (r->izq != NULL) {
    res = res + 1;
  }
  if (r->der != NULL) {
    res = res + 1;
  }
  return res;
}

int main() {
  int n;
  scanf("%d", &n);
  Nodo *raiz = leerArbol(n);
  profundidades(raiz, 0);
  int id = 0;
  while (id < n) {
    int g = grado(nodos[id]);
    printf("node %d: parent = %d, sibling = %d, degree = %d, depth = %d, height = %d, ",
           id, padre[id], hermano(id), g, prof[id], altura(nodos[id]));
    if (padre[id] == -1) {
      printf("root\n");
    } else if (g == 0) {
      printf("leaf\n");
    } else {
      printf("internal node\n");
    }
    id = id + 1;
  }
  liberar(raiz);
  return 0;
}
