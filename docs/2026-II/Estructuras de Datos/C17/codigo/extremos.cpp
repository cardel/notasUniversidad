// Que cuesta poner el tope en cada extremo, segun la lista que haya debajo.
// Se cuentan los elementos tocados: los que se corren en el arreglo y los
// nodos que se visitan en la enlazada.
#include <iostream>

using std::cout;
using std::endl;

typedef int Elemento;

const int CAPACIDAD = 20000;

long tocados = 0;

// --- lista sobre arreglo ---------------------------------------------------
struct ListaArreglo {
  Elemento datos[CAPACIDAD];
  int n;
};

void insertarArreglo(ListaArreglo &l, int p, Elemento e) {
  int i = l.n;
  while (i > p) {
    l.datos[i] = l.datos[i - 1];
    i = i - 1;
    tocados = tocados + 1;
  }
  l.datos[p] = e;
  l.n = l.n + 1;
}

void eliminarArreglo(ListaArreglo &l, int p) {
  int i = p;
  while (i < l.n - 1) {
    l.datos[i] = l.datos[i + 1];
    i = i + 1;
    tocados = tocados + 1;
  }
  l.n = l.n - 1;
}

// --- lista enlazada simple -------------------------------------------------
struct Nodo {
  Elemento dato;
  Nodo *siguiente;
};

struct ListaEnlazada {
  Nodo *cabeza;
  int n;
};

void insertarEnlazada(ListaEnlazada &l, int p, Elemento e) {
  Nodo *nuevo = new Nodo;
  nuevo->dato = e;
  if (p == 0) {
    nuevo->siguiente = l.cabeza;
    l.cabeza = nuevo;
  } else {
    Nodo *anterior = l.cabeza;
    int i = 0;
    while (i < p - 1) {
      anterior = anterior->siguiente;
      i = i + 1;
      tocados = tocados + 1;
    }
    nuevo->siguiente = anterior->siguiente;
    anterior->siguiente = nuevo;
  }
  l.n = l.n + 1;
}

void eliminarEnlazada(ListaEnlazada &l, int p) {
  Nodo *muerto;
  if (p == 0) {
    muerto = l.cabeza;
    l.cabeza = l.cabeza->siguiente;
  } else {
    Nodo *anterior = l.cabeza;
    int i = 0;
    while (i < p - 1) {
      anterior = anterior->siguiente;
      i = i + 1;
      tocados = tocados + 1;
    }
    muerto = anterior->siguiente;
    anterior->siguiente = muerto->siguiente;
  }
  delete muerto;
  l.n = l.n - 1;
}

void vaciarEnlazada(ListaEnlazada &l) {
  while (l.cabeza != NULL) {
    Nodo *muerto = l.cabeza;
    l.cabeza = l.cabeza->siguiente;
    delete muerto;
  }
  l.n = 0;
}

// --- las cuatro combinaciones ----------------------------------------------
long arregloAlFrente(int n) {
  ListaArreglo l;
  l.n = 0;
  tocados = 0;
  int k = 0;
  while (k < n) {
    insertarArreglo(l, 0, k);
    k = k + 1;
  }
  k = 0;
  while (k < n) {
    eliminarArreglo(l, 0);
    k = k + 1;
  }
  return tocados;
}

long arregloAlFinal(int n) {
  ListaArreglo l;
  l.n = 0;
  tocados = 0;
  int k = 0;
  while (k < n) {
    insertarArreglo(l, l.n, k);
    k = k + 1;
  }
  k = 0;
  while (k < n) {
    eliminarArreglo(l, l.n - 1);
    k = k + 1;
  }
  return tocados;
}

long enlazadaAlFrente(int n) {
  ListaEnlazada l;
  l.cabeza = NULL;
  l.n = 0;
  tocados = 0;
  int k = 0;
  while (k < n) {
    insertarEnlazada(l, 0, k);
    k = k + 1;
  }
  k = 0;
  while (k < n) {
    eliminarEnlazada(l, 0);
    k = k + 1;
  }
  vaciarEnlazada(l);
  return tocados;
}

long enlazadaAlFinal(int n) {
  ListaEnlazada l;
  l.cabeza = NULL;
  l.n = 0;
  tocados = 0;
  int k = 0;
  while (k < n) {
    insertarEnlazada(l, l.n, k);
    k = k + 1;
  }
  k = 0;
  while (k < n) {
    eliminarEnlazada(l, l.n - 1);
    k = k + 1;
  }
  vaciarEnlazada(l);
  return tocados;
}

int main() {
  cout << "apilar y desapilar n veces, contando elementos tocados" << endl << endl;
  cout << "      n   arreglo/frente   arreglo/final   enlazada/frente   enlazada/final" << endl;
  int tam[3] = {100, 1000, 10000};
  int k = 0;
  while (k < 3) {
    int n = tam[k];
    long a = arregloAlFrente(n);
    long b = arregloAlFinal(n);
    long c = enlazadaAlFrente(n);
    long d = enlazadaAlFinal(n);
    cout << "  " << n << "          " << a << "             " << b
         << "            " << c << "          " << d << endl;
    k = k + 1;
  }
  return 0;
}
