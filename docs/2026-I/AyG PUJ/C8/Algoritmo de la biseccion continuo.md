# Algoritmo de la bisección continuo

En algunas ocasiones $x \in \mathbb{R}$, es decir que es posible que no lo podamos encontrar exactamente.

1. Se requiere hacer un número de divisiones muy grande.
2. El tipo `double` tiene una precisión limitada (error de truncamiento). Computacionalmente no podemos representar todos los números reales dado que son **infinitos**.

Por lo tanto, vamos a introducir una tolerancia $\epsilon$, que es un valor pequeño que aceptamos como error máximo en la aproximación.

**Concepto teórico añadido:** En el dominio continuo, el algoritmo de bisección se utiliza para encontrar una aproximación numérica a la solución de $f(x) = v$. Dado que los números reales tienen representación finita en computadoras (punto flotante), es imposible encontrar el valor exacto en la mayoría de los casos. Por esto, se define un criterio de parada basado en la longitud del intervalo: cuando $r - l < \epsilon$, se considera que cualquier punto en $[l, r]$ es una aproximación suficientemente buena. El valor $\epsilon$ controla el balance entre precisión y número de iteraciones.

```c++
/*
 * Algoritmo de la bisección en dominio continuo
 * Encuentra una aproximación de x tal que f(x) ≈ v, con error máximo epsilon.
 */
#include <cstdio>

// Función de ejemplo: f(x) = x^2 + 2x
double f(double x) { return x * x + 2 * x; }

/**
 * Búsqueda binaria recursiva en dominio continuo.
 * @param l Límite izquierdo del intervalo.
 * @param r Límite derecho del intervalo.
 * @param v Valor objetivo a aproximar (f(x) ≈ v).
 * @param epsilon Tolerancia máxima aceptable para el tamaño del intervalo.
 * @return Una aproximación de x que satisface |f(x) - v| < error implícito.
 */
double biseccion(double l, double r, double v, double epsilon) {
  // Criterio de parada: intervalo suficientemente pequeño
  if (r - l < epsilon) {
    // Retorna el punto medio como la mejor aproximación
    return (l + r) / 2;
  } else {
    double mid = (l + r) / 2.0;
    // Comparación exacta en punto flotante (poco común en la práctica)
    if (f(mid) == v) {
      return mid;
    }
    // Asumiendo que f es estrictamente creciente en [l, r]
    // En caso de no saberlo, se debe validar f(l) <= f(r) para creciente,
    // o f(r) < f(l) para decreciente, y ajustar la búsqueda.
    else {
      if (f(mid) > v) {
        // Si f es creciente y f(mid) > v, la solución está en la mitad izquierda
        return biseccion(l, mid, v, epsilon);
      } else {
        // Si f es creciente y f(mid) < v, la solución está en la mitad derecha
        return biseccion(mid, r, v, epsilon);
      }
    }
  }
}

int main() {
  // NOTA: Los límites l y r se declaran como int, pero se convierten a double
  // al llamar a la función. Es mejor declararlos como double para claridad.
  int l = -100;
  int r = 100;
  double v = 8; // Solución exacta: x = 2
  double epsilon = 1e-7; // Tolerancia de 10^-7
  double res = biseccion(l, r, v, epsilon);
  printf("El valor de x cuando f(x) = 8 es %f\n", res);
  printf("f(%f) = %f\n", res, f(res)); // Verificación
  
  v = 100;
  res = biseccion(l, r, v, epsilon);
  printf("El valor de x cuando f(x) = 100 es %f\n", res);
  printf("f(%f) = %f\n", res, f(res)); // Verificación
}
```

A diferencia de la bisección discreta, la continua solo da el valor de $x$ donde $f(x)$ es lo más cercano a $v$ dentro de la tolerancia $\epsilon$. En caso de que $v$ no esté en el rango de $f$ en el intervalo $[a,b]$, la respuesta será una aproximación a $a$ o $b$, el punto más cercano al valor que se busca.

**Ajuste de inconsistencia:** El texto original dice "En caso de que $v$ no esté en el intervalo, la respuesta va ser $f(a)$ o $f(b)$ el mas cercano". Esto es incorrecto. El algoritmo busca $x$, no $f(x)$. Si $v$ está fuera del rango $[f(a), f(b)]$ (suponiendo $f$ creciente), el algoritmo convergerá al extremo del intervalo ($a$ o $b$) que produzca el valor de $f$ más cercano a $v$, pero retornará ese valor de $x$ (el extremo), no $f(a)$ o $f(b)$.

Recordar validar si la función es creciente ($f(a) \leq f(b)$) o decreciente ($f(a) \geq f(b)$) y ajustar la búsqueda de acuerdo a su comportamiento. Sin embargo, es precondición del algoritmo que la función sea **monótona** en el intervalo $[a,b]$.

## Tabla de resumen de conceptos

| Concepto | Descripción | Observaciones |
| :--- | :--- | :--- |
| **Dominio continuo ($x \in \mathbb{R}$)** | El algoritmo busca una aproximación numérica a la solución, ya que no siempre se puede encontrar el valor exacto. | Se trabaja con números de punto flotante (`double`). |
| **Tolerancia ($\epsilon$)** | Valor pequeño que define el error máximo aceptable. El algoritmo se detiene cuando el tamaño del intervalo es menor que $\epsilon$. | Controla la precisión de la aproximación y el número de iteraciones. |
| **Error de truncamiento** | Limitación inherente a la representación finita de números reales en computadoras. | Impide encontrar soluciones exactas en la mayoría de los casos. |
| **Criterio de parada** | Condición `r - l < epsilon`. Cuando se cumple, cualquier punto en $[l, r]$ es una aproximación válida. | Alternativa: parar cuando `\|f(mid) - v\| < epsilon`. |
| **Comportamiento en fronteras** | Si $v$ está fuera del rango $[f(a), f(b)]$, el algoritmo converge al extremo ($a$ o $b$) que minimiza `\|f(x) - v\|`. | Retorna el valor de $x$ (el extremo), no el valor de $f$ en ese punto. |
| **Precondición de monotonicidad** | La función debe ser estrictamente creciente o decreciente en $[a,b]$. | Se debe verificar `f(a) <= f(b)` (creciente) o `f(a) >= f(b)` (decreciente). |

## Comentarios adicionales

1.  **Comparación de punto flotante:** La línea `if (f(mid) == v)` en el código es problemática. En el dominio continuo, es muy raro que un cálculo de punto flotante dé exactamente el valor objetivo `v` debido a errores de redondeo. Es más robusto usar el criterio de parada basado en el tamaño del intervalo (`r - l < epsilon`) o en la diferencia de valores (`abs(f(mid) - v) < delta`).
2.  **Elección de $\epsilon$:** El valor de $\epsilon$ debe elegirse considerando la precisión deseada y la magnitud de los números involucrados. Un $\epsilon$ demasiado pequeño puede causar un número excesivo de iteraciones o problemas de precisión numérica; uno demasiado grande da una aproximación burda.
3.  **Versión iterativa:** Al igual que en el caso discreto, una implementación iterativa (con un bucle `while`) es más eficiente en memoria que la recursiva, ya que evita la sobrecarga de las llamadas a función.
4.  **Aplicaciones:** Este algoritmo es la base del método de bisección para encontrar raíces de ecuaciones (haciendo $v = 0$). Se utiliza ampliamente en análisis numérico, optimización, gráficos por computadora (ray tracing) y en cualquier problema donde se necesite invertir una función monótona.
5.  **Validación de la precondición:** El código asume que la función es creciente. En una implementación robusta, se debería agregar una verificación inicial de la monotonicidad y un parámetro que indique el tipo de monotonía, para luego ajustar las condiciones `if (f(mid) > v)` en consecuencia.