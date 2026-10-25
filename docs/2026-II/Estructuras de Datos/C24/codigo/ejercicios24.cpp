// Ejercicios de recursion sobre arboles binarios de busqueda.
#include <cstdio>
#include <climits>
#include "abb.h"

// Compara cada nodo solo con sus hijos inmediatos: el arbol falso la engana.
bool esABBHijos(Nodo *r) {
  bool res = true;
  if (r != NULL) {
    if (r->izq != NULL && r->izq->dato >= r->dato) {
      res = false;
    } else if (r->der != NULL && r->der->dato <= r->dato) {
      res = false;
    } else {
      res = esABBHijos(r->izq) && esABBHijos(r->der);
    }
  }
  return res;
}

// Cada clave de r debe quedar estrictamente entre min y max. Al bajar a
// la izquierda el dato pasa a ser el nuevo max; a la derecha, el nuevo min.
bool esABB(Nodo *r, long long min, long long max) {
  bool res = true;
  if (r != NULL) {
    res = min < r->dato && r->dato < max
          && esABB(r->izq, min, r->dato) && esABB(r->der, r->dato, max);
  }
  return res;
}

// k-esima clave menor (k desde 1), o NULL si hay menos de k claves.
// vistos cuenta las claves que el inorden ya visito.
Nodo *kEsimo(Nodo *r, int k, int &vistos) {
  Nodo *res = NULL;
  if (r != NULL) {
    res = kEsimo(r->izq, k, vistos);
    if (res == NULL) {
      vistos = vistos + 1;
      if (vistos == k) {
        res = r;
      } else {
        res = kEsimo(r->der, k, vistos);
      }
    }
  }
  return res;
}

// El mismo k-esimo con la pila de inordenPila: se cuenta cada nodo al
// sacarlo y el ciclo termina en cuanto aparece el k-esimo.
Nodo *kEsimoPila(Nodo *r, int k) {
  Pila p;
  Nodo *res = NULL;
  Nodo *actual = r;
  int vistos = 0;
  while (res == NULL && (actual != NULL || !p.vacia())) {
    if (actual != NULL) {
      p.apilar(actual);
      actual = actual->izq;
    } else {
      actual = p.tope();
      p.desapilar();
      vistos = vistos + 1;
      if (vistos == k) {
        res = actual;
      }
      actual = actual->der;
    }
  }
  return res;
}

// Claves en [a, b]. Si el dato es menor que a, a la izquierda no hay
// nada que contar; si es mayor que b, a la derecha tampoco.
int contarRango(Nodo *r, int a, int b) {
  int res = 0;
  if (r != NULL) {
    if (r->dato < a) {
      res = contarRango(r->der, a, b);
    } else if (r->dato > b) {
      res = contarRango(r->izq, a, b);
    } else {
      res = 1 + contarRango(r->izq, a, b) + contarRango(r->der, a, b);
    }
  }
  return res;
}

// ABB de altura minima con a[ini..fin], que viene ordenado:
// el del medio es la raiz y cada mitad, un subarbol.
Nodo *construirBalanceado(int a[], int ini, int fin) {
  Nodo *res = NULL;
  if (ini <= fin) {
    int medio = (ini + fin) / 2;
    res = crearNodo(a[medio], construirBalanceado(a, ini, medio - 1),
                    construirBalanceado(a, medio + 1, fin));
  }
  return res;
}

// Nodo con la mayor clave <= x, o NULL si no hay.
Nodo *piso(Nodo *r, int x) {
  Nodo *res = NULL;
  if (r != NULL) {
    if (r->dato == x) {
      res = r;
    } else if (x < r->dato) {
      res = piso(r->izq, x);
    } else {
      res = piso(r->der, x);   // algo mayor que r->dato y <= x
      if (res == NULL) {
        res = r;
      }
    }
  }
  return res;
}

// Nodo con la menor clave >= x, o NULL si no hay.
Nodo *techo(Nodo *r, int x) {
  Nodo *res = NULL;
  if (r != NULL) {
    if (r->dato == x) {
      res = r;
    } else if (x > r->dato) {
      res = techo(r->der, x);
    } else {
      res = techo(r->izq, x);  // algo menor que r->dato y >= x
      if (res == NULL) {
        res = r;
      }
    }
  }
  return res;
}

// Imprime la clave del nodo, o "ninguno" si es NULL.
void imprimirClave(Nodo *x) {
  if (x == NULL) {
    printf("ninguno");
  } else {
    printf("%d", x->dato);
  }
}

int main() {
  int claves[9] = {8, 3, 10, 1, 6, 14, 4, 7, 13};
  Nodo *raiz = NULL;
  int i = 0;
  while (i < 9) {
    raiz = insertar(raiz, claves[i]);
    i = i + 1;
  }
  long long sinMin = (long long) INT_MIN - 1;
  long long sinMax = (long long) INT_MAX + 1;

  // 9 es mayor que su padre 3, pero esta a la izquierda de 8
  Nodo *falso = crearNodo(8, crearNodo(3, crearNodo(1, NULL, NULL), crearNodo(9, NULL, NULL)),
                          crearNodo(10, NULL, NULL));
  printf("esABBHijos(falso): %s\n", esABBHijos(falso) ? "si" : "no");
  printf("esABB(abb): %s\n", esABB(raiz, sinMin, sinMax) ? "si" : "no");
  printf("esABB(falso): %s\n", esABB(falso, sinMin, sinMax) ? "si" : "no");

  int k = 1;
  printf("kEsimo, k = 1..10: ");
  while (k <= 10) {
    int vistos = 0;
    imprimirClave(kEsimo(raiz, k, vistos));
    printf(" ");
    k = k + 1;
  }
  printf("\n");
  k = 1;
  printf("kEsimoPila, k = 1..10: ");
  while (k <= 10) {
    imprimirClave(kEsimoPila(raiz, k));
    printf(" ");
    k = k + 1;
  }
  printf("\n");

  printf("contarRango(4, 10): %d\n", contarRango(raiz, 4, 10));
  printf("contarRango(11, 12): %d\n", contarRango(raiz, 11, 12));
  printf("contarRango(0, 100): %d\n", contarRango(raiz, 0, 100));

  int orden[9] = {1, 3, 4, 6, 7, 8, 10, 13, 14};
  Nodo *bal = construirBalanceado(orden, 0, 8);
  printf("balanceado: preorden ");
  preorden(bal);
  printf("| altura %d, esABB: %s\n", altura(bal), esABB(bal, sinMin, sinMax) ? "si" : "no");

  int xs[6] = {5, 8, 0, 20, 12, 2};
  i = 0;
  while (i < 6) {
    printf("x = %d: piso ", xs[i]);
    imprimirClave(piso(raiz, xs[i]));
    printf(", techo ");
    imprimirClave(techo(raiz, xs[i]));
    printf("\n");
    i = i + 1;
  }

  liberar(raiz);
  liberar(falso);
  liberar(bal);
  return 0;
}
