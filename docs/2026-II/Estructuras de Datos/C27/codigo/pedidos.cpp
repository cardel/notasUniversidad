// Los pedidos de uso_heapq.py, con priority_queue.
#include <cstdio>
#include <queue>
#include <string>
using std::priority_queue;
using std::string;

struct Pedido {
  int urgencia;
  int turno;
  string nombre;
  // sale primero la urgencia mayor; con la misma, el turno menor
  bool operator<(const Pedido &o) const {
    bool menor;
    if (urgencia != o.urgencia) {
      menor = urgencia < o.urgencia;
    } else {
      menor = turno > o.turno;
    }
    return menor;
  }
};

int main() {
  priority_queue<Pedido> pq;
  Pedido a = {2, 1, "cafe"};
  Pedido b = {5, 2, "almuerzo"};
  Pedido c = {5, 3, "postre"};
  Pedido d = {1, 4, "agua"};
  pq.push(a);
  pq.push(b);
  pq.push(c);
  pq.push(d);
  while (!pq.empty()) {
    Pedido p = pq.top();
    pq.pop();
    printf("%d %d %s\n", p.urgencia, p.turno, p.nombre.c_str());
  }
  return 0;
}
