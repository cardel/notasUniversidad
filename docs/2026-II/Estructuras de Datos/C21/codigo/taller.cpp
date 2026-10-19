// Un taller atiende primero las reparaciones rapidas, cada clase en orden de llegada.
#include <cstdio>
#include <cstring>
#include <deque>
#include <queue>
using std::deque;
using std::queue;

struct Pedido {
  char tipo;          // 'R' rapida, 'N' normal
  char nombre[20];
};

const int MAX = 100;
char tipos[MAX];          // 'R', 'N' o 'A' (atender)
char nombres[MAX][20];

Pedido nuevo(int i) {
  Pedido p;
  p.tipo = tipos[i];
  strcpy(p.nombre, nombres[i]);
  return p;
}

// la primera rapida de la fila, o el frente si no hay rapidas
deque<Pedido>::iterator primeraRapida(deque<Pedido> &fila) {
  deque<Pedido>::iterator it = fila.begin();
  while (it != fila.end() && it->tipo != 'R') {
    ++it;
  }
  if (it == fila.end()) {
    it = fila.begin();
  }
  return it;
}

// una sola fila: O(n) por atencion
void unaFila(int total) {
  deque<Pedido> fila;
  int i = 0;
  while (i < total) {
    if (tipos[i] != 'A') {
      fila.push_back(nuevo(i));
    } else if (fila.empty()) {
      printf("nadie\n");
    } else {
      deque<Pedido>::iterator it = primeraRapida(fila);
      printf("atiende %s\n", it->nombre);
      fila.erase(it);
    }
    i = i + 1;
  }
}

// la rapida mas vieja; si no hay, la normal mas vieja. O(1)
void atender(queue<Pedido> &rapidas, queue<Pedido> &normales) {
  if (!rapidas.empty()) {
    printf("atiende %s\n", rapidas.front().nombre);
    rapidas.pop();
  } else if (!normales.empty()) {
    printf("atiende %s\n", normales.front().nombre);
    normales.pop();
  } else {
    printf("nadie\n");
  }
}

// dos colas: O(1) por orden
void dosColas(int total) {
  queue<Pedido> rapidas;
  queue<Pedido> normales;
  int i = 0;
  while (i < total) {
    if (tipos[i] == 'R') {
      rapidas.push(nuevo(i));
    } else if (tipos[i] == 'N') {
      normales.push(nuevo(i));
    } else {
      atender(rapidas, normales);
    }
    i = i + 1;
  }
}

int main() {
  int total = 0;
  char orden[4];
  while (total < MAX && scanf("%s", orden) == 1) {
    tipos[total] = orden[0];
    if (orden[0] != 'A') {
      scanf("%s", nombres[total]);
    }
    total = total + 1;
  }
  printf("-- una fila --\n");
  unaFila(total);
  printf("-- dos colas --\n");
  dosColas(total);
  return 0;
}
