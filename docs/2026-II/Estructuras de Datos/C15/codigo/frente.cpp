// Insertar al frente n veces: lo que mueve el arreglo y lo que escribe la enlazada.
#include <iostream>

typedef int Elemento;

struct Nodo {
  Elemento dato;
  Nodo *siguiente;
};

// En el arreglo cada insercion en la posicion 0 corre todo lo que ya hay.
long movidasArreglo(int n) {
  Elemento datos[1000];
  int usados = 0;
  long movidas = 0;
  int k = 0;
  while (k < n) {
    int i = usados;
    while (i > 0) {
      datos[i] = datos[i - 1];
      i = i - 1;
      movidas = movidas + 1;
    }
    datos[0] = k;
    usados = usados + 1;
    k = k + 1;
  }
  return movidas;
}

// En la enlazada cada insercion escribe dos punteros: el del nodo nuevo y la cabeza.
long escriturasEnlazada(int n) {
  Nodo *cabeza = NULL;
  long escrituras = 0;
  int k = 0;
  while (k < n) {
    Nodo *nuevo = new Nodo;
    nuevo->dato = k;
    nuevo->siguiente = cabeza;
    cabeza = nuevo;
    escrituras = escrituras + 2;
    k = k + 1;
  }
  while (cabeza != NULL) {
    Nodo *muerto = cabeza;
    cabeza = cabeza->siguiente;
    delete muerto;
  }
  return escrituras;
}

int main() {
  int tam[3] = {10, 100, 1000};
  int i = 0;
  while (i < 3) {
    std::cout << "n = " << tam[i]
              << ": arreglo " << movidasArreglo(tam[i]) << " movidas, "
              << "enlazada " << escriturasEnlazada(tam[i]) << " escrituras"
              << std::endl;
    i = i + 1;
  }
  return 0;
}
