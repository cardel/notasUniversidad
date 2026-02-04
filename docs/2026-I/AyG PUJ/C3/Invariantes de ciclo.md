![](attachments/Invariantes_annotated.pdf){ type=application/pdf style="min-height:70vh;width:100%"}

## Ejemplos código

### Factorial

Evaluación en el código de la invariante de ciclo del factorial

```python
def factorial(n):
    i = 0
    r = 1
    while i != n:
        print(f"Inv {i} {r} invariante r = {factorial(i)}")
        i += 1
        r = r * i
    return r


def main():
    print(factorial(6))


if __name__ == "__main__":
    main()


```

### Raiz

Evaluación de la invariante de ciclo del caso de la raiz cuadrada con el método de Newton

```c++
#include <cmath>
#include <cstdio>
double raiz(double n, double delta) {
  double x = 1;
  while (abs(x * x - n) > delta) {
    printf("Estimacion actual: %f\n", x);
    x = (x + n / x) / 2;
  }
  return x;
}

int main() {
  double n, delta;
  printf("Ingrese un numero: ");
  scanf("%lf", &n);
  printf("Ingrese la precision: ");
  scanf("%lf", &delta);
  double resultado = raiz(n, delta);
  printf("La raiz cuadrada de %f es aproximadamente %f\n", n, resultado);
  // Ejemplo error de truncamiento
  printf("Ejemplo de error de truncamiento:\n");
  double valor = 1.0 / 3.0;
  printf("%f", valor);
  return 0;
}
513

```