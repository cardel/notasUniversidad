// El mismo programa sobre las dos pilas: se compila una vez con cada cabecera.
#include <iostream>
#include CABECERA

using std::cout;
using std::endl;

int main() {
  Pila p;
  p.apilar(5);
  p.apilar(8);
  p.apilar(2);
  cout << p.tope() << " " << p.tamano() << endl;     // 2 3

  p.desapilar();
  cout << p.tope() << " " << p.tamano() << endl;     // 8 2

  p.apilar(9);
  while (!p.vacia()) {
    cout << p.tope() << " ";
    p.desapilar();
  }
  cout << endl;                                      // 9 8 5
  cout << p.tamano() << " " << p.vacia() << endl;    // 0 1
  return 0;
}
