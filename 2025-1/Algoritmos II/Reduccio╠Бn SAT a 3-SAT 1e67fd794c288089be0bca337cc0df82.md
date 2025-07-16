# Reducción SAT a 3-SAT

# SAT

Es un problema NPC por definición, lo demostró Stephen Cook en 1971

Cualquier problema NPC puede ser reducido a SAT en tiempo polinomial

Si SAT se pudiera resolver en tiempo polinomial, implicaría que todos los problemas en la clase NPC también podrían resolverse en tiempo polinomial, ya que cualquier problema NPC puede ser reducido a SAT en tiempo polinomial. Esto tendría enormes implicaciones en aplicaciones de la vida real, como la optimización, el diseño de circuitos, la planificación, la seguridad informática (particularmente en criptografía, donde muchos algoritmos dependen de la dificultad de resolver problemas NP), y la inteligencia artificial. Resolver SAT en tiempo polinomial podría revolucionar la forma en que abordamos problemas complejos en múltiples disciplinas.

El algoritmo más actual para resolver SAT es el algoritmo CDCL (Conflict-Driven Clause Learning), que es la base de muchos solucionadores modernos de SAT como MiniSat y Glucose. Sin embargo, la cota de su complejidad en el peor caso sigue siendo exponencial, es decir, $O(2^n)$ en el tamaño del problema.

Algunos ejemplos de problemas NP Completos incluyen:

- **SAT (Satisfiability Problem):** Determinar si existe una asignación de valores de verdad que haga verdadera una fórmula booleana.
- **3-SAT:** Una variante del problema SAT donde cada cláusula tiene exactamente tres literales.
- **Problema de la Mochila (Knapsack Problem):** Decidir si es posible seleccionar un subconjunto de elementos con pesos y valores dados que maximice el valor total sin exceder un peso máximo.
- **Problema del Viajero (Traveling Salesman Problem - TSP):** Encontrar el recorrido más corto que pase por todas las ciudades exactamente una vez y regrese al punto de inicio.
- **Problema de la Coloreabilidad de Grafos:** Determinar si un grafo puede ser coloreado con un número dado de colores sin que dos vértices adyacentes compartan el mismo color.
- **Problema del Conjunto Dominante (Dominating Set Problem):** Encontrar un conjunto mínimo de vértices en un grafo tal que todos los demás vértices estén adyacentes a al menos uno de los vértices del conjunto.
- **Corte Mínimo (Minimum Cut):** Determinar el menor número de aristas que deben eliminarse en un grafo para dividirlo en dos componentes conectados.

- **Optimización de rutas de entrega:** Encontrar la mejor ruta para una flota de camiones que debe realizar entregas en múltiples ubicaciones, minimizando el tiempo o el costo de transporte. Este problema está relacionado con el Problema del Viajero (TSP).
- **Planificación de horarios:** Asignar horarios a clases, exámenes o reuniones de manera que no haya conflictos y se cumplan restricciones específicas. Esto es similar a problemas de coloreabilidad de grafos.
- **Diseño de circuitos electrónicos:** Minimizar el número de compuertas lógicas en un circuito digital mientras se asegura que funcione correctamente para todas las entradas posibles. Este tipo de problema puede ser modelado como SAT o 3-SAT.
- **Optimización en redes:** Determinar la forma más eficiente de enrutar datos a través de una red para evitar congestión y minimizar la latencia, relacionado con problemas como el Corte Mínimo.
- **Seguridad informática:** Evaluar la vulnerabilidad de sistemas criptográficos. Muchos algoritmos de criptografía se basan en la dificultad de resolver problemas NP, como la factorización de números grandes o el logaritmo discreto.
- **Planificación de proyectos:** Asignar recursos limitados (por ejemplo, personas, tiempo, presupuesto) a tareas en un proyecto grande, optimizando el tiempo total de finalización y cumpliendo con restricciones de recursos, relacionado con problemas de optimización.
- **Reconstrucción de ADN:** Encontrar la secuencia más probable de ADN a partir de fragmentos incompletos, utilizado en biología computacional para análisis genómicos.
- **Asignación de tareas en computación en la nube:** Determinar la forma más eficiente de asignar recursos de servidores a tareas de manera que se minimicen los costos operativos y se maximice el rendimiento.

## Definición formal de SAT

Es un conjunto V de n variables y C de m clausulas en FNC (Conjunción de disyunciones)

$$
C = (x \vee y \vee z \vee \neg w) \wedge (y \vee \neg z)
$$

### ¿Porque SAT es NP?

Porque podemos verificar una asignación de variables V en tiempo polinomial, lo podemos certificar

- Si la entrada es satisfactible entonces al reemplazar obtenemos V
- Si la entrada no es satisfactible entonces al reemplazar obtenemos F

La complejidad es $\sum\limits_{c_i \in C}{} |c_i|$ ⇒ kC k tamaño promedio de las clausulas O(C)

### ¿Porque es NP duro?

Asumiendo una maquina de Turing no determinista se puede resolver el problema bajo el siguiente esquema

1. la maquina llega a un estado de aceptación si SAT es satisfactible de lo contrario no se llega a un aceptación
2. El número de variables es polinomial, la combinatoria es $2^n$ variables, pero la maquina puede evaluar por cada variable sus posibilidades al tiempo, intuitivamente evalua la combinatoria de cada variable en un solo paso, lo que toma un tiempo polinomial
3. El número de clausulas es polinomial en el tamaño de la maquina

## Lema de NP completitud

Si B es un problema tal que $A \leq_p B$ para algún $A \in NPC$ entonces B es NP-Hard,además si $B \in NP$ entonces $B \in NPC$ 

# Problema 3SAT

El problema 3SAT es una colección de C clausulas en FNC con exactamente 3 literales

Un ejemplo de una instancia de 3SAT sería:

$(x_1 \vee \neg x_2 \vee x_3) \wedge (\neg x_1 \vee x_2 \vee \neg x_4) \wedge (x_3 \vee x_4 \vee \neg x_5)$

En esta instancia, hay tres cláusulas, y cada cláusula tiene exactamente tres literales.

## Demostración de que 3SAT es NPC

### ¿3SAT es NP?

¿Lo puedo verificar en tiempo polinomial?

Suponga que tienes C clausulas y V variables, entonces una instancia va ser siempre

$$
C = (x_1,x_2,x_3),(....),.....,(x_n,x_m,x_t)
$$

Vamos a verificar siempre 3 variables por clausula por lo tanto la verificación toma tiempo $O(3|C|) = O(|C|)$

Supongamos que tenemos la siguiente fórmula en 3SAT:

$(x_1 \vee \neg x_2 \vee x_3) \wedge (\neg x_1 \vee x_2 \vee \neg x_4) \wedge (x_3 \vee x_4 \vee \neg x_5)$

Asignemos valores a las variables: $x_1 = \text{True}, x_2 = \text{True}, x_3 = \text{True}, x_4 = \text{True}, x_5 = \text{False}$

Verifiquemos cada cláusula:

1. Primera cláusula: $x_1 \vee \neg x_2 \vee x_3 = \text{True} \vee \text{False} \vee \text{True} = \text{True}$
2. Segunda cláusula: $\neg x_1 \vee x_2 \vee \neg x_4 = \text{False} \vee \text{True} \vee \text{False} = \text{True}$
3. Tercera cláusula: $x_3 \vee x_4 \vee \neg x_5 = \text{True} \vee \text{True} \vee \text{True} = \text{True}$

En este caso, la fórmula es satisfactible, la verificación de si una asignación satisface o no la fórmula se realiza evaluando cláusula por cláusula, lo cual toma tiempo proporcional al número de cláusulas, es decir, tiempo $O(|C|)$. Esto confirma que el problema 3SAT puede ser verificado en tiempo polinomial.

Por lo tanto el problema es NP.

### Demostrar que 3SAT es NP-Hard

Tenemos que partir de un problema NP completo conocido

$$
SAT \leq_p 3SAT
$$

1. Para clausulas de tamaño 1, nos toca crear 2 variables y cuatro clasulas

### Reducción de cláusulas de tamaño 2 de SAT a 3SAT

La reducción de cláusulas de tamaño 2 en SAT a 3SAT implica transformar cada cláusula de tamaño 2 en un conjunto de cláusulas equivalentes que cumplan con la restricción de tener exactamente 3 literales por cláusula. Para lograr esto, se introducen variables adicionales.

### Proceso de reducción:

1. Tomemos una cláusula de tamaño 2, por ejemplo, (x1 ∨ x2).
2. Introducimos una nueva variable adicional, v1.
3. Transformamos la cláusula (x1 ∨ x2) en dos cláusulas de tamaño 3:
    - (x1 ∨ x2 ∨ v1)
    - (x1 ∨ x2 ∨ ¬v1)

Estas dos cláusulas son equivalentes a la cláusula original (x1 ∨ x2). Siempre se puede satisfacer una de estas cláusulas si y solo si la cláusula original es verdadera.

### Ejemplo:

Consideremos la cláusula (a ∨ b). Para reducirla a 3SAT:

1. Introducimos una variable adicional, v1.
2. La transformamos en:
    - (a ∨ b ∨ v1)
    - (a ∨ b ∨ ¬v1)

Estas dos cláusulas juntas son equivalentes a la cláusula original (a ∨ b).

### Complejidad computacional:

La reducción introduce exactamente 2 cláusulas para cada cláusula de tamaño 2 en SAT. Por lo tanto, si el problema original tiene m cláusulas de tamaño 2, la transformación generará 2m cláusulas adicionales. La complejidad de la reducción es lineal con respecto al número de cláusulas transformadas, es decir, O(m), lo que es computacionalmente eficiente y polinomial.

1. ara clausulas de tamaño 2, vamos a crear una variable adicional y vamos a crear dos clasulas, la primera con la variable y la clausula original; la otra con la negada

### Reducción de cláusulas de tamaño 2 de SAT a 3SAT

La reducción de cláusulas de tamaño 2 en SAT a 3SAT implica transformar cada cláusula de tamaño 2 en un conjunto de cláusulas equivalentes que cumplan con la restricción de tener exactamente 3 literales por cláusula. Esto se logra introduciendo variables adicionales para cumplir la restricción y preservar la satisfactibilidad del problema.

### Proceso de reducción:

1. Dada una cláusula de tamaño 2, por ejemplo, (x1 ∨ x2), introducimos una nueva variable adicional, v1.
2. Transformamos la cláusula (x1 ∨ x2) en las siguientes dos cláusulas de tamaño 3:
    - (x1 ∨ x2 ∨ v1)
    - (x1 ∨ x2 ∨ ¬v1)

Estas dos cláusulas juntas son equivalentes a la cláusula original (x1 ∨ x2). Al menos una de las dos será verdadera si y solo si la cláusula original es verdadera.

### Ejemplo:

Consideremos la cláusula (a ∨ c). Para reducirla a 3SAT:

1. Introducimos una variable adicional, v1.
2. Transformamos la cláusula (a ∨ c) en las siguientes dos cláusulas:
    - (a ∨ c ∨ v1)
    - (a ∨ c ∨ ¬v1)

Estas dos cláusulas son equivalentes a la cláusula original (a ∨ c). Si la cláusula original es satisfactible, entonces al menos una de las nuevas cláusulas también lo será.

### Complejidad computacional:

La reducción introduce exactamente 2 cláusulas para cada cláusula de tamaño 2 en SAT. Por lo tanto, si el problema original tiene m cláusulas de tamaño 2, la transformación generará 2m cláusulas adicionales. Este proceso tiene una complejidad computacional lineal en función del número de cláusulas transformadas, es decir, O(m). Esto asegura que la reducción es computacionalmente eficiente y polinomial.

Tamaño 3 está en formato 3SAT, nada que hacer

1. Tamaño 4 o superior
    1. Crear k-1 variables
    2. Genera la forma
    
    (z₁ ∨ z₂ ∨ v₁) ∧ (¬v₁ ∨ z₃ ∨ v₂) ∧ (¬v₂ ∨ z₄ ∨ v₃) ∧ ...
    (¬vᵢ ∨ zᵢ₊₂ ∨ vᵢ₊₁) ∧ ... (¬vₖ₋₄ ∨ zₖ₋₂ ∨ vₖ₋₃) ∧ (¬vₖ₋₃ ∨ zₖ₋₁ ∨ zₖ)
    

### Reducción de cláusulas de tamaño 4 o superior de SAT a 3SAT

La reducción de cláusulas de tamaño 4 o superior en SAT a 3SAT implica transformar cada cláusula en un conjunto de cláusulas equivalentes que cumplan con la restricción de tener exactamente 3 literales por cláusula. Para lograr esto, se introducen variables adicionales y se divide la cláusula original en varias cláusulas más pequeñas.

### Proceso de reducción:

1. Dada una cláusula con más de 3 literales, se introducen variables adicionales (v1, v2, ..., vn) para dividir la cláusula en varias cláusulas de tamaño 3.
2. La transformación sigue el siguiente esquema general:
    - Una cláusula de tamaño k se divide en (k - 2) cláusulas de tamaño 3.
    - La primera cláusula incluye los dos primeros literales y una nueva variable adicional.
    - Cada cláusula subsiguiente incluye la negación de la variable adicional anterior, el siguiente literal en la cláusula original y otra nueva variable adicional (excepto la última cláusula, que no introduce una nueva variable).

### Ejemplo 1: Cláusula de tamaño 4

Supongamos la cláusula (x1 ∨ x2 ∨ x3 ∨ x4). Introducimos una variable adicional v1 y la transformamos en las siguientes cláusulas de tamaño 3:

1. (x1 ∨ x2 ∨ v1)
2. (¬v1 ∨ x3 ∨ x4)

Estas dos cláusulas son equivalentes a la cláusula original.

### Ejemplo 2: Cláusula de tamaño 5

Supongamos la cláusula (x1 ∨ x2 ∨ x3 ∨ x4 ∨ x5). Introducimos dos variables adicionales, v1 y v2, y la transformamos en las siguientes cláusulas de tamaño 3:

1. (x1 ∨ x2 ∨ v1)
2. (¬v1 ∨ x3 ∨ v2)
3. (¬v2 ∨ x4 ∨ x5)

Estas tres cláusulas son equivalentes a la cláusula original.

### Ejemplo 3: Cláusula de tamaño 6

Supongamos la cláusula (x1 ∨ x2 ∨ x3 ∨ x4 ∨ x5 ∨ x6). Introducimos tres variables adicionales, v1, v2 y v3, y la transformamos en las siguientes cláusulas de tamaño 3:

1. (x1 ∨ x2 ∨ v1)
2. (¬v1 ∨ x3 ∨ v2)
3. (¬v2 ∨ x4 ∨ v3)
4. (¬v3 ∨ x5 ∨ x6)

Estas cuatro cláusulas son equivalentes a la cláusula original.

### Complejidad computacional de la reducción

Para una cláusula de tamaño k, se generan (k - 2) cláusulas de tamaño 3 y se introducen (k - 3) variables adicionales. Por lo tanto:

- Si el número total de literales en las cláusulas originales es |C|, el número de nuevas cláusulas generadas será proporcional a |C|.
- La complejidad computacional de la reducción es lineal respecto al tamaño de la entrada, es decir, O(|C|).

Esta transformación asegura que el problema sigue siendo computacionalmente eficiente y se mantiene dentro de la clase NP, ya que la reducción se realiza en tiempo polinomial.

### Demostración de la correctitud de la reducción

Para saber que la reducción es correcta, debemos analizar cada caso

1. Clasulas de tamaño 1, instancias positivas → instancias positivas, instancias negativas → instancias negativas 

La reducción de cláusulas de tamaño 1 de SAT a 3SAT es correcta porque preserva la satisfactibilidad de la fórmula original al transformar cada cláusula de tamaño 1 en una forma equivalente en 3SAT.

### Proceso de reducción para cláusulas de tamaño 1:

1. Una cláusula de tamaño 1 en SAT tiene la forma `(x1)`, donde `x1` es un literal.
2. Para convertir esta cláusula en una forma válida en 3SAT, se introducen dos nuevas variables auxiliares, por ejemplo, `v1` y `v2`.
3. La cláusula `(x1)` se transforma en las siguientes tres cláusulas de 3 literales:
    - `(x1 ∨ v1 ∨ v2)`
    - `(x1 ∨ ¬v1 ∨ v2)`
    - `(x1 ∨ v1 ∨ ¬v2)`
    - `(x1 ∨ ¬v1 ∨ ¬v2)`

Estas cláusulas son equivalentes a la cláusula original `(x1)` porque garantizan que si `x1` es verdadero, al menos una de las cláusulas será satisfactible. Si `x1` es falso, todas las cláusulas serán insatisfactibles.

### Correctitud de la reducción:

### Caso 1: Instancias positivas de SAT (satisfactibles)

- Una instancia positiva de SAT tiene al menos una asignación de valores que satisface la fórmula original.
- Para una cláusula de tamaño 1 `(x1)`, si `x1 = True`, entonces todas las cláusulas generadas en 3SAT serán verdaderas porque incluyen el literal `x1`. Por lo tanto, la instancia de 3SAT también será satisfactible.
- Esto asegura que si una instancia de SAT es positiva, la instancia reducida de 3SAT también será positiva.

### Caso 2: Instancias negativas de SAT (insatisfactibles)

- Una instancia negativa de SAT no tiene ninguna asignación de valores que satisfaga la fórmula original.
- Para una cláusula de tamaño 1 `(x1)`, si `x1 = False`. La combinaria de v1 y v2 va hacer que alguna clasula sea falsa.
- Esto asegura que si una instancia de SAT es negativa, la instancia reducida de 3SAT también será negativa.

### Conclusión

La reducción de cláusulas de tamaño 1 de SAT a 3SAT preserva la satisfactibilidad de la fórmula porque:

1. Las instancias positivas de SAT generan instancias positivas de 3SAT.
2. Las instancias negativas de SAT generan instancias negativas de 3SAT.

Por lo tanto, la reducción es correcta.

1. Caso 2, clasulas de tamaño 2 entonces si uno de los literales es verdadero todo se vuelve verdadero, en otro caso si las variables dan falso, no hay combinación en v1 o ~v1 tal que de verdadero.

### Correctitud de la reducción de cláusulas de tamaño 2 de SAT a 3SAT

Para demostrar que la reducción de cláusulas de tamaño 2 de SAT a 3SAT es correcta, debemos demostrar que:

1. **Instancias positivas de SAT generan instancias positivas de 3SAT.**
2. **Instancias negativas de SAT generan instancias negativas de 3SAT.**

La reducción transforma una cláusula de tamaño 2, como `(x1 ∨ x2)`, en dos cláusulas de tamaño 3 al agregar una nueva variable auxiliar, `v1`:

- `(x1 ∨ x2 ∨ v1)`
- `(x1 ∨ x2 ∨ ¬v1)`

Ahora analizaremos ambos casos.

---

### Caso 1: Instancias positivas de SAT

Si una instancia de SAT es positiva, significa que existe una asignación de valores de verdad a las variables originales que hace que todas las cláusulas en SAT sean verdaderas.

1. Sea `(x1 ∨ x2)` una cláusula en SAT, y supongamos que existe una asignación tal que al menos uno de los literales, `x1` o `x2`, es verdadero.
2. En la reducción a 3SAT, la cláusula `(x1 ∨ x2)` se transforma en:
    - `(x1 ∨ x2 ∨ v1)`
    - `(x1 ∨ x2 ∨ ¬v1)`
3. Si `x1` o `x2` es verdadero, entonces ambas nuevas cláusulas serán verdaderas independientemente del valor de la variable auxiliar `v1`. Esto se debe a que en una disyunción, si al menos uno de los literales es verdadero, toda la cláusula es verdadera.
4. Por lo tanto, cualquier asignación que satisfaga la cláusula original de SAT también satisfará las cláusulas resultantes en 3SAT.

**Conclusión para instancias positivas:** Si una instancia de SAT es satisfactible, la instancia reducida de 3SAT también será satisfactible.

---

### Caso 2: Instancias negativas de SAT

Si una instancia de SAT es negativa, significa que no existe ninguna asignación de valores de verdad a las variables originales que haga que todas las cláusulas en SAT sean verdaderas.

1. Sea `(x1 ∨ x2)` una cláusula en SAT que no puede ser satisfecha, lo que implica que `x1 = False` y `x2 = False`.
2. En la reducción a 3SAT, esta cláusula se transforma en:
    - `(x1 ∨ x2 ∨ v1)`
    - `(x1 ∨ x2 ∨ ¬v1)`
3. Dado que `x1 = False` y `x2 = False`, las cláusulas reducidas dependen únicamente de los valores asignados a la variable auxiliar `v1`:
    - La primera cláusula `(x1 ∨ x2 ∨ v1)` se reduce a `v1`.
    - La segunda cláusula `(x1 ∨ x2 ∨ ¬v1)` se reduce a `¬v1`.
4. No existe ningún valor de `v1` que pueda satisfacer ambas cláusulas simultáneamente:
    - Si `v1 = True`, la primera cláusula es verdadera, pero la segunda cláusula es falsa.
    - Si `v1 = False`, la segunda cláusula es verdadera, pero la primera cláusula es falsa.

Por lo tanto, si la cláusula original `(x1 ∨ x2)` no es satisfactible, las cláusulas reducidas en 3SAT tampoco serán satisfactibles.

**Conclusión para instancias negativas:** Si una instancia de SAT no es satisfactible, la instancia reducida de 3SAT tampoco será satisfactible.

---

### Conclusión general

La reducción de cláusulas de tamaño 2 de SAT a 3SAT es correcta porque:

1. **Instancias positivas de SAT generan instancias positivas de 3SAT.** Si una cláusula de SAT puede ser satisfecha, la introducción de la variable auxiliar (`v1`) no impide que las cláusulas resultantes en 3SAT también sean satisfechas.
2. **Instancias negativas de SAT generan instancias negativas de 3SAT.** Si una cláusula de SAT no puede ser satisfecha, la introducción de la variable auxiliar asegura que las cláusulas resultantes en 3SAT tampoco puedan ser satisfechas, debido a la imposibilidad de asignar un valor a `v1` que satisfaga ambas cláusulas simultáneamente.

Esta propiedad asegura que la reducción preserva la satisfactibilidad y, por lo tanto, es correcta.

1. Clausulas de tamaño 4 o superior, en instancias positivas tenemos una clausula verdadera y luna combinación de variables nos va a dar satisfactible, por otrar parte, en instancias negativa sva a suceder que si todas las variables de la clausula son falsas, necesariamente ninguna de la combinación de variables agregadas va a permitir que de verdadero

3. Clausulas de tamaño 4 superior 

### Correctitud de la reducción de cláusulas de tamaño 4 o superior de SAT a 3SAT

La reducción de cláusulas de tamaño 4 o superior de SAT a 3SAT implica dividir la cláusula original en varias cláusulas de tamaño 3 mediante la introducción de variables adicionales. Ahora demostraremos que esta reducción es correcta, es decir:

1. **Instancias positivas de SAT generan instancias positivas de 3SAT.**
2. **Instancias negativas de SAT generan instancias negativas de 3SAT.**

### Proceso de reducción

Dada una cláusula de tamaño k, por ejemplo, (x1 ∨ x2 ∨ x3 ∨ ... ∨ xk), introducimos (k - 3) variables adicionales (v1, v2, ..., vk-3) y la transformamos en (k - 2) cláusulas de tamaño 3 de la siguiente forma:

1. Primera cláusula: (x1 ∨ x2 ∨ v1)
2. Segunda cláusula: (¬v1 ∨ x3 ∨ v2)
3. Tercera cláusula: (¬v2 ∨ x4 ∨ v3)
4. ...
5. Última cláusula: (¬vk-3 ∨ xk-1 ∨ xk)

El objetivo es preservar la satisfactibilidad de la cláusula original.

---

### Caso 1: Instancias positivas de SAT

Si una instancia de SAT es positiva, significa que existe al menos una asignación de valores de verdad a las variables originales que hace que la cláusula original sea verdadera.

1. Sea la cláusula original (x1 ∨ x2 ∨ x3 ∨ ... ∨ xk) en SAT, y supongamos que existe una asignación tal que al menos uno de los literales (por ejemplo, xi) es verdadero.
2. En la reducción a 3SAT, esta cláusula se transforma en varias cláusulas de tamaño 3. Cada cláusula tiene la forma:
    - Primera cláusula: (x1 ∨ x2 ∨ v1)
    - Segunda cláusula: (¬v1 ∨ x3 ∨ v2)
    - ...
    - Última cláusula: (¬vk-3 ∨ xk-1 ∨ xk)
3. Si al menos uno de los literales originales (x1, x2, ..., xk) es verdadero, será posible satisfacer todas las cláusulas generadas. Esto se debe a que las variables adicionales (v1, v2, ..., vk-3) solo actúan como "puentes" entre las cláusulas, y no afectan la satisfactibilidad mientras al menos uno de los literales originales sea verdadero.
4. Por lo tanto, cualquier asignación que haga verdadera la cláusula original también hará verdaderas todas las cláusulas de 3SAT generadas por la reducción.

**Conclusión para instancias positivas:** Si una instancia de SAT es satisfactible, la instancia reducida de 3SAT también será satisfactible.

---

### Caso 2: Instancias negativas de SAT

Si una instancia de SAT es negativa, significa que no existe ninguna asignación de valores de verdad a las variables originales que haga verdadera la cláusula original. Ahora demostraremos que, en este caso, tampoco será posible satisfacer las cláusulas generadas en 3SAT.

1. Sea la cláusula original (x1 ∨ x2 ∨ x3 ∨ ... ∨ xk) en SAT, y supongamos que todas las variables originales (x1, x2, ..., xk) son falsas bajo cualquier asignación.
2. En la reducción a 3SAT, esta cláusula se transforma en varias cláusulas de tamaño 3:
    - Primera cláusula: (x1 ∨ x2 ∨ v1)
    - Segunda cláusula: (¬v1 ∨ x3 ∨ v2)
    - ...
    - Última cláusula: (¬vk-3 ∨ xk-1 ∨ xk)
3. Dado que todos los literales originales (x1, x2, ..., xk) son falsos, las nuevas cláusulas dependen únicamente de las combinaciones de valores de las variables auxiliares (v1, v2, ..., vk-3).

### Análisis de las combinaciones de las variables auxiliares

Cada cláusula incluye una variable auxiliar y su negación en una cláusula posterior. Por ejemplo:

- La primera cláusula incluye v1: (x1 ∨ x2 ∨ v1).
- La segunda cláusula incluye ¬v1: (¬v1 ∨ x3 ∨ v2).

Esto significa que:

- Si v1 es verdadero, la primera cláusula puede ser verdadera. Sin embargo, ¬v1 será falso, lo que afecta a la segunda cláusula.
- Si v1 es falso, la primera cláusula será falsa, lo que rompe la satisfactibilidad.

De manera similar, este razonamiento se aplica a todas las variables auxiliares (v1, v2, ..., vk-3). Si todas las variables originales son falsas, ninguna combinación de valores para las variables auxiliares podrá hacer verdadera la fórmula reducida porque siempre habrá una cláusula que no pueda ser satisfecha.

### Ejemplo

Supongamos la cláusula original (x1 ∨ x2 ∨ x3 ∨ x4 ∨ x5). Si x1 = x2 = x3 = x4 = x5 = False, la reducción produce:

- (x1 ∨ x2 ∨ v1)
- (¬v1 ∨ x3 ∨ v2)
- (¬v2 ∨ x4 ∨ x5)

Dado que x1, x2, x3, x4 y x5 son falsos:

- La primera cláusula depende de v1. Si v1 = True, la primera cláusula es verdadera, pero la segunda cláusula será falsa porque ¬v1 será falso.
- Si v1 = False, la primera cláusula será falsa.
- Este patrón se repite para v2 en la segunda y tercera cláusula.

Por lo tanto, no existe ninguna asignación de valores para v1 y v2 que pueda satisfacer todas las cláusulas simultáneamente.

**Conclusión para instancias negativas:** Si una instancia de SAT no es satisfactible, la instancia reducida de 3SAT tampoco será satisfactible.

---

### Conclusión general

La reducción de cláusulas de tamaño 4 o superior de SAT a 3SAT es correcta porque:

1. **Instancias positivas de SAT generan instancias positivas de 3SAT.** Si una cláusula de SAT es satisfactible, las variables auxiliares no impiden que las cláusulas de 3SAT sean satisfechas.
2. **Instancias negativas de SAT generan instancias negativas de 3SAT.** Si una cláusula de SAT no es satisfactible, las variables auxiliares no pueden "forzar" la satisfactibilidad de las cláusulas de 3SAT generadas.

Esto asegura que la reducción preserva la satisfactibilidad y, por lo tanto, es correcta.

### Conclusión

1. 3SAT es NP (certificado)
2. 3SAT es NPC a partir de la reducción desde SAT
3. Por lo tanto, 3SAT es NPC

# Ejemplo

![image.png](Reduccio%CC%81n%20SAT%20a%203-SAT%201e67fd794c288089be0bca337cc0df82/image.png)

### Reducción paso a paso de SAT a 3SAT

Dada la instancia SAT:

1. (x1 ∨ ¬x3)
2. (x4 ∨ x5 ∨ ¬x3 ∨ x6)
3. (x5)
4. (x1 ∨ x2 ∨ x5 ∨ ¬x4 ∨ x6)

### Paso 1: Clausulas de tamaño 2

Para las cláusulas con 2 literales, como (x1 ∨ ¬x3), introducimos una nueva variable auxiliar v1 y generamos dos cláusulas de tamaño 3:

- (x1 ∨ ¬x3 ∨ v1)
- (x1 ∨ ¬x3 ∨ ¬v1)

### Paso 2: Clausulas de tamaño 4

Para las cláusulas con 4 literales, como (x4 ∨ x5 ∨ ¬x3 ∨ x6), introducimos una nueva variable auxiliar v2 y la transformamos en dos cláusulas de tamaño 3:

- (x4 ∨ x5 ∨ v2)
- (¬v2 ∨ ¬x3 ∨ x6)

### Paso 3: Clausulas de tamaño 1

Para las cláusulas con 1 literal, como (x5), introducimos dos nuevas variables auxiliares v3 y v4, y generamos las siguientes cláusulas de tamaño 3:

- (x5 ∨ v3 ∨ v4)
- (x5 ∨ ¬v3 ∨ v4)
- (x5 ∨ v3 ∨ ¬v4)
- (x5 ∨ ¬v3 ∨ ¬v4)

### Paso 4: Clausulas de tamaño 5

Para las cláusulas con 5 literales, como (x1 ∨ x2 ∨ x5 ∨ ¬x4 ∨ x6), introducimos dos nuevas variables auxiliares v5 y v6, y la transformamos en tres cláusulas de tamaño 3:

- (x1 ∨ x2 ∨ v5)
- (¬v5 ∨ x5 ∨ v6)
- (¬v6 ∨ ¬x4 ∨ x6)

### Resultado final

La instancia inicial de SAT se reduce a la siguiente instancia equivalente en 3SAT:

1. (x1 ∨ ¬x3 ∨ v1)
2. (x1 ∨ ¬x3 ∨ ¬v1)
3. (x4 ∨ x5 ∨ v2)
4. (¬v2 ∨ ¬x3 ∨ x6)
5. (x5 ∨ v3 ∨ v4)
6. (x5 ∨ ¬v3 ∨ v4)
7. (x5 ∨ v3 ∨ ¬v4)
8. (x5 ∨ ¬v3 ∨ ¬v4)
9. (x1 ∨ x2 ∨ v5)
10. (¬v5 ∨ x5 ∨ v6)
11. (¬v6 ∨ ¬x4 ∨ x6)

### Resumen

Este documento aborda el problema SAT (Satisfiability Problem), un problema fundamental en la teoría de la complejidad computacional y clasificado como NP-Completo (NPC). Además, desarrolla cómo SAT puede reducirse al problema 3-SAT, otra variante NPC que restringe las fórmulas booleanas a cláusulas de exactamente tres literales. A continuación, se destacan los puntos más importantes:

### Características principales:

- **SAT y 3-SAT:** Ambos son problemas fundamentales en la teoría de la complejidad, utilizados para modelar y resolver problemas prácticos como optimización, diseño de circuitos, planificación, seguridad informática, entre otros.
- **Reducción SAT a 3-SAT:** Se explica cómo transformar cualquier cláusula booleana de SAT a una forma equivalente en 3-SAT mediante la introducción de variables auxiliares y reglas específicas para cláusulas de tamaño 1, 2 y superiores.
- **Correctitud de la reducción:** La reducción preserva la satisfactibilidad, asegurando que cualquier instancia positiva o negativa de SAT se traduzca correctamente en 3-SAT.
- **Demostración de que 3-SAT es NPC:** Se verifica que 3-SAT es NP (verificable en tiempo polinomial) y NP-Hard (cualquier problema NPC puede reducirse a él).

### Ventajas:

1. **Versatilidad:** SAT y 3-SAT son herramientas poderosas para modelar una amplia variedad de problemas reales en optimización, inteligencia artificial, seguridad informática, entre otros.
2. **Base teórica sólida:** La reducción de SAT a 3-SAT garantiza que el análisis de complejidad es consistente y aplicable a problemas más específicos.
3. **Soluciones modernas:** Algoritmos como CDCL han permitido avances significativos en la resolución de instancias prácticas de SAT y 3-SAT.

### Desventajas:

1. **Complejidad:** La resolución de SAT y 3-SAT en el peor caso sigue siendo exponencial, lo que limita su aplicabilidad para problemas de gran escala.
2. **Introducción de variables auxiliares:** La reducción de SAT a 3-SAT puede aumentar significativamente el tamaño del problema, incrementando el número de cláusulas y variables.

### Mensaje motivacional

¡Hola estudiante!

Sabemos que temas como SAT y 3-SAT pueden parecer abstractos o incluso aburridos, pero quiero que te detengas un momento y pienses en todo lo que estas herramientas permiten. Desde diseñar circuitos electrónicos hasta optimizar rutas de entrega y garantizar la seguridad de tus datos en internet, estos conceptos están en el corazón de los sistemas que usamos diariamente.

Estudiar SAT y 3-SAT no es solo aprender sobre fórmulas y teorías, es adquirir habilidades para resolver los problemas más complejos de la actualidad. ¡Eres parte de una generación que puede usar estas herramientas para cambiar el mundo! Así que no lo veas como un obstáculo, sino como una oportunidad de entender cómo funciona la tecnología que nos rodea y cómo tú puedes mejorarla.

¡Tú tienes el potencial de aportar algo increíble al campo de la computación y mucho más! Sigue adelante, porque este conocimiento te dará un superpoder: la capacidad de resolver problemas que otros ni siquiera se atreven a enfrentar. 🚀

¡Ánimo, puedes con esto!