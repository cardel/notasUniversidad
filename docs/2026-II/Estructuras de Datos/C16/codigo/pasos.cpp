// Cuantos pasos cuesta llegar a la posicion p: de frente contra por el lado mas corto.
#include <iostream>

using std::cout;
using std::endl;

typedef int Elemento;

struct Nodo {
  Elemento dato;
  Nodo *anterior;
  Nodo *siguiente;
};

// Arma una cadena circular doble de n nodos y devuelve la cabeza.
Nodo *armar(int n) {
  Nodo *cabeza = new Nodo;
  cabeza->dato = 0;
  cabeza->siguiente = cabeza;
  cabeza->anterior = cabeza;
  int i = 1;
  while (i < n) {
    Nodo *nuevo = new Nodo;
    nuevo->dato = i;
    nuevo->siguiente = cabeza;
    nuevo->anterior = cabeza->anterior;
    cabeza->anterior->siguiente = nuevo;
    cabeza->anterior = nuevo;
    i = i + 1;
  }
  return cabeza;
}

void liberar(Nodo *cabeza, int n) {
  int i = 0;
  while (i < n) {
    Nodo *muerto = cabeza;
    cabeza = cabeza->siguiente;
    delete muerto;
    i = i + 1;
  }
}

// Siempre hacia adelante: p pasos.
long deFrente(Nodo *cabeza, int p) {
  Nodo *actual = cabeza;
  long pasos = 0;
  int i = 0;
  while (i < p) {
    actual = actual->siguiente;
    i = i + 1;
    pasos = pasos + 1;
  }
  return pasos;
}

// Por el lado mas corto: nunca mas de n/2 pasos.
long porElLadoCorto(Nodo *cabeza, int n, int p) {
  Nodo *actual = cabeza;
  long pasos = 0;
  if (p <= n / 2) {
    int i = 0;
    while (i < p) {
      actual = actual->siguiente;
      i = i + 1;
      pasos = pasos + 1;
    }
  } else {
    int i = n;
    while (i > p) {
      actual = actual->anterior;
      i = i - 1;
      pasos = pasos + 1;
    }
  }
  return pasos;
}

int main() {
  int n = 10;
  Nodo *cabeza = armar(n);
  cout << "con n = " << n << endl;
  cout << "  p :";
  int p = 0;
  while (p < n) {
    cout << (p < 10 ? "  " : " ") << p;
    p = p + 1;
  }
  cout << endl << "  de frente        :";
  p = 0;
  while (p < n) {
    cout << "  " << deFrente(cabeza, p);
    p = p + 1;
  }
  cout << endl << "  por el lado corto:";
  p = 0;
  while (p < n) {
    cout << "  " << porElLadoCorto(cabeza, n, p);
    p = p + 1;
  }
  cout << endl;
  liberar(cabeza, n);

  cout << endl << "recorriendo todas las posiciones una vez:" << endl;
  int tam[3] = {10, 100, 1000};
  int k = 0;
  while (k < 3) {
    int m = tam[k];
    Nodo *c = armar(m);
    long a = 0;
    long b = 0;
    int q = 0;
    while (q < m) {
      a = a + deFrente(c, q);
      b = b + porElLadoCorto(c, m, q);
      q = q + 1;
    }
    cout << "  n = " << m << ": de frente " << a
         << " pasos, por el lado corto " << b << endl;
    liberar(c, m);
    k = k + 1;
  }
  return 0;
}
