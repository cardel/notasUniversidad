# Algoritmo de la bisección

El algoritmo de la bisección permite hacer búsquedas de un valor $x$ tal que $f(x) = v$, si la función es **estrictamente monótona creciente o decreciente** en el intervalo $[a,b]$ entonces puedo aplicar la siguiente estrategia para buscar $x$.

## Versión discreta

Si $x \in \mathbb{Z}$:

1. Calculo $mid = \lfloor \frac{a+b}{2} \rfloor$ (división entera).
2. Consulto si $f(mid) == v$. Si es así, encontré el valor de $x$ que es $mid$. Si no:
	1. Si $f(mid) < v$ y la función es creciente, mi nuevo intervalo es $[mid+1,b]$. Si la función es decreciente, busco en $[a,mid-1]$.
	2. En otro caso, si $f(mid) > v$ y la función es creciente, busco en la izquierda $[a,mid-1]$. Si es decreciente, busco a la derecha $[mid+1,b]$.
3. El algoritmo termina si $a > b$ (intervalo vacío) o si $a == b$ (intervalo de un solo elemento). En este último caso, se verifica si $f(a) == v$.

**Concepto teórico añadido:** El algoritmo de bisección (o búsqueda binaria) aplicado a funciones discretas requiere que la función sea **monótona** (siempre creciente o siempre decreciente) en el intervalo de búsqueda. Esto garantiza que al comparar $f(mid)$ con $v$, podamos descartar con seguridad una de las mitades del intervalo. La complejidad temporal es $O(\log n)$, donde $n$ es el tamaño del intervalo inicial, lo que lo hace muy eficiente para intervalos grandes.

```c++
/**
 * Algoritmo de la bisección discreto para encontrar x tal que f(x) = v.
 * Precondición: f es estrictamente monótona (creciente o decreciente) en [l, r].
 * */
#include <cstdio>

// Función de ejemplo: f(x) = x^2 + 2x
int f(int x) { return x * x + 2 * x; }

/**
 * Función recursiva de búsqueda binaria.
 * @param l Límite izquierdo del intervalo (inclusive).
 * @param r Límite derecho del intervalo (inclusive).
 * @param v Valor objetivo a buscar (f(x) = v).
 * @return El entero x que satisface f(x) = v, o -1 si no se encuentra.
 */
int biseccion(int l, int r, int v) {
  // Caso base: intervalo vacío o de un solo elemento
  if (l >= r) {
    // Verifica el único candidato restante
    if (f(l) == v) {
      return l;
    } else {
      printf("El valor no se encontró\n");
      return -1; // No se encontró el valor
    }
  } else {
    // Calcula el punto medio del intervalo (división entera)
    int mid = (l + r) / 2;
    if (f(mid) == v) {
      return mid; // Solución encontrada
    } else {
      // Decide en qué mitad continuar la búsqueda
      // NOTA: Este código asume que f es estrictamente creciente.
      // Para una función decreciente, las condiciones se invertirían.
      if (f(mid) < v) {
        // Si f es creciente, el valor objetivo está a la derecha
        return biseccion(mid + 1, r, v);
      } else {
        // Si f es creciente, el valor objetivo está a la izquierda
        return biseccion(l, mid - 1, v);
      }
    }
  }
}

int main() {
  int l = -100;
  int r = 100;
  int v = 8; // Para f(x)=8, la solución es x=2 (2^2 + 2*2 = 8)
  int res = biseccion(l, r, v);
  printf("El valor de x cuando f(x) = 8 es %d\n", res);

  v = 100; // Para f(x)=100, la solución es x=? (debe encontrarse en el intervalo)
  res = biseccion(l, r, v);
  printf("El valor de x cuando f(x) = 100 es %d\n", res);
}
```


## Tabla de resumen de conceptos

| Concepto | Descripción | Observaciones |
| :--- | :--- | :--- |
| **Algoritmo de bisección (búsqueda binaria)** | Estrategia para encontrar un valor $x$ en un intervalo $[a,b]$ tal que $f(x)=v$, dividiendo repetidamente el intervalo a la mitad. | Requiere que $f$ sea monótona en el intervalo. |
| **Función monótona** | Función que es siempre creciente o siempre decreciente. Garantiza que el valor objetivo $v$ esté en una sola de las mitades al comparar $f(mid)$. | Condición fundamental para la correctitud del algoritmo. |
| **Versión discreta** | Aplicación del algoritmo cuando el dominio de $x$ es el conjunto de los números enteros ($x \in \mathbb{Z}$). | Se usan índices enteros y divisiones enteras. |
| **Complejidad temporal** | $O(\log n)$, donde $n$ es el tamaño del intervalo inicial. | Muy eficiente incluso para intervalos muy grandes. |
| **Caso base** | Condición de terminación: cuando el intervalo se reduce a un solo elemento ($l == r$) o se vuelve vacío ($l > r$). | Se debe verificar si el elemento restante es la solución. |
| **Implementación recursiva** | La función se llama a sí misma con el nuevo intervalo reducido. | También puede implementarse de forma iterativa con un bucle `while`. |

## Comentarios adicionales

1.  **Generalización del código:** La implementación proporcionada solo maneja funciones crecientes. Sería una mejora significativa modificar la función `biseccion` para que reciba un parámetro adicional (por ejemplo, un `bool esCreciente`) y así poder manejar ambos tipos de monotonía correctamente, tal como se describe en la sección teórica.
2.  **Precisión y dominio:** En la versión discreta, al trabajar con enteros, no hay problemas de precisión numérica. Sin embargo, si se extendiera a una versión continua (para números reales), se necesitaría un criterio de tolerancia para decidir cuándo detenerse (por ejemplo, cuando $|f(mid) - v| < \epsilon$).
3.  **Aplicaciones prácticas:** Este algoritmo es fundamental en informática. Más allá de buscar raíces de ecuaciones, se utiliza en:
    *   Búsqueda en arreglos ordenados (su aplicación más común).
    *   Encontrar el punto óptimo en problemas de minimización/maximización (búsqueda ternaria).
    *   Resolver problemas de "valor umbral" en programación competitiva y optimización.
4.  **Error común:** No verificar la condición de monotonicidad antes de aplicar la bisección puede llevar a resultados incorrectos, ya que el algoritmo podría descartar la mitad del intervalo que contiene la solución verdadera.
5.  **Variante iterativa:** La implementación recursiva, aunque clara, puede consumir espacio en la pila de llamadas para intervalos muy grandes. Una versión iterativa usando un bucle `while` suele ser preferible por eficiencia de memoria.