# Clase 6. Evaluación de expresiones y recursión estructural

## Como vamos

1. **Relaciones**: conceptos básicos y tipos:
   2. **Reflexiva**: $(a,a)$ para todo $a$ en el conjunto.
   3. **Simétrica**: si $(a,b)$ existe, entonces $(b,a)$ también existe.
   4. **Antisimétrica**: si $(a,b)$ existe y $a \neq b$, entonces $(b,a)$ no existe.
   5. **Transitiva**: si $(a,b)$ y $(b,c)$ existen, entonces $(a,c)$ debe existir.

6. **Clasificación**:
   7. **Orden parcial**: reflexiva, antisimétrica y transitiva.
   8. **Equivalencia**: reflexiva, simétrica y transitiva.

9. **Relaciones n-arias**:
   10. Son relaciones entre más de dos conjuntos (o entre elementos de un mismo conjunto con más de dos componentes).
   11. **Composición** $f \circ g$: si $(a,b) \in g$ y $(b,c) \in f$, entonces $(a,c) \in f \circ g$.
   12. **Potencia**:
      $$
      r^n = \begin{cases}
          r & \text{si } n = 1 \\
          r \circ r^{n-1} & \text{si } n > 1 \\
          \end{cases}
      $$
   13. **Proyección**: dada una relación con elementos $(a_1, a_2, \ldots, a_n)$, una proyección es un subconjunto de estos elementos, por ejemplo $(a_i, a_j, a_k)$ con $i, j, k \in \{1,\ldots,n\}$.
   14. **Join**: dadas dos relaciones $R(a_0, a_1, \ldots, a_k, c_1, c_2, \ldots, c_n)$ y $S(b_0, b_1, \ldots, b_k, c_1, c_2, \ldots, c_n)$, el join produce una nueva relación $(a_0, a_1, \ldots, a_k, b_0, b_1, \ldots, b_k, c_1, c_2, \ldots, c_n)$ donde las componentes $c_i$ coinciden.

15. **Enfoque de programación funcional**: uso de variables inmutables, estructuras de datos inmutables, recursividad como estrategia de solución y funciones de orden superior.

16. **Recursión**:
   17. **Matemática**: funciones en las que un elemento depende de los anteriores; debe tener un caso base.
   18. **Programación**: funciones que se llaman a sí mismas; requieren un caso base y un caso recursivo.
   19. **Caso base**: es trivial, con solución inmediata. El **caso recursivo** compone la solución y nos acerca al caso base.

Ejemplo matemático (factorial):
$$
f(n) = n \cdot f(n-1), \quad f(0) = 1
$$
Desarrollo:
- $f(0) = 1$
- $f(1) = 1 \cdot f(0) = 1 \cdot 1 = 1$
- $f(2) = 2 \cdot f(1) = 2 \cdot 1 = 2$
- $f(3) = 3 \cdot f(2) = 3 \cdot 2 = 6$

```scala
def factorial(n: Int): Int = {
    if (n == 0) 1 // Caso base: factorial de 0 es 1
    else n * factorial(n - 1) // Caso recursivo: n * factorial(n-1)
}
```

## Tabla de resumen

| Concepto | Descripción | Ejemplo / Notas |
|----------|-------------|-----------------|
| Relación reflexiva | Todo elemento está relacionado consigo mismo. | En un conjunto $A$, $\forall a \in A, (a,a) \in R$. |
| Relación simétrica | Si $a$ está relacionado con $b$, entonces $b$ está relacionado con $a$. | Si $(a,b) \in R$, entonces $(b,a) \in R$. |
| Relación antisimétrica | Si $a \neq b$ y $(a,b) \in R$, entonces $(b,a) \notin R$. | En órdenes parciales (e.g., $\leq$ en números). |
| Relación transitiva | Si $(a,b) \in R$ y $(b,c) \in R$, entonces $(a,c) \in R$. | Fundamental en cierres transitivos. |
| Orden parcial | Relación reflexiva, antisimétrica y transitiva. | Ejemplo: divisibilidad en enteros positivos. |
| Relación de equivalencia | Relación reflexiva, simétrica y transitiva. | Particiona el conjunto en clases de equivalencia. |
| Composición de relaciones | Combinación de dos relaciones: $(a,c) \in R \circ S$ si existe $b$ con $(a,b) \in S$ y $(b,c) \in R$. | Análoga a composición de funciones. |
| Potencia de una relación | $R^n = R \circ R^{n-1}$ para $n>1$, con $R^1 = R$. | Usada en cierres transitivos y reflexivos. |
| Proyección (relaciones n-arias) | Selección de un subconjunto de componentes de una tupla. | De $(a,b,c,d)$ proyectar $(a,c)$. |
| Join (relaciones n-arias) | Combinación de dos relaciones que comparten algunas componentes. | Similar a JOIN en bases de datos relacionales. |
| Programación funcional | Paradigma basado en funciones puras, inmutabilidad y recursión. | Scala, Haskell, Erlang. |
| Recursión (matemática) | Definición de una función en términos de sí misma, con caso base. | Factorial, sucesión de Fibonacci. |
| Recursión (programación) | Función que se llama a sí misma para resolver subproblemas. | Debe tener caso base para evitar ciclo infinito. |
| Caso base | Condición que detiene la recursión, solución directa. | En factorial, $n=0$ retorna 1. |
| Caso recursivo | Paso que reduce el problema y llama recursivamente. | En factorial, $n * factorial(n-1)$. |

## Comentarios adicionales

- La **recursión estructural** es un patrón común en programación funcional, donde la estructura de los datos guía la definición recursiva (ej.: listas, árboles).
- En relaciones, el **cierre transitivo** $R^+$ se obtiene aplicando potencias sucesivas hasta que no cambie.
- Las **funciones de orden superior** (map, filter, reduce) suelen implementarse de forma recursiva en lenguajes funcionales.
- La **inmutabilidad** en programación funcional facilita el razonamiento sobre el código y evita efectos secundarios.
- En Scala, la recursión puede optimizarse con **tail recursion** (recursión de cola) usando la anotación `@tailrec`, lo que evita desbordamiento de pila para recursiones profundas.
- Las **relaciones n-arias** son la base del modelo relacional de bases de datos, donde las tablas representan relaciones y las operaciones (proyección, join) son fundamentales en SQL.


# Temas

1. [Evaluación de expresiones](Evaluación%20de%20expresiones.md)
2. [Recursión estructural](Recursión%20estructural.md)
3. [Resumen](Resumen.md)