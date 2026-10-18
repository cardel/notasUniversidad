// Sumar una lista enlazada pidiendo el elemento i cuesta Theta(n^2);
// recorrerla siguiendo next cuesta Theta(n).
#include <chrono>
#include <cstdio>

using std::chrono::duration_cast;
using std::chrono::high_resolution_clock;
using std::chrono::nanoseconds;

struct Nodo {
  int dato;
  Nodo *next;
};

struct Lista {
  Nodo *head;
  Nodo *tail;

  Lista() {
    head = nullptr;
    tail = nullptr;
  }

  ~Lista() {
    Nodo *actual = head;
    while (actual != nullptr) {
      Nodo *siguiente = actual->next;
      delete actual;
      actual = siguiente;
    }
  }

  void push_back(int val) {
    Nodo *nuevo = new Nodo;
    nuevo->dato = val;
    nuevo->next = nullptr;
    if (head == nullptr) {
      head = nuevo;
    } else {
      tail->next = nuevo;
    }
    tail = nuevo;
  }

  // Vuelve a la cabeza y avanza i nodos: Theta(i).
  int get(int i) {
    Nodo *actual = head;
    for (int j = 0; j < i; j++) {
      actual = actual->next;
    }
    return actual->dato;
  }
};

int main() {
  int n = 10000;
  Lista lst;
  for (int i = 0; i < n; i++) {
    lst.push_back(i);
  }

  long long suma = 0;
  high_resolution_clock::time_point ini = high_resolution_clock::now();
  for (int i = 0; i < n; i++) {
    suma += lst.get(i);
  }
  high_resolution_clock::time_point fin = high_resolution_clock::now();
  long long ns = duration_cast<nanoseconds>(fin - ini).count();
  printf("por indice:   %lld ns, suma %lld\n", ns, suma);

  suma = 0;
  ini = high_resolution_clock::now();
  Nodo *actual = lst.head;
  while (actual != nullptr) {
    suma += actual->dato;
    actual = actual->next;
  }
  fin = high_resolution_clock::now();
  ns = duration_cast<nanoseconds>(fin - ini).count();
  printf("por iterador: %lld ns, suma %lld\n", ns, suma);
  return 0;
}
