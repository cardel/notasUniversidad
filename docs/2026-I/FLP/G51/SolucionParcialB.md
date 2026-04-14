# Solución Primer Parcial — Fundamentos de Lenguajes de Programación 2026-I

## Versión B

---

### Sección 1: Representación de datos

#### Pregunta 1 (Media)

**Enunciado:** ¿Cuáles de las siguientes especificaciones generan **exactamente** el conjunto de listas de números naturales con al menos dos elementos?

**Respuestas correctas: a) y c)**

**Justificación:**

Según lo visto en Clase 2 sobre representación inductiva y gramáticas BNF (EOPL §1.1), el caso base de una especificación determina el elemento más pequeño del conjunto, y la regla inductiva solo puede construir elementos más grandes.

- **a)** $n_1 \in \mathbb{N} \wedge n_2 \in \mathbb{N} \therefore (n_1\; (n_2\; '())) \in S, \quad l \in S \wedge n \in \mathbb{N} \therefore (n\; l) \in S$ — **Correcta.** El caso base construye directamente una lista de dos elementos: $(n_1\; (n_2\; '()))$. La regla inductiva agrega un natural al frente de una lista existente, lo que solo puede aumentar la longitud. Como el mínimo es 2, toda lista generada tiene al menos 2 elementos. Cumple reversibilidad: quitando el primer elemento sucesivamente se llega a una lista de dos.

- **c)** La gramática `<lst> ::= <nat> <nat> | <nat> <lst>` — **Correcta.** Es la traducción BNF de la opción a). El caso base `<nat> <nat>` es una lista de exactamente dos elementos. El caso recursivo `<nat> <lst>` agrega un natural al frente. El estudiante debe reconocer la *equivalencia entre la especificación inductiva y la gramática BNF* — principio fundamental de la Clase 2.

¿Por qué las demás son incorrectas?

- **b)** $'() \in S, \quad l \in S \wedge n \in \mathbb{N} \therefore (n\; l) \in S$: Caso base $'()$ (lista vacía, longitud 0). Genera listas de *cualquier* longitud incluyendo 0 y 1. Es la especificación estándar de listas de naturales sin restricción de tamaño.
- **d)** La gramática `<lst> ::= '() | <nat> <lst>`: Es la traducción BNF de la opción b) — incluye la lista vacía y listas de un solo elemento.
- **e)** $n \in \mathbb{N} \therefore (n\; '()) \in S, \quad l \in S \wedge m \in \mathbb{N} \therefore (m\; l) \in S$: El caso base es $(n\; '())$, una lista de *un* solo elemento. La regla inductiva permite agregar más, generando listas de longitud 1, 2, 3, 4... No cumple la restricción de ``al menos dos''. La diferencia clave con la opción a) es que el caso base tiene un elemento vs dos.

**Concepto EOPL:** Esta pregunta evalúa la comprensión de cómo el caso base determina la *restricción mínima* del conjunto generado, y la equivalencia entre representación inductiva y BNF. En clase se vio que ambas representaciones son equivalentes en expresividad y la elección depende del contexto.

---

#### Pregunta 2 (Media)

**Enunciado:** Sobre la gramática de árbol ternario, ¿cuáles afirmaciones son correctas?

```
<arb> ::= <numero>
      ::= <simbolo> <arb> <arb> <arb>
```

**Respuestas correctas: a), b) y c)**

**Justificación:**

Análisis de la gramática según los principios BNF de la Clase 2:

- **a)** Las hojas son números — Correcto. La primera producción (`<arb> ::= <numero>`) define las hojas como números.
- **b)** Los nodos internos tienen un símbolo y tres hijos — Correcto. La segunda producción requiere un `<simbolo>` seguido de tres `<arb>`.
- **c)** `(a (1) (b (2) (3) (4)) (5))` pertenece al tipo — Correcto. Derivación:
  - `a` es un símbolo, con tres hijos:
    - Hijo 1: `1` (número → hoja)
    - Hijo 2: `b` con hijos `2`, `3`, `4` (todos números → hojas)
    - Hijo 3: `5` (número → hoja)

¿Por qué las demás son incorrectas?

- **d)** `(a (1) (2))` solo tiene 2 hijos, pero la gramática exige exactamente 3 hijos por nodo.
- **e)** Las hojas solo pueden ser números (primera producción), no símbolos. Los símbolos aparecen en nodos internos.

---

#### Pregunta 3 (Difícil)

**Enunciado:** ¿Cuáles especificaciones definen listas de símbolos de longitud par?

**Respuestas correctas: a) y c)**

**Justificación:**

Para generar listas de longitud par (0, 2, 4, ...), la regla inductiva debe agregar exactamente **dos** elementos en cada paso:

- **a)** Correcta:
  $$'() \in S,\; s_1 \in \textit{Symbol} \wedge s_2 \in \textit{Symbol} \wedge l \in S \therefore (s_1\; s_2\; l) \in S$$
  Caso base: lista vacía (longitud 0, que es par). Paso inductivo: agrega **dos símbolos independientes** a una lista existente. Genera longitudes 0, 2, 4, 6, ...

- **c)** Correcta — gramática equivalente a la opción a):
  ```
  <lp> ::= '()
       ::= <sym> <sym> <lp>
  ```

¿Por qué las demás son incorrectas?

- **b)** Agrega un solo símbolo cada vez, generando listas de cualquier longitud (0, 1, 2, 3, ...).
- **d)** Gramática equivalente a b), misma razón.
- **e)** $s\; s$ repite el **mismo** símbolo dos veces. Esto restringe a listas donde los elementos aparecen en pares idénticos consecutivos (e.g., `(a a b b)` sí, pero `(a b)` no), lo cual no es lo mismo que ``listas de longitud par con cualquier símbolo''.

---

### Sección 2: Tipos abstractos de datos

#### Pregunta 4 (Fácil)

**Enunciado:** Según la receta de diseño de TADs, para cada variante se debe implementar:

**Respuestas correctas: a), b) y c)**

**Justificación:**

La receta de diseño vista en clase (Clase 4 — TADs):

> *``1. Implemente un constructor para cada variante en la gramática. 2. Implemente un predicado para cada variante en la gramática. 3. Implemente un extractor para cada parte de cada variante en la gramática.''*

- **a)** Un constructor — Correcto.
- **b)** Un predicado — Correcto.
- **c)** Un extractor por campo — Correcto.

¿Por qué las demás son incorrectas?

- **d)** No se incluye función de validación en la receta de diseño.
- **e)** No existe el concepto de ``destructor'' en la receta de TADs funcionales.

---

#### Pregunta 5 (Media)

**Enunciado:** ¿Cuáles afirmaciones sobre `define-datatype` son correctas?

**Respuestas correctas: a), b) y c)**

**Justificación:**

Según lo visto en clase (Clase 4 — Define-datatype) y EOPL §2.4:

- **a)** Genera constructores automáticamente — Correcto. `define-datatype` crea funciones constructoras para cada variante (e.g., `leaf`, `node`).
- **b)** Genera un predicado de tipo — Correcto. Se genera automáticamente un predicado global (e.g., `arbol-b?`).
- **c)** Permite usar `cases` — Correcto. `cases` es el mecanismo de pattern matching que integra predicados y extractores.

¿Por qué las demás son incorrectas?

- **d)** Los extractores no se implementan manualmente; se manejan automáticamente a través de los patrones en `cases`.
- **e)** `define-datatype` define tipos **cerrados**: no se pueden agregar variantes sin modificar la definición. Esto favorece el análisis exhaustivo de casos.

---

#### Pregunta 6 (Difícil)

**Enunciado:** Sobre la función `contar` aplicada a `(nodo 'a (nodo 'b (hoja 1) (hoja 2)) (hoja 3))`.

**Respuestas correctas: a), b), c) y d)**

**Justificación:**

Evaluación paso a paso:

```
contar(nodo 'a (nodo 'b (hoja 1) (hoja 2)) (hoja 3))
= 1 + contar(nodo 'b (hoja 1) (hoja 2)) + contar(hoja 3)
= 1 + (1 + contar(hoja 1) + contar(hoja 2)) + 1
= 1 + (1 + 1 + 1) + 1
= 1 + 3 + 1
= 5
```

- **a)** Retorna 5 — Correcto ✓
- **b)** Cuenta nodos y hojas — Correcto. Cada hoja contribuye 1 y cada nodo contribuye 1 + sus subárboles.
- **c)** Usa recursión estructural — Correcto. La función sigue exactamente la estructura del datatype: un caso por variante (`hoja` y `nodo`), recursionando sobre los subcampos recursivos.
- **d)** `cases` actúa como predicado y extractor simultáneamente — Correcto. Como se vio en clase: *``Los cases integran predicados con extractores, permitiendo verificar qué variante tiene el valor y extraer automáticamente los campos''*.

**e)** Retorna 3 — Incorrecto, retorna 5.

---

### Sección 3: Árboles de sintaxis abstracta

#### Pregunta 7 (Fácil)

**Enunciado:** Afirmaciones sobre sintaxis concreta y abstracta.

**Respuestas correctas: a), b) y c)**

**Justificación:**

Según la Clase 4 (Sintaxis abstracta y concreta):

- **a)** La sintaxis concreta es la representación textual — Correcto. Es el texto que escribe el programador (cadenas de caracteres).
- **b)** El AST es la representación interna — Correcto. Es la estructura de datos que el intérprete/compilador procesa.
- **c)** Un unparser transforma de abstracta a concreta — Correcto. Es la operación inversa al parser.

¿Por qué las demás son incorrectas?

- **d)** *``El AST y la sintaxis concreta son representaciones equivalentes''* — Esto es parcialmente cierto en cuanto a la información, pero no son ``equivalentes'' en un sentido directo: el AST descarta información irrelevante (espacios, paréntesis redundantes, comentarios) que sí está en la sintaxis concreta.
- **e)** El AST es más eficiente para procesamiento (no la sintaxis concreta). El parser transforma a AST precisamente porque es más fácil de procesar.

---

#### Pregunta 8 (Media)

**Enunciado:** Sobre la especificación gramatical de `let-exp` con `arbno`.

**Respuestas correctas: a), b), c) y d)**

**Justificación:**

Análisis de la especificación SLLGEN:

```scheme
(expresion
  ("let" (arbno identificador "=" expresion) "in" expresion)
  let-exp)
```

- **a)** `arbno` indica cero o más repeticiones — Correcto. `arbno` es ``arbitrary number'', que incluye cero.
- **b)** El constructor del AST es `let-exp` — Correcto. Es el último elemento de la producción.
- **c)** `let x = 5 in x` es válida — Correcto. Tiene una ligadura (una repetición).
- **d)** `let in 5` es válida — Correcto. `arbno` permite **cero** repeticiones, por lo que un `let` sin ligaduras es gramaticalmente válido.

**e)** La afirmación describe correctamente los campos internos del AST, pero la pregunta es si el `let-exp` *almacena* esto. En realidad, `sllgen` genera listas para las partes dentro del `arbno`, así que el `let-exp` almacena una lista de identificadores, una lista de expresiones (de las ligaduras) y la expresión del cuerpo. Sin embargo, la redacción de la opción e) es engañosa porque no aclara que son listas generadas por el `arbno` — depende de la interpretación exacta. Se considera incorrecta en el contexto de la pregunta.

---

#### Pregunta 9 (Difícil)

**Enunciado:** Ocurrencias libres y ligadas en:

```scheme
(lambda (x)
  ((lambda (y) (x (y z)))
   (lambda (z)
     (lambda (y) (z (y x))))))
```

**Respuestas correctas: a), b), c) y d)**

**Justificación:**

Aplicando las reglas de `occurs-free?` vistas en clase (Clase 2 — Ligaduras):

- **a) `x` ligada en toda la expresión** — Correcto. El `lambda (x)` externo liga `x` en todo su cuerpo. Todas las apariciones de `x` dentro están dentro del alcance de este lambda.

- **b) `z` libre en `(x (y z))`** — Correcto. En la subexpresión `(lambda (y) (x (y z)))`, la `y` está ligada pero `z` no tiene ningún lambda que la ligue en ese contexto. El `(lambda (z) ...)` está fuera de esta subexpresión (es un argumento hermano, no un ancestro).

- **c) `y` ligada en `(lambda (y) (x (y z)))`** — Correcto. El parámetro del lambda liga `y` en el cuerpo `(x (y z))`.

- **d) `z` ligada en `(lambda (z) (lambda (y) (z (y x))))`** — Correcto. El parámetro `z` del lambda liga `z` en todo su cuerpo, incluyendo `(z (y x))`.

**e) `x` libre en toda la expresión** — Incorrecto. `x` está ligada por el lambda más externo `(lambda (x) ...)`.

**Concepto formal de clase:**
$$\text{Free}(\lambda x. e) = \text{Free}(e) \setminus \{x\}$$

---

### Sección 4: Lenguajes compilados e interpretados

#### Pregunta 10 (Fácil)

**Enunciado:** Ventajas de la compilación sobre la interpretación.

**Respuestas correctas: a), b) y e)**

**Justificación:**

Según la tabla comparativa vista en clase (Clase 5 — Lenguajes interpretados vs compilados):

- **a)** Mayor velocidad de ejecución — Correcto. *``Al no tener intermediarios con la CPU se ejecuta más rápidamente''*.
- **b)** Genera código máquina o bytecode — Correcto. *``Compilación requiere hacer una traducción del código a un lenguaje intermedio (código binario/máquina)''*.
- **e)** Detectar errores antes de la ejecución — Correcto. *``Errores detectados en tiempo de compilación (antes de ejecutar)''* vs *``Errores detectados en tiempo de ejecución''* en interpretados.

¿Por qué las demás son incorrectas?

- **c)** La facilidad de escritura es ventaja de los *interpretados*.
- **d)** No preocuparse por bajo nivel es ventaja de los *interpretados*.

---

#### Pregunta 11 (Fácil)

**Enunciado:** Pasos del frontend.

**Respuestas correctas: a), b) y c)**

**Justificación:**

- **a)** Primero scanner, luego parser — Correcto. El flujo es: código fuente → scanner (tokens) → parser (AST).
- **b)** El scanner produce tokens — Correcto. Genera unidades léxicas: `(tipo lexema línea)`.
- **c)** El parser produce un AST — Correcto. Transforma tokens en árbol de sintaxis abstracta.

¿Por qué las demás son incorrectas?

- **d)** El orden es scanner primero, no parser primero.
- **e)** El AST lo construye el parser, no el scanner.

---

#### Pregunta 12 (Media)

**Enunciado:** Dada la especificación léxica de identificadores, ¿cuáles cadenas son válidas?

```scheme
(identifier (letter (arbno (or letter digit "_"))) symbol)
```

**Respuestas correctas: a), b) y d)**

**Justificación:**

La especificación requiere:
1. Iniciar con `letter` (una letra).
2. Seguido de cero o más (`arbno`) caracteres que sean letra, dígito o `"_"`.

- **a) `x`** — Válido: una letra sola.
- **b) `var_1`** — Válido: inicia con `v` (letra), seguido de `a`, `r`, `_`, `1`.
- **d) `hola123`** — Válido: inicia con `h` (letra), seguido de letras y dígitos.

¿Por qué las demás son incorrectas?

- **c) `3abc`** — Inválido: inicia con un dígito, no con una letra.
- **e) `_inicio`** — Inválido: inicia con `_`, que no es una letra.

---

### Sección 5: Ambientes — let, condicionales y procedimientos

#### Código base para las preguntas 13–15

```scheme
let
  a = 4
  b = 6
  in
    letrec
      h(x, y) = if >(x, 0)
                then (h -(x,1) *(y,2))
                else y
      in
        let
          c = (h 3 b)           ; c = (h 3 6)
          d = proc(m)
                if >(m, a)
                then -(m, a)
                else +(m, a)
          in
            +((d c), (d 2), (h 1 a))
```

---

#### Pregunta 13 (Media)

**Enunciado:** Sobre el cálculo de `(h 3 b)` donde `b = 6`.

**Respuestas correctas: a), b), c) y d)**

**Justificación — Traza de `(h 3 6)`:**

| Llamada | x | y | Condición | Resultado |
|---------|---|---|-----------|-----------|
| h(3, 6)  | 3 | 6  | 3 > 0 → then | h(2, 12) |
| h(2, 12) | 2 | 12 | 2 > 0 → then | h(1, 24) |
| h(1, 24) | 1 | 24 | 1 > 0 → then | h(0, 48) |
| h(0, 48) | 0 | 48 | 0 ≤ 0 → else | 48 |

- **a)** 4 llamadas (x = 3, 2, 1, 0) — Correcto ✓
- **b)** c = 48 — Correcto ✓
- **c)** Cada llamada duplica `y` (porque `*(y,2)`) — Correcto: 6→12→24→48.
- **d)** El ambiente recursivo contiene `h` — Correcto. `letrec` crea un `extend-recursively-env` con la definición de `h`.

**e)** c = 24 — Incorrecto, c = 48.

---

#### Pregunta 14 (Difícil)

**Enunciado:** El procedimiento `d` es una clausura. ¿Cuáles afirmaciones son correctas?

**Respuestas correctas: a), b), c) y d)**

**Justificación:**

El procedimiento `d` se define con `let`, creando una clausura: `(closure '(m) cuerpo-d ambiente-creación)`.

- **a)** La clausura almacena el ambiente donde se definió — Correcto. Ese ambiente contiene `c` (del mismo `let`), `h` (del `letrec` que le precede), `a` y `b` (del `let` externo). Todos son accesibles por la cadena de ambientes.

- **b)** `(d 48)`: $48 > 4$ es verdadero → rama `then` — Correcto.

- **c)** `(d 48)` = `-(48, 4)` = 44 — Correcto ✓

- **d)** `(d 2)`: $2 > 4$ es falso → rama `else` — Correcto.

**e)** `(d 2)` = 2 — Incorrecto. La rama `else` calcula `+(2, 4)` = 6.

---

#### Pregunta 15 (Difícil)

**Enunciado:** Valores finales de la expresión.

**Respuestas correctas: a), b), c) y d)**

**Justificación — Cálculos:**

**`(d c)` = `(d 48)`:**
- $48 > 4$ → `-(48, 4)` = **44** → **a) Correcto** ✓

**`(d 2)`:**
- $2 \leq 4$ → `+(2, 4)` = **6** → **b) Correcto** ✓

**`(h 1 a)` = `(h 1 4)`:**

| Llamada | x | y | Condición | Resultado |
|---------|---|---|-----------|-----------|
| h(1, 4) | 1 | 4 | 1 > 0 → then | h(0, 8) |
| h(0, 8) | 0 | 8 | 0 ≤ 0 → else | 8 |

**c) `(h 1 4)` = 8** — Correcto ✓

**Valor final:** $+((d\;c), (d\;2), (h\;1\;a)) = +(44, 6, 8) = 58$

**d) Resultado = 58** — Correcto ✓

**e) Resultado = 52** — Incorrecto, es 58.

---

## Tabla resumen de respuestas

### Versión B

| Pregunta | Respuesta | Dificultad | Tema |
|----------|-----------|------------|------|
| 1 | A, C | Media | Representación de datos |
| 2 | A, B, C | Media | Representación de datos |
| 3 | A, C | Difícil | Representación de datos |
| 4 | A, B, C | Fácil | TADs |
| 5 | A, B, C | Media | TADs |
| 6 | A, B, C, D | Difícil | TADs |
| 7 | A, B, C | Fácil | AST |
| 8 | A, B, C, D | Media | AST |
| 9 | A, B, C, D | Difícil | AST |
| 10 | A, B, E | Fácil | Compilación/Interpretación |
| 11 | A, B, C | Fácil | Compilación/Interpretación |
| 12 | A, B, D | Media | Compilación/Interpretación |
| 13 | A, B, C, D | Media | Ambientes |
| 14 | A, B, C, D | Difícil | Ambientes |
| 15 | A, B, C, D | Difícil | Ambientes |
