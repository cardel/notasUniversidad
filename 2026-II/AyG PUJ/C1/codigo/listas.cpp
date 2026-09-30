// Clase 1 - Repaso de estructuras de datos y notacion asintotica
// Listas: std::deque mantiene referencias a los dos extremos,
// de modo que agregar y quitar por cualquiera de ellos cuesta O(1).
//
// Compilar y ejecutar:
//   g++ -std=c++17 -o listas listas.cpp && ./listas

#include <deque>
#include <iostream>
#include <string>

using namespace std;

void imprimir(const string &etiqueta, const deque<int> &l) {
    cout << etiqueta << " = [";
    for (size_t i = 0; i < l.size(); i++) {
        cout << l[i];
        if (i + 1 < l.size()) {
            cout << ", ";
        }
    }
    cout << "]" << endl;
}

void operaciones_en_los_extremos() {
    deque<int> l;

    l.push_back(10);    // O(1)
    l.push_front(5);    // O(1)
    l.push_back(20);
    imprimir("deque      ", l);

    cout << "front       = " << l.front() << endl;   // O(1)
    cout << "back        = " << l.back() << endl;    // O(1)
    cout << "size        = " << l.size() << endl;    // O(1)
    cout << "empty       = " << l.empty() << endl;   // O(1)

    l.pop_back();       // O(1)
    l.pop_front();      // O(1)
    imprimir("deque      ", l);
}

void operaciones_en_una_posicion() {
    // Llegar a la posicion k obliga a recorrer la secuencia: O(k).
    deque<int> l = {1, 2, 3, 4, 5};

    l.insert(l.begin() + 2, 99);   // O(k)
    imprimir("tras insert", l);

    l.erase(l.begin() + 2);        // O(k)
    imprimir("tras erase ", l);
}

int main() {
    cout << "Operaciones en los extremos" << endl;
    operaciones_en_los_extremos();

    cout << endl;
    cout << "Operaciones en una posicion intermedia" << endl;
    operaciones_en_una_posicion();

    return 0;
}
