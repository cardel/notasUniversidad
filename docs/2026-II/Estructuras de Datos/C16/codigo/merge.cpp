// Merge sort sobre la lista enlazada: se reescriben punteros, no se copian datos.
#include <iostream>

using std::cout;
using std::endl;

typedef int Elemento;

struct Nodo {
  Elemento dato;
  Nodo *siguiente;
};

long comparaciones = 0;

// Parte la cadena en dos mitades y devuelve la cabeza de la segunda.
// El puntero rapido avanza al doble: cuando llega al final, el lento va por la mitad.
Nodo *partir(Nodo *cabeza) {
  Nodo *lento = cabeza;
  Nodo *rapido = cabeza->siguiente;
  while (rapido != NULL && rapido->siguiente != NULL) {
    lento = lento->siguiente;
    rapido = rapido->siguiente->siguiente;
  }
  Nodo *segunda = lento->siguiente;
  lento->siguiente = NULL;
  return segunda;
}

// Mezcla dos cadenas ya ordenadas empalmando nodos. No reserva ni copia datos.
Nodo *mezclar(Nodo *a, Nodo *b) {
  Nodo guia;
  guia.dato = 0;
  guia.siguiente = NULL;
  Nodo *cola = &guia;
  while (a != NULL && b != NULL) {
    comparaciones = comparaciones + 1;
    if (a->dato <= b->dato) {
      cola->siguiente = a;
      a = a->siguiente;
    } else {
      cola->siguiente = b;
      b = b->siguiente;
    }
    cola = cola->siguiente;
  }
  if (a != NULL) {
    cola->siguiente = a;
  } else {
    cola->siguiente = b;
  }
  return guia.siguiente;
}

// Una lista de cero o un nodo ya esta ordenada.
Nodo *ordenar(Nodo *cabeza) {
  if (cabeza != NULL && cabeza->siguiente != NULL) {
    Nodo *segunda = partir(cabeza);
    cabeza = mezclar(ordenar(cabeza), ordenar(segunda));
  }
  return cabeza;
}

Nodo *armar(const Elemento v[], int n) {
  Nodo *cabeza = NULL;
  int i = n;
  while (i > 0) {
    i = i - 1;
    Nodo *nuevo = new Nodo;
    nuevo->dato = v[i];
    nuevo->siguiente = cabeza;
    cabeza = nuevo;
  }
  return cabeza;
}

void imprimir(Nodo *cabeza) {
  Nodo *actual = cabeza;
  while (actual != NULL) {
    cout << actual->dato << " ";
    actual = actual->siguiente;
  }
  cout << endl;
}

void liberar(Nodo *cabeza) {
  while (cabeza != NULL) {
    Nodo *muerto = cabeza;
    cabeza = cabeza->siguiente;
    delete muerto;
  }
}

int main() {
  Elemento v[8] = {6, 2, 9, 4, 1, 7, 3, 8};
  Nodo *l = armar(v, 8);
  cout << "antes:   ";
  imprimir(l);
  comparaciones = 0;
  l = ordenar(l);
  cout << "despues: ";
  imprimir(l);
  cout << "comparaciones con n = 8: " << comparaciones << endl;
  liberar(l);

  cout << endl << "como crecen las comparaciones:" << endl;
  int tam[4] = {8, 64, 512, 1024};
  int k = 0;
  while (k < 4) {
    int n = tam[k];
    Elemento *w = new Elemento[n];
    int i = 0;
    while (i < n) {
      w[i] = (i * 37 + 11) % n;      // una permutacion mezclada
      i = i + 1;
    }
    Nodo *c = armar(w, n);
    comparaciones = 0;
    c = ordenar(c);
    int techo = 0;
    int p = 1;
    while (p < n) {
      p = p * 2;
      techo = techo + 1;
    }
    cout << "  n = " << n << ": " << comparaciones
         << " comparaciones,  n*log2(n) = " << (long)n * techo << endl;
    liberar(c);
    delete[] w;
    k = k + 1;
  }
  return 0;
}
