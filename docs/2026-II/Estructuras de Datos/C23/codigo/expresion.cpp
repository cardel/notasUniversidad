// Arbol de la expresion (3 + 4) * (5 - 2): los tres recorridos dan las
// notaciones prefija, infija y postfija, y el posorden la evalua.
// En una hoja, dato es un numero; en un nodo interno, el caracter del operador.
#include <cstdio>
#include "arbol_binario.h"

// Exige r != NULL.
bool esHoja(Nodo *r) {
  return r->izq == NULL && r->der == NULL;
}

// Imprime un nodo: el numero si es hoja, el operador si no.
void imprimirNodo(Nodo *r) {
  if (esHoja(r)) {
    printf("%d ", r->dato);
  } else {
    printf("%c ", r->dato);
  }
}

// Preorden: el operador antes que sus operandos.
void prefija(Nodo *r) {
  if (r != NULL) {
    imprimirNodo(r);
    prefija(r->izq);
    prefija(r->der);
  }
}

// Inorden con un parentesis alrededor de cada operacion. Exige r != NULL.
void infija(Nodo *r) {
  if (esHoja(r)) {
    printf("%d", r->dato);
  } else {
    printf("(");
    infija(r->izq);
    printf(" %c ", r->dato);
    infija(r->der);
    printf(")");
  }
}

// Posorden: los operandos antes que su operador.
void postfija(Nodo *r) {
  if (r != NULL) {
    postfija(r->izq);
    postfija(r->der);
    imprimirNodo(r);
  }
}

// Posorden: se evaluan los dos operandos y despues se opera. Exige r != NULL.
int evaluar(Nodo *r) {
  int res = r->dato;
  if (!esHoja(r)) {
    int a = evaluar(r->izq);
    int b = evaluar(r->der);
    if (r->dato == '+') {
      res = a + b;
    } else if (r->dato == '-') {
      res = a - b;
    } else if (r->dato == '*') {
      res = a * b;
    } else {
      res = a / b;
    }
  }
  return res;
}

int main() {
  Nodo *suma = crearNodo('+', crearNodo(3, NULL, NULL), crearNodo(4, NULL, NULL));
  Nodo *resta = crearNodo('-', crearNodo(5, NULL, NULL), crearNodo(2, NULL, NULL));
  Nodo *raiz = crearNodo('*', suma, resta);

  printf("prefija:  ");
  prefija(raiz);
  printf("\ninfija:   ");
  infija(raiz);
  printf("\npostfija: ");
  postfija(raiz);
  printf("\nvalor:    %d\n", evaluar(raiz));

  liberar(raiz);
  return 0;
}
