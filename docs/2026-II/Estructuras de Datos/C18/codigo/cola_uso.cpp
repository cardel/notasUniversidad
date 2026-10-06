// El mismo programa sobre las dos colas: se compila una vez con cada cabecera.
#include <iostream>
#include CABECERA

using std::cout;
using std::endl;

int main() {
  Cola c;
  c.encolar(5);
  c.encolar(8);
  c.encolar(2);
  cout << c.frente() << " " << c.tamano() << endl;     // 5 3

  c.desencolar();
  cout << c.frente() << " " << c.tamano() << endl;     // 8 2

  c.encolar(9);
  while (!c.vacia()) {
    cout << c.frente() << " ";
    c.desencolar();
  }
  cout << endl;                                        // 8 2 9

  c.encolar(1);                                        // vuelve a servir tras vaciarse
  cout << c.frente() << " " << c.tamano() << " " << c.vacia() << endl;
  return 0;
}
