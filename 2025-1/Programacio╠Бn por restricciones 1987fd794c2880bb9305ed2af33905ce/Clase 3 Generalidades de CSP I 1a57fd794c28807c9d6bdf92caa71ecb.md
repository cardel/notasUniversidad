# Clase 3: Generalidades de CSP I

# Proyecciones

Un CSP

- Un conjunto de variables X
- Cada una de estas variables tiene un Dominio
- Un punto solución pertenece al producto cartesiano entre los dominios, en otras palabras, cada una de las variables va a tomar un valor dentro de su dominio
- Un restriccion: Un subcojunto de variables de entrada X y existe uno o más puntos que la satisfacen que pertenecen al producto cartesiano del dominio.

---

Equivalencia de CSP

Un problema CSP se puede escribir de muchas formas

¿Como nos damos cuenta que son lo mismo?

Si su conjunto de soluciones es el mismo

---

CSP satisfactible y no satisfactible

- Un CSP está resuelto si:
    - Todas las restricciones se cumplen
    - No existen variables con dominios vacios
- Un CSP no es satisfactible
    - Contiene una restricción falsa x > y and y > x
    - Alguno de los dominios es vacio
- Para satisfacer debe existir un punto en los dominios que resuelve las restricciones
- Para que sea insatisfactible no existe un punto en los dominios que satisfaga las restricciones

---

Esquema de un CSP

Mientras no esté resuelvo

- Preprocesamiento: Incluir las restricciones (por cada nodo del arbol se pueden incluir nuevas restricciones)
- Propagación de restricciones: Los dominios se acotan a los valores factibles $x = [1,10] \wedge y=[11,20] \wedge x+y <=15 \therefore x = [1,10] \wedge y=[11,14]$
- Si hay un valor atómico, entonces se para la búsqueda (un valor para cada una de las variables)
- Si no, entonces hacemos split, hacemos una suposición sobre uno de las variables y eso nos divide la busqueda (arbol)
- Proceed by cases: Propagar + split

---

¿Que podemos hacer con un CSP?

1. Encontrar una solución
2. Encontrar todas las soluciones
3. Encontrar una forma de generar las soluciones (ecuación)
4. Determinar si no existe solución (no satisfactible)
5. Encontrar la mejor solución
6. Encontrar todas las mejores soluciones
7. Encontrar soluciones con un error dado (flexibles)

---

Atómico

Tenemos un valor de todas las variables que resuelve el problema, en ocasiones se puede realizar más busqueda en este estado*(posterior)

---

Estrategias de split (división)

- Enumeración: Dar un valor especifico a una variable por una lado y por el otro descartarlo x = 5 y x ≠ 5
- Labeling (etiquetado) es que divide el problema en todos los valores del dominio  $x \in [1..5], x = 1 \vee x = 2 \vee x = 3 \vee x = 4 \vee x = 5$
- Bisección: Es tomar por la mitad del dominio

---

Dividir una restricción

- P(x) = a se pueede dividir como P(x) = a o P(x) = -a
- Que pasa cuando dividimos se generan 1 o más nuevos CSP, ejemplo y = 5 o y ≠ 5

---

Heuristicas

- Variable a elegir para decidir
- Valor a elegir (minimo)
- Resitrcción para dividir y = 5 o y ≠ 5

---

Tecnicas de busqueda

- Backtracking
- Branch and bound (optimización)
- Puede combinar con propagación de restricciones
- Backtraing inteligente (programarlo)

---

Backtracking

- Nodos son generados en la ejecución
- Nodos son CSP
- Hojas puede ser resueltos o fallidos

---

Branch and bound

Tenemos que incluir una función heuristica, la función heuristica que tan buena es la solución (valor cercano a 0 en parecido al optimo)

---

Consistencioa

El dominio de las variables en cada nodo tiene valores que satisfacen a las restricciones, como esto se cumple para cada restricción C se llama arco consistente

# Resumen

Basado en el contenido de la clase, aquí está un resumen sobre CSP (Constraint Satisfaction Problems):

**1. Definición de CSP**

- Consiste en un conjunto de variables X
- Cada variable tiene su propio dominio
- La solución debe pertenecer al producto cartesiano de los dominios
- Contiene restricciones que deben ser satisfechas

**2. Características importantes**

- Un CSP está resuelto cuando todas las restricciones se cumplen y no hay dominios vacíos
- Un CSP es insatisfactible cuando contiene restricciones contradictorias o dominios vacíos

**3. Esquema de resolución**

- Preprocesamiento: Incluir restricciones
- Propagación de restricciones: Acotar dominios a valores factibles
- Split (división) cuando no hay valor atómico

**4. Objetivos posibles**

- Encontrar una o todas las soluciones
- Determinar si no existe solución
- Encontrar la mejor solución o todas las mejores soluciones
- Encontrar soluciones con un error dado