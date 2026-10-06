// Una cola entra por un extremo y sale por el otro. Que lista aguanta las dos.
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

// --- lista enlazada, con y sin puntero al ultimo ----------------------------
struct Nodo {
  Elemento dato;
  Nodo *siguiente;
};

struct ListaEnlazada {
  Nodo *cabeza;
  Nodo *ultimo;     // solo lo usa la version que lo mantiene
  int n;
};

void agregarCaminando(ListaEnlazada &l, Elemento e) {
  Nodo *nuevo = new Nodo;
  nuevo->dato = e;
  nuevo->siguiente = NULL;
  if (l.cabeza == NULL) {
    l.cabeza = nuevo;
  } else {
    Nodo *actual = l.cabeza;
    while (actual->siguiente != NULL) {
      actual = actual->siguiente;
      tocados = tocados + 1;
    }
    actual->siguiente = nuevo;
  }
  l.n = l.n + 1;
}

void agregarConUltimo(ListaEnlazada &l, Elemento e) {
  Nodo *nuevo = new Nodo;
  nuevo->dato = e;
  nuevo->siguiente = NULL;
  if (l.cabeza == NULL) {
    l.cabeza = nuevo;
  } else {
    l.ultimo->siguiente = nuevo;
  }
  l.ultimo = nuevo;
  l.n = l.n + 1;
}

void quitarDelFrente(ListaEnlazada &l) {
  Nodo *muerto = l.cabeza;
  l.cabeza = l.cabeza->siguiente;
  if (l.cabeza == NULL) {
    l.ultimo = NULL;
  }
  delete muerto;
  l.n = l.n - 1;
}

void vaciar(ListaEnlazada &l) {
  while (l.cabeza != NULL) {
    Nodo *muerto = l.cabeza;
    l.cabeza = l.cabeza->siguiente;
    delete muerto;
  }
  l.ultimo = NULL;
  l.n = 0;
}

// --- las cuatro combinaciones ----------------------------------------------
long arregloEntraAlFinal(int n) {
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
    eliminarArreglo(l, 0);
    k = k + 1;
  }
  return tocados;
}

long arregloEntraAlFrente(int n) {
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
    eliminarArreglo(l, l.n - 1);
    k = k + 1;
  }
  return tocados;
}

long enlazadaSinUltimo(int n) {
  ListaEnlazada l;
  l.cabeza = NULL;
  l.ultimo = NULL;
  l.n = 0;
  tocados = 0;
  int k = 0;
  while (k < n) {
    agregarCaminando(l, k);
    k = k + 1;
  }
  k = 0;
  while (k < n) {
    quitarDelFrente(l);
    k = k + 1;
  }
  vaciar(l);
  return tocados;
}

long enlazadaConUltimo(int n) {
  ListaEnlazada l;
  l.cabeza = NULL;
  l.ultimo = NULL;
  l.n = 0;
  tocados = 0;
  int k = 0;
  while (k < n) {
    agregarConUltimo(l, k);
    k = k + 1;
  }
  k = 0;
  while (k < n) {
    quitarDelFrente(l);
    k = k + 1;
  }
  vaciar(l);
  return tocados;
}

int main() {
  cout << "encolar y desencolar n veces, contando elementos tocados" << endl << endl;
  cout << "      n   arreglo:entra final   arreglo:entra frente   enlazada sin ultimo   enlazada con ultimo" << endl;
  int tam[3] = {100, 1000, 10000};
  int k = 0;
  while (k < 3) {
    int n = tam[k];
    long a = arregloEntraAlFinal(n);
    long b = arregloEntraAlFrente(n);
    long c = enlazadaSinUltimo(n);
    long d = enlazadaConUltimo(n);
    cout << "  " << n << "            " << a << "               " << b
         << "            " << c << "              " << d << endl;
    k = k + 1;
  }
  return 0;
}
