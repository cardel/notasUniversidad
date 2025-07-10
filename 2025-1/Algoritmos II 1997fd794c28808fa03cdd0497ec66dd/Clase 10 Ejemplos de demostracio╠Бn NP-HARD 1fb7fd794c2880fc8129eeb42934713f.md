# Clase 10 Ejemplos de demostración NP-HARD

# Programación entera IP

El problema de programación entera (IP) es un problema de optimización donde buscamos maximizar o minimizar una función objetivo sujeta a un conjunto de restricciones. En este caso, estamos tratando de maximizar una función f, donde también se requiere que f sea mayor o igual a un valor entero B. Además, todas las variables de decisión en un IP deben tomar valores enteros.

Por ejemplo:

Función objetivo: maximizar f = 3x + 2y

Restricciones:

x + y <= 4

2x + y >= 5

f >= 6

x, y son enteros no negativos

## Demostracción que IP es NP - HARD

- ¿Es NP? ¿Es verificable en tiempo polinomial? Dado un certificado v (valores de variables) consiste en reemplazar todas las ecuaciones y verificar que se cumplen,  O(mn) m numero de desigualdades y n es el número de variables
- Se puede tomar NPC conocido y reducirlo a IP en este caso seleccionamos a 3SAT

## Estrategia de reducción

Idea: Simular cada variable booleana x de 3-SAT con un par de variables enteras x y x̄ de valor 0 (falso) o 1 (verdadero), representando el valor booleano de la variable y de su negación. Se requieren las siguientes restricciones para que esas variables enteras jueguen el rol de booleanas:

1. 0 ≤ x ≤ 1 y 0 ≤ x̄ ≤ 1, ambas variables estarán restringidas a valores 0 o 1. Esto las hace equivalentes a variables booleanas (true/false).
2. 1 ≤ x + x̄ ≤ 1, exactamente una de las dos variables es asociada al valor de 1. Esto asegura que sólo una de las dos variables, x o x̄, puede ser verdadera, y que una es el complemento de la otra.

Por cada cláusula Ci = (li1 ∨ li2 ∨ li3) en la instancia de 3-SAT, se construye una desigualdad:

li1 + li2 + li3 ≥ 1

Donde lj = x si lij = x, y lj = x̄ si lij = ¬x. Esto garantizará que al menos una variable en la cláusula sea asignada el valor 1 (es decir, verdadera).

### Ejemplo:

Dada la instancia de 3-SAT:

C1 = (x1 ∨ ¬x2 ∨ x3)

C2 = (¬x1 ∨ x2 ∨ ¬x3)

Las variables enteras correspondientes serían:

x1, x̄1, x2, x̄2, x3, x̄3

Restricciones para simular variables booleanas:

0 ≤ x1 ≤ 1, 0 ≤ x̄1 ≤ 1

0 ≤ x2 ≤ 1, 0 ≤ x̄2 ≤ 1

0 ≤ x3 ≤ 1, 0 ≤ x̄3 ≤ 1

1 ≤ x1 + x̄1 ≤ 1

1 ≤ x2 + x̄2 ≤ 1

1 ≤ x3 + x̄3 ≤ 1

Restricciones para las cláusulas:

Para C1 = (x1 ∨ ¬x2 ∨ x3):

x1 + x̄2 + x3 ≥ 1

Para C2 = (¬x1 ∨ x2 ∨ ¬x3):

x̄1 + x2 + x̄3 ≥ 1

Esto convierte la instancia de 3-SAT en un problema de programación entera (IP).

Las instancias positivas en 3-SAT se reducen a instancias positivas en IP. Esto ocurre porque una instancia positiva de 3-SAT implica que existe una asignación de verdad para cada variable x que satisface todas las cláusulas.

Para cada variable x en 3-SAT, existen dos variables correspondientes x y x̄ en IP. Cuando x es asignada como verdadero en 3-SAT, se considera x = 1 y x̄ = 0 en IP. Por el contrario, cuando x es asignada como falso en 3-SAT, se considera x = 0 y x̄ = 1 en IP.

Dada una cláusula Ci = (li1 ∨ li2 ∨ li3) en la instancia de 3-SAT, si la asignación satisface Ci, entonces también se cumple la desigualdad l1 + l2 + l3 ≥ 1. Como consecuencia, esta asignación satisface todas las desigualdades de la instancia en IP, ya que la original satisface todas las cláusulas de 3-S

Las instancias negativas en 3-SAT se reducen a instancias negativas en IP. Cuando una instancia de 3-SAT es negativa, significa que en cada asignación de verdad de cada variable x, al menos una cláusula queda sin satisfacer. Si esa cláusula es Ci = (li1 ∨ li2 ∨ li3) en la instancia de 3-SAT, entonces la asignación correspondiente en IP tampoco satisface la desigualdad l1 + l2 + l3 ≥ 1. En consecuencia, no existe solución para la instancia en IP, lo que confirma que también es una instancia negativa.

Complejidad de la reducción
La reducción se realiza en tiempo polinomial:
• Para n variables en 3-SAT, se generan 2n variables y 3n desigualdades en IP.
• Para m cláusulas en 3-SAT, se generan m desigualdades en IP.

# Vertex cover

Dado un grafo G = (V, E) y un entero k, el problema del Vertex Cover consiste en determinar si existe un subconjunto V' ⊆ V de tamaño |V'| ≤ k tal que para cada arista (u, v) ∈ E, al menos uno de los extremos u o v pertenece a V'.

VC ∈ NP
Dada una instancia positiva de VC y el certificado V', solo se debe verificar que cada arista tenga un vértice en V' y que |V'| ≤ k. Esto se puede hacer en tiempo O(m|V'| + |V'|), donde m es el número de aristas.

Para una instancia negativa de VC, ningún certificado podrá hacer que el algoritmo verifique la instancia, ya sea porque no cubre todas las aristas o porque excede el tamaño k permitido.

Por tanto, VC ∈ NP

Procedimiento de reducción

Dada una instancia de 3-SAT con n variables y c cláusulas, construimos un grafo G = (V, E) aplicando los siguientes pasos:

1. Por cada variable v en la instancia de 3-SAT, añadimos al conjunto de vértices V los nodos v y ¬v. Además, agregamos al conjunto de aristas E la arista (v, ¬v). Esto asegura que una variable y su negación no puedan ser verdaderas simultáneamente.
2. Por cada cláusula Ci = (li1 ∨ li2 ∨ li3) en la instancia de 3-SAT, añadimos un triángulo al grafo G. Este triángulo está formado por los vértices li1, li2, li3 y las aristas (li1, li2), (li1, li3), (li2, li3). Esto representa las tres literales en la cláusula y asegura que al menos una de ellas debe ser verdadera.
3. Para cada literal lij en una cláusula, conectamos su vértice en el triángulo al vértice correspondiente en las aristas de asignación. Por ejemplo, si lij = v, añadimos la arista (v, lij). Si lij = ¬v, añadimos la arista (¬v, lij). Esto asegura que las literales en las cláusulas estén conectadas con las variables originales.

Ejemplo:

Dada la instancia de 3-SAT con dos cláusulas:

C1 = (x1 ∨ ¬x2 ∨ x3)

C2 = (¬x1 ∨ x2 ∨ ¬x3)

Construimos el grafo G de la siguiente manera:

1. Añadimos los vértices x1, ¬x1, x2, ¬x2, x3, ¬x3 al conjunto V. También añadimos las aristas de asignación (x1, ¬x1), (x2, ¬x2), (x3, ¬x3) al conjunto E.
2. Para la cláusula C1 = (x1 ∨ ¬x2 ∨ x3), añadimos un triángulo formado por los vértices x1, ¬x2, x3. Esto incluye las aristas (x1, ¬x2), (x1, x3), (¬x2, x3).
3. Para la cláusula C2 = (¬x1 ∨ x2 ∨ ¬x3), añadimos un triángulo formado por los vértices ¬x1, x2, ¬x3. Esto incluye las aristas (¬x1, x2), (¬x1, ¬x3), (x2, ¬x3).
4. Conectamos los vértices de cada triángulo a los vértices correspondientes en las aristas de asignación. Por ejemplo, conectamos x1 en el triángulo de C1 con x1 en las aristas de asignación mediante la arista (x1, x1). Hacemos lo mismo para las demás literales.

El resultado es un grafo G = (V, E) donde resolver el problema del Vertex Cover con un tamaño k específico corresponde a determinar si existe una asignación de verdad para la instancia original de 3-SAT que satisfaga todas las cláusulas.

Instancias positivas en 3-SAT se reducen a instancias positivas en VC.

Si una instancia de 3-SAT es positiva, existe una asignación de verdad para cada variable v que satisface todas las cláusulas. Demostraremos que en el grafo producto de la reducción, existe un VC, V' de tamaño N + 2|C|.

Por cada variable v en 3-SAT, existe una arista de asignación (v, ¬v) ∈ E. Si v es asignada como verdadero en 3-SAT, consideramos v ∈ V'. En caso contrario, consideramos ¬v ∈ V'.

Dada una cláusula Ci = (li1 ∨ li2 ∨ li3) en la instancia de 3-SAT, supongamos que li1 = v es el literal satisfecho por la asignación de verdad. Entonces, la arista (li1, v) estaría cubierta porque v ∈ V. Luego incluimos li2, li3 ∈ V'.

Podemos asegurar que V' es un cubrimiento de G y que |V'| = N + 2|C|. Por lo tanto, G es una instancia positiva de VC.

Si una instancia de 3-SAT es negativa, significa que en cualquier asignación de verdad hay al menos una cláusula que no se satisface. Consideremos la cláusula Ci = (li1 ∨ li2 ∨ li3). Para cubrir el triángulo asociado a esta cláusula, se necesitan al menos dos vértices del triángulo, por ejemplo, li2 y li3. Estos vértices cubren las tres aristas del triángulo y también las dos aristas de conexión correspondientes. Sin embargo, surge un problema: ¿cómo cubrir la arista de conexión restante? Por lo tanto, G es una instancia negativa de VC.

[2025-05-22-Note-16-11_annotated.pdf](Clase%2010%20Ejemplos%20de%20demostracio%CC%81n%20NP-HARD%201fb7fd794c2880fc8129eeb42934713f/2025-05-22-Note-16-11_annotated.pdf)

### Resumen del Documento

Este documento explica dos problemas clásicos de la teoría de la complejidad computacional: **Programación Entera (IP)** y **Vertex Cover (VC)**, y su conexión con la clase de problemas NP-HARD mediante reducciones desde 3-SAT. A continuación, se resumen los aspectos más relevantes:

| **Problema** | **Descripción** | **Reducción desde 3-SAT** | **Complejidad** |
| --- | --- | --- | --- |
| **Programación Entera (IP)** | Problema de optimización que busca maximizar o minimizar una función objetivo con restricciones, donde las variables deben ser enteras. | Se simulan las variables booleanas de 3-SAT con variables enteras y se imponen restricciones que garantizan la equivalencia. Las cláusulas de 3-SAT se convierten en desigualdades lineales. | NP-HARD |
| **Vertex Cover (VC)** | Determinar si existe un subconjunto de vértices de tamaño ≤ k que cubra todas las aristas de un grafo. | Se construye un grafo a partir de las variables y cláusulas de 3-SAT. Las variables se representan como pares de vértices, y las cláusulas como triángulos conectados. Resolver VC en este grafo equivale a resolver la instancia de 3-SAT. | NP-HARD |

### Características Generales

1. **Programación Entera (IP):**
    - Representa un problema de optimización sujeto a desigualdades.
    - A través de la reducción desde 3-SAT, se demuestra que es NP-HARD.
    - Las variables enteras se restringen a valores 0 o 1 para simular el comportamiento booleano.
2. **Vertex Cover (VC):**
    - Relacionado con cubrir todas las aristas de un grafo con un subconjunto mínimo de vértices.
    - La reducción desde 3-SAT utiliza un grafo compuesto por triángulos conectados, donde cada triángulo representa una cláusula.
3. **Importancia de las Reducciones:**
    - Las reducciones polinomiales permiten demostrar que resolver un problema difícil (NP-HARD) implica la dificultad inherente de resolver otro problema conocido (como 3-SAT).

---

### Mensaje de Motivación

**¡Atención, estudiantes cansados y con sueño!**

Sabemos que entender los algoritmos y problemas NP-completos puede parecer una tarea abrumadora, pero aquí hay algo importante que recordar: **estos algoritmos no solo son un ejercicio académico, sino una herramienta fundamental en el desarrollo de software y resolución de problemas complejos.**

¿Por qué es importante? Porque muchos problemas reales, desde la optimización de rutas de entrega hasta la planificación de horarios o el diseño de redes, tienen una base en problemas NP-completos. Entender estas técnicas te permitirá no solo identificar soluciones eficientes, sino también tener claridad sobre cuándo un problema es intratable y necesitas buscar aproximaciones o heurísticas.

Así que respira hondo, toma un café, y recuerda: cada línea de código que escribas será más poderosa si entiendes los fundamentos detrás de estos algoritmos. **¡Tú puedes con esto!**