# Clase 05 de Marzo: Inducción estructural

# Recursos

- [https://www.toptal.com/developers/gitignore](https://www.toptal.com/developers/gitignore) Generador de gitignore
- [https://markdownlivepreview.com/](https://markdownlivepreview.com/) Visualizador de Markdown

# Inducción estructural

Listas

- Lista en su paso recursivo: <cabeza> <cola> donde la <cola> es una lista
- Caso base es la lista vacia nil o List()

# Ejemplo Desbordamiento

```cpp
#include <iostream>

using namespace std;

int main() {
  // Entero maximo
  int a = 2147483647;
  cout << a << endl;
  cout << a + 1 << endl;
}

```

![NotasClase_annotated.pdf](Clase%2005%20de%20Marzo%20Inducción%20estructural/NotasClase_annotated.pdf){ type=application/pdf style="min-height:70vh;width:100%"}