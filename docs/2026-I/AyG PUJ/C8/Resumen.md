# Resumen de clase: Algoritmo de la bisección

## Conceptos vistos

1.  **Algoritmo de bisección (búsqueda binaria):** Estrategia eficiente para encontrar un valor $x$ en un intervalo $[a, b]$ tal que $f(x) = v$, dividiendo repetidamente el intervalo a la mitad y descartando la mitad donde se sabe que la solución no puede estar.

2.  **Condición fundamental (monotonicidad):** El algoritmo requiere que la función $f$ sea **estrictamente monótona** (siempre creciente o siempre decreciente) en el intervalo de búsqueda. Esta propiedad garantiza que al comparar $f(mid)$ con $v$, podamos determinar con certeza en qué mitad continuar la búsqueda.

3.  **Versión discreta ($x \in \mathbb{Z}$):**
    - Se trabaja con índices enteros y división entera.
    - El algoritmo termina cuando el intervalo se reduce a un solo elemento o se vuelve vacío.
    - Complejidad temporal: $O(\log n)$, donde $n$ es el tamaño inicial del intervalo.

4.  **Versión continua ($x \in \mathbb{R}$):**
    - Se busca una aproximación numérica, ya que los números reales tienen representación finita en computadoras.
    - Se introduce un parámetro de **tolerancia $\epsilon$**, que define el error máximo aceptable.
    - El criterio de parada es cuando el tamaño del intervalo es menor que $\epsilon$ ($r - l < \epsilon$).
    - El resultado es una aproximación, no necesariamente el valor exacto.

5.  **Conceptos teóricos añadidos:**
    - **Error de truncamiento/redondeo:** Limitación inherente al usar tipos de punto flotante (`double`) para representar números reales infinitos.
    - **Criterios de parada alternativos:** Además de basarse en el tamaño del intervalo, se puede parar cuando $|f(mid) - v| < \delta$.
    - **Comportamiento en fronteras:** Si el valor objetivo $v$ está fuera del rango $[f(a), f(b)]$, el algoritmo converge al extremo del intervalo ($a$ o $b$) que produce el valor de $f$ más cercano a $v$.

## Aplicaciones prácticas e importancia

1.  **Búsqueda en arreglos ordenados:** La aplicación más común y fundamental en informática. Permite encontrar un elemento en un arreglo ordenado en tiempo logarítmico, siendo mucho más eficiente que una búsqueda lineal ($O(n)$). Esto es crucial en bases de datos, sistemas de archivos y cualquier estructura que maneje datos ordenados.

2.  **Análisis numérico y cálculo de raíces:** Resolver ecuaciones de la forma $f(x) = 0$ (haciendo $v=0$). Es esencial en ingeniería, física y ciencias para encontrar soluciones a ecuaciones que no tienen forma algebraica cerrada.

3.  **Problemas de optimización y umbral:** Encontrar el valor máximo o mínimo de una función unimodal, o determinar el punto donde se cumple una condición específica (ej: "la mayor cantidad de elementos que puedo procesar en un tiempo límite"). Se usa en logística, planificación de recursos y algoritmos de aproximación.

4.  **Gráficos por computadora y simulación:** En algoritmos de *ray tracing* para intersección de rayos con objetos, o en simulaciones físicas para encontrar el momento de una colisión. La eficiencia logarítmica permite cálculos en tiempo real.

5.  **Inversión de funciones monótonas:** Cuando se conoce el resultado de una función pero se necesita encontrar la entrada que lo produjo. Aplicable en calibración de instrumentos, criptografía y modelos estadísticos.

**Importancia:** Dominar el algoritmo de bisección no es solo aprender a implementar un código; es comprender un **paradigma de pensamiento algorítmico** basado en la división y conquista. Enseña a transformar problemas aparentemente complejos ($O(n)$) en otros manejables ($O(\log n)$), lo cual es una habilidad fundamental para diseñar soluciones eficientes a problemas computacionales reales.

## Frase de motivación

Dominar la búsqueda binaria es aprender a encontrar agujas en pajares infinitos con solo un puñado de preguntas inteligentes.