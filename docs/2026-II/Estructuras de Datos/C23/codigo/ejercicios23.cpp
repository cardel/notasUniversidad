// Ejercicios de recursion sobre arboles binarios, probados sobre el arbol de ejemplo.
#include <cstdio>
#include <cassert>
#include "arbol_binario.h"

// Raiz 8, con hijos 3 y 10; 3 tiene hijos 1 y 6; 6 tiene hijos 4 y 7;
// 10 solo tiene hijo derecho, 14.
Nodo *ejemplo() {
  Nodo *seis = crearNodo(6, crearNodo(4, NULL, NULL), crearNodo(7, NULL, NULL));
  Nodo *tres = crearNodo(3, crearNodo(1, NULL, NULL), seis);
  Nodo *diez = crearNodo(10, NULL, crearNodo(14, NULL, NULL));
  return crearNodo(8, tres, diez);
}

// Una hoja cuenta 1; un nodo interno, lo que cuenten sus dos subarboles.
int contarHojas(Nodo *r) {
  int res = 0;
  if (r != NULL) {
    if (r->izq == NULL && r->der == NULL) {
      res = 1;
    } else {
      res = contarHojas(r->izq) + contarHojas(r->der);
    }
  }
  return res;
}

int sumar(Nodo *r) {
  int res = 0;
  if (r != NULL) {
    res = r->dato + sumar(r->izq) + sumar(r->der);
  }
  return res;
}

// exige r != NULL; solo baja a los subarboles que no son vacios
int maximo(Nodo *r) {
  assert(r != NULL);
  int res = r->dato;
  if (r->izq != NULL) {
    int mi = maximo(r->izq);
    if (mi > res) {
      res = mi;
    }
  }
  if (r->der != NULL) {
    int md = maximo(r->der);
    if (md > res) {
      res = md;
    }
  }
  return res;
}

// Nodos a profundidad k: el nivel k de r es el nivel k - 1 de sus hijos.
int contarNivel(Nodo *r, int k) {
  int res = 0;
  if (r != NULL) {
    if (k == 0) {
      res = 1;
    } else {
      res = contarNivel(r->izq, k - 1) + contarNivel(r->der, k - 1);
    }
  }
  return res;
}

// Intercambia los hijos de cada nodo, sin crear nodos nuevos.
void espejo(Nodo *r) {
  if (r != NULL) {
    Nodo *temp = r->izq;
    r->izq = r->der;
    r->der = temp;
    espejo(r->izq);
    espejo(r->der);
  }
}

// Misma forma y mismos datos en la misma posicion.
bool iguales(Nodo *a, Nodo *b) {
  bool res = false;
  if (a == NULL && b == NULL) {
    res = true;
  } else if (a != NULL && b != NULL) {
    res = a->dato == b->dato && iguales(a->izq, b->izq) && iguales(a->der, b->der);
  }
  return res;
}

int main() {
  Nodo *a = ejemplo();
  Nodo *b = ejemplo();

  printf("hojas: %d\n", contarHojas(a));
  printf("suma: %d\n", sumar(a));
  printf("maximo: %d\n", maximo(a));
  int k = 0;
  while (k <= 4) {
    printf("nodos en el nivel %d: %d\n", k, contarNivel(a, k));
    k = k + 1;
  }
  printf("hojas del vacio: %d, suma del vacio: %d\n", contarHojas(NULL), sumar(NULL));

  printf("iguales(a, b): %s\n", iguales(a, b) ? "si" : "no");
  espejo(b);
  printf("preorden del espejo: ");
  preorden(b);
  printf("\ninorden del espejo: ");
  inorden(b);
  printf("\niguales(a, espejo): %s\n", iguales(a, b) ? "si" : "no");
  espejo(b);
  printf("espejo del espejo, iguales(a, b): %s\n", iguales(a, b) ? "si" : "no");
  printf("iguales(vacio, vacio): %s\n", iguales(NULL, NULL) ? "si" : "no");

  Nodo *c = ejemplo();          // 14 pasa a ser hijo izquierdo de 10
  c->der->izq = c->der->der;
  c->der->der = NULL;
  printf("preorden de c: ");
  preorden(c);
  printf("\niguales(a, c): %s\n", iguales(a, c) ? "si" : "no");

  liberar(a);
  liberar(b);
  liberar(c);
  return 0;
}
