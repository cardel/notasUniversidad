// La misma entrada por los dos algoritmos, contando comparaciones.
#include <iostream>

using std::cout;
using std::endl;

typedef int Elemento;

struct Nodo {
  Elemento dato;
  Nodo *siguiente;
};

long compInsertion = 0;
long compMerge = 0;

// Insertion sort sobre el arreglo, como se vio con la lista estatica.
void insertionSort(Elemento a[], int n) {
  int j = 1;
  while (j < n) {
    Elemento clave = a[j];
    int i = j - 1;
    compInsertion = compInsertion + 1;
    while (i >= 0 && a[i] > clave) {
      a[i + 1] = a[i];
      i = i - 1;
      compInsertion = compInsertion + 1;
    }
    a[i + 1] = clave;
    j = j + 1;
  }
}

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

Nodo *mezclar(Nodo *a, Nodo *b) {
  Nodo guia;
  guia.dato = 0;
  guia.siguiente = NULL;
  Nodo *cola = &guia;
  while (a != NULL && b != NULL) {
    compMerge = compMerge + 1;
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

void liberar(Nodo *cabeza) {
  while (cabeza != NULL) {
    Nodo *muerto = cabeza;
    cabeza = cabeza->siguiente;
    delete muerto;
  }
}

int main() {
  int tam[4] = {16, 128, 1024, 4096};
  cout << "        n   insertion sort   merge sort   veces mas" << endl;
  int k = 0;
  while (k < 4) {
    int n = tam[k];
    Elemento *v = new Elemento[n];
    Elemento *w = new Elemento[n];
    int i = 0;
    while (i < n) {
      v[i] = (i * 37 + 11) % n;
      w[i] = v[i];
      i = i + 1;
    }
    compInsertion = 0;
    compMerge = 0;
    insertionSort(v, n);
    Nodo *c = armar(w, n);
    c = ordenar(c);
    cout << "  " << (n < 1000 ? "  " : "") << n
         << "       " << compInsertion
         << "        " << compMerge
         << "        " << (compMerge > 0 ? compInsertion / compMerge : 0) << endl;
    liberar(c);
    delete[] v;
    delete[] w;
    k = k + 1;
  }
  return 0;
}
