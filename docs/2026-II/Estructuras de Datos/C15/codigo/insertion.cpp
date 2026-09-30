// Insertion sort sobre el arreglo, contando los corrimientos que hace.
#include <iostream>

typedef int Elemento;

// Ordena a[0..n) y devuelve cuantas veces corrio un elemento.
long insertionSort(Elemento a[], int n) {
  long corrimientos = 0;
  int j = 1;
  while (j < n) {
    Elemento clave = a[j];
    int i = j - 1;
    while (i >= 0 && a[i] > clave) {
      a[i + 1] = a[i];
      i = i - 1;
      corrimientos = corrimientos + 1;
    }
    a[i + 1] = clave;
    j = j + 1;
  }
  return corrimientos;
}

void imprimir(Elemento a[], int n) {
  int i = 0;
  while (i < n) {
    std::cout << a[i] << " ";
    i = i + 1;
  }
  std::cout << std::endl;
}

int main() {
  Elemento mezclado[6] = {5, 2, 9, 1, 7, 3};
  Elemento ordenado[6] = {1, 2, 3, 5, 7, 9};
  Elemento alReves[6]  = {9, 7, 5, 3, 2, 1};

  std::cout << "mezclado: " << insertionSort(mezclado, 6) << " corrimientos -> ";
  imprimir(mezclado, 6);

  std::cout << "ordenado: " << insertionSort(ordenado, 6) << " corrimientos -> ";
  imprimir(ordenado, 6);

  std::cout << "al reves: " << insertionSort(alReves, 6) << " corrimientos -> ";
  imprimir(alReves, 6);

  return 0;
}
