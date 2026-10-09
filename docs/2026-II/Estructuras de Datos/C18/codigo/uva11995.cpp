// UVa 11995 - I Can Guess the Data Structure!: pila, cola y cola de prioridad
// simuladas a la vez. Meter cuesta Theta(1) en las tres; sacar cuesta Theta(1)
// en la pila y la cola y Theta(n) en la cola de prioridad, que busca el maximo
// en un arreglo: el caso cuesta O(n^2), con n <= 1000.
#include <cstdio>
#include "cola_nodos.h"
#include "pila_nodos.h"

const int MAX_ORDENES = 1000;

int prioridad[MAX_ORDENES];  // prioridad[0..tam): elementos de la cola de prioridad
int tam = 0;

// Saca el mayor de prioridad[0..tam) y lo devuelve: lo busca recorriendo
// y pone el ultimo en su lugar. Exige tam > 0.
int sacarMayor() {
  int mayor = 0;
  int i = 1;
  while (i < tam) {
    if (prioridad[i] > prioridad[mayor]) {
      mayor = i;
    }
    i = i + 1;
  }
  int x = prioridad[mayor];
  prioridad[mayor] = prioridad[tam - 1];
  tam = tam - 1;
  return x;
}

int main() {
  int n;
  while (scanf("%d", &n) == 1) {
    Pila pila;
    Cola cola;
    tam = 0;
    bool esPila = true;
    bool esCola = true;
    bool esPrioridad = true;
    int i = 0;
    while (i < n) {
      int orden, x;
      scanf("%d %d", &orden, &x);
      if (orden == 1) {
        pila.apilar(x);
        cola.encolar(x);
        prioridad[tam] = x;
        tam = tam + 1;
      } else if (tam == 0) {
        // Las tres tienen los mismos elementos: si una esta vacia, las tres
        // lo estan, y sacar de una vacia las descarta.
        esPila = false;
        esCola = false;
        esPrioridad = false;
      } else {
        // Las tres se siguen simulando aunque ya esten descartadas, para que
        // todas guarden la misma cantidad de elementos.
        esPila = esPila && pila.tope() == x;
        esCola = esCola && cola.frente() == x;
        esPrioridad = esPrioridad && sacarMayor() == x;
        pila.desapilar();
        cola.desencolar();
      }
      i = i + 1;
    }
    int posibles = 0;
    if (esPila) {
      posibles = posibles + 1;
    }
    if (esCola) {
      posibles = posibles + 1;
    }
    if (esPrioridad) {
      posibles = posibles + 1;
    }
    if (posibles == 0) {
      printf("impossible\n");
    } else if (posibles > 1) {
      printf("not sure\n");
    } else if (esPila) {
      printf("stack\n");
    } else if (esCola) {
      printf("queue\n");
    } else {
      printf("priority queue\n");
    }
  }
  return 0;
}
