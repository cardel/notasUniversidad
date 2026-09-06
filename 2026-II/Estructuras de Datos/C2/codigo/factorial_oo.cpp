/* Paradigma orientado a objetos: el calculo vive dentro de un objeto */
#include <iostream>

class Factorial {
  private:
    long resultado;

  public:
    Factorial() {
        resultado = 1;
    }

    long calcular(int n) {
        int i;

        resultado = 1;
        i = 2;
        while (i <= n) {
            resultado = resultado * i;
            i = i + 1;
        }
        return resultado;
    }
};

int main() {
    Factorial f;

    std::cout << f.calcular(5) << std::endl;
    return 0;
}
