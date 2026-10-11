// Comparaciones de insertion sort, merge sort y quicksort sobre la misma entrada:
// mezclada, ya ordenada y al reves.
#include <cstdio>

typedef int Elemento;

struct Nodo {
  Elemento dato;
  Nodo *siguiente;
};

long comparaciones = 0;

// Insertion sort sobre el arreglo.
void insertionSort(Elemento a[], int n) {
  int j = 1;
  while (j < n) {
    Elemento clave = a[j];
    int i = j - 1;
    comparaciones = comparaciones + 1;
    while (i >= 0 && a[i] > clave) {
      a[i + 1] = a[i];
      i = i - 1;
      comparaciones = comparaciones + 1;
    }
    a[i + 1] = clave;
    j = j + 1;
  }
}

// Merge sort sobre la lista enlazada.
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

Nodo *mergeSort(Nodo *cabeza) {
  if (cabeza != NULL && cabeza->siguiente != NULL) {
    Nodo *segunda = partir(cabeza);
    cabeza = mezclar(mergeSort(cabeza), mergeSort(segunda));
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

// Quicksort sobre el arreglo.
void intercambiar(Elemento a[], int p, int q) {
  Elemento temp = a[p];
  a[p] = a[q];
  a[q] = temp;
}

int particionar(Elemento a[], int ini, int fin) {
  Elemento x = a[fin];
  int i = ini - 1;
  int j = ini;
  while (j < fin) {
    comparaciones = comparaciones + 1;
    if (a[j] <= x) {
      i = i + 1;
      intercambiar(a, i, j);
    }
    j = j + 1;
  }
  intercambiar(a, i + 1, fin);
  return i + 1;
}

void quicksort(Elemento a[], int ini, int fin) {
  if (ini < fin) {
    int q = particionar(a, ini, fin);
    quicksort(a, ini, q - 1);
    quicksort(a, q + 1, fin);
  }
}

// Llena v segun el tipo: 0 mezclado, 1 ordenado, 2 al reves.
// El mezclado salta entre 0 y 10006 sin seguir un orden.
void llenar(Elemento v[], int n, int tipo) {
  int i = 0;
  while (i < n) {
    if (tipo == 0) {
      v[i] = (int)(((long)i * 7919 + (long)i * i) % 10007);
    } else if (tipo == 1) {
      v[i] = i;
    } else {
      v[i] = n - 1 - i;
    }
    i = i + 1;
  }
}

int main() {
  const char *nombre[3] = {"mezclado", "ordenado", "al reves"};
  int tam[4] = {16, 128, 1024, 4096};
  printf("entrada        n    insertion        merge    quicksort\n");
  int t = 0;
  while (t < 3) {
    int k = 0;
    while (k < 4) {
      int n = tam[k];
      Elemento *v = new Elemento[n];
      long ci;
      long cm;
      long cq;
      llenar(v, n, t);
      comparaciones = 0;
      insertionSort(v, n);
      ci = comparaciones;
      llenar(v, n, t);
      Nodo *c = armar(v, n);
      comparaciones = 0;
      c = mergeSort(c);
      cm = comparaciones;
      liberar(c);
      llenar(v, n, t);
      comparaciones = 0;
      quicksort(v, 0, n - 1);
      cq = comparaciones;
      printf("%-9s %6d %12ld %12ld %12ld\n", nombre[t], n, ci, cm, cq);
      delete[] v;
      k = k + 1;
    }
    t = t + 1;
  }
  return 0;
}
