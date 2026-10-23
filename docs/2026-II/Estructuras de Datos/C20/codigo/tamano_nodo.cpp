#include <cstdio>

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
  printf("40 nodos: %d bytes por campos, %d por sizeof\n",
         40 * campos, 40 * (int) sizeof(Nodo));
  return 0;
}
