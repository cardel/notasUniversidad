#include <cstdio>
#include <list>
using namespace std;

// el nodo de list<int> en la biblioteca de GCC: dos punteros y el dato
struct Nodo {
  Nodo *siguiente;                 // bytes 0 a 7
  Nodo *anterior;                  // bytes 8 a 15
  int dato;                        // bytes 16 a 19
};

int main() {
  int campos = (int) (sizeof(int) + 2 * sizeof(Nodo *));
  printf("int %d, puntero %d\n", (int) sizeof(int), (int) sizeof(Nodo *));
  printf("suma de los campos: %d\n", campos);
  printf("sizeof(Nodo): %d\n", (int) sizeof(Nodo));
  // _List_node es el nombre que le da GCC al nodo de list
  printf("sizeof(_List_node<int>): %d\n", (int) sizeof(_List_node<int>));
  printf("40 nodos: %d bytes por campos, %d por sizeof\n",
         40 * campos, 40 * (int) sizeof(_List_node<int>));
  return 0;
}
