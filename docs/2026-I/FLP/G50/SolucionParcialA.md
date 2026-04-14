# Solución Primer Parcial — Fundamentos de Lenguajes de Programación 2026-I

## Versión A

---

### Sección 1: Representación de datos

#### Pregunta 1 (Media)

**Enunciado:** ¿Cuáles de las siguientes especificaciones inductivas generan **exactamente** el conjunto de los números naturales pares (es decir, $\{0, 2, 4, 6, 8, \ldots\}$)?

**Respuestas correctas: a) y b)**

**Justificación:**

Según lo visto en clase (Clase 2 — Representación inductiva, EOPL §1.1), toda especificación inductiva requiere un caso base y una regla inductiva, y debe cumplir la propiedad de *reversibilidad*: desde cualquier elemento generado, aplicando la operación inversa sucesivamente se debe llegar al caso base.

- **a)** $0 \in S,\; n \in S \therefore (n+2) \in S$ — **Correcta.** Forma canónica. Caso base 0, regla +2. Genera 0, 2, 4, 6, 8... Cumple reversibilidad: restando 2 sucesivamente se llega a 0.

- **b)** $0 \in S,\; 2 \in S,\; n \in S \therefore (n+4) \in S$ — **Correcta.** Tiene *dos* casos base (0 y 2) con regla +4. Desde 0 con +4 genera: 0, 4, 8, 12, 16... Desde 2 con +4 genera: 2, 6, 10, 14, 18... La unión de ambas cadenas produce exactamente $\{0, 2, 4, 6, 8, 10, 12, \ldots\}$. El estudiante debe entender que una especificación puede tener múltiples casos base (concepto visto en clase con las especificaciones compuestas como listas de tuplas) y que la regla se aplica a *todos* los elementos ya generados. La reversibilidad se cumple: desde cualquier par, restando 4 repetidamente se llega a 0 o a 2.

¿Por qué las demás son incorrectas?

- **c)** $2 \in S,\; n \in S \therefore (n+2) \in S$: El caso base es 2, por lo que excluye el 0. Genera $\{2, 4, 6, 8, \ldots\}$, no exactamente los pares naturales.
- **d)** $0 \in S,\; n \in S \therefore (n \times 2) \in S$: La regla genera $0 \times 2 = 0$ (ciclo infinito, nunca sale de 0). Además, la multiplicación no genera la secuencia completa — desde 2 generaría 4, 8, 16, 32... saltándose 6, 10, 14... Viola la reversibilidad.
- **e)** $0 \in S,\; n \in S \therefore (n+4) \in S$: Genera 0, 4, 8, 12, 16... Solo produce múltiplos de 4, que son un subconjunto estricto de los pares. Faltan 2, 6, 10, 14... La diferencia clave con la opción b) es que aquí falta el segundo caso base (2) que completaría los huecos.

**Concepto EOPL:** La especificación inductiva es la base de la representación de datos recursivos (EOPL §1.1). Esta pregunta además evalúa el concepto de *múltiples casos base* en una especificación, visto en clase con las especificaciones compuestas (listas de tuplas con subespecificaciones independientes).

---

#### Pregunta 2 (Media)

**Enunciado:** ¿Cuáles de las siguientes gramáticas representan correctamente listas de enteros no vacías?

**Respuestas correctas: a) y c)**

**Justificación:**

En clase (Clase 2 — Representación con gramáticas BNF) se explicó que las gramáticas BNF permiten especificar datos recursivos con mayor facilidad cuando hay múltiples casos base o reglas recursivas.

- **a)** Correcta:
  ```
  <lst> ::= <entero>
        ::= <entero> <lst>
  ```
  El caso base es un solo entero (lista de un elemento). El caso recursivo agrega un entero al inicio de una lista existente. Genera listas no vacías por la izquierda: $(3)$, $(3\; 5)$, $(3\; 5\; 7)$, etc.

- **c)** Correcta:
  ```
  <lst> ::= <entero>
        ::= <lst> <entero>
  ```
  Misma estructura pero recursiva por la derecha. El caso base es un solo entero y el caso recursivo agrega un entero al final. También genera exclusivamente listas no vacías.

¿Por qué las demás son incorrectas?

- **b)** Incluye `'()` como caso base, permitiendo listas vacías, lo que contradice el requisito de *no vacías*.
- **d)** El caso base requiere dos enteros como mínimo, excluyendo listas de un solo elemento.
- **e)** Solo genera listas vacías o de un solo elemento, no hay recursión para listas más largas.

---

#### Pregunta 3 (Difícil)

**Enunciado:** Dada $'() \in S,\; l \in S \wedge n \in \mathbb{N} \therefore (n\; l) \in S$, seleccione las afirmaciones correctas.

**Respuestas correctas: a), b) y d)**

**Justificación:**

- **a) Define listas de números naturales** — Correcto. El caso base es la lista vacía `'()` y la regla inductiva toma un número natural $n$ y una lista existente $l$ para formar una nueva lista $(n\; l)$. Esto genera exactamente las listas cuyos elementos son números naturales.

- **b) $(3\; (1\; (7\; '())))$ pertenece a $S$** — Correcto. Podemos derivarlo paso a paso:
  1. $'() \in S$ (caso base)
  2. $7 \in \mathbb{N} \wedge '() \in S \therefore (7\; '()) \in S$
  3. $1 \in \mathbb{N} \wedge (7\; '()) \in S \therefore (1\; (7\; '())) \in S$
  4. $3 \in \mathbb{N} \wedge (1\; (7\; '())) \in S \therefore (3\; (1\; (7\; '()))) \in S$

- **d) La definición requiere un caso base y un caso inductivo** — Correcto. Como se vio en clase, toda especificación inductiva tiene exactamente estas dos partes. El caso base es $'()$ y el caso inductivo es la regla con $\therefore$.

¿Por qué las demás son incorrectas?

- **c)** $(3\; 1\; 7)$ no pertenece a $S$ porque la regla solo permite construir $(n\; l)$ donde $l \in S$, es decir, el segundo elemento debe ser una lista, no otro número. La notación $(3\; 1\; 7)$ no sigue la estructura recursiva definida.
- **e)** $'()$ sí pertenece a $S$ porque es el caso base explícitamente definido.

---

### Sección 2: Tipos abstractos de datos

#### Pregunta 4 (Fácil)

**Enunciado:** La interfaz de un TAD está compuesta por:

**Respuestas correctas: a), c) y e)**

**Justificación:**

Según lo visto en clase (Clase 4 — TADs) y EOPL §2.1, un TAD tiene dos partes: **interfaz** e **implementación**.

La interfaz comprende los procedimientos que el programador utiliza:

- **Constructores**: Crean instancias del tipo de dato (una por cada variante en la gramática).
- **Observadores**, que se dividen en:
  - **Predicados**: Verifican a qué variante pertenece un dato.
  - **Extractores**: Extraen las partes internas de cada variante.

Por lo tanto:

- **a)** Constructores y observadores — Correcto, es la descripción general.
- **c)** Constructores, predicados y extractores — Correcto, desglose completo de la interfaz.
- **e)** Procedimientos que ve el programador — Correcto, definición conceptual de la interfaz.

¿Por qué las demás son incorrectas?

- **b)** Solo constructores y predicados — Incompleta, faltan los extractores.
- **d)** La representación interna pertenece a la *implementación*, no a la interfaz. La interfaz es independiente de la representación.

**Concepto clave de clase:** *``El programador usa la interfaz. Volvemos independiente de la representación interna, nos da igual si son listas, procedimientos u otra estructura.''*

---

#### Pregunta 5 (Media)

**Enunciado:** Dada la gramática del árbol binario, ¿cuáles procedimientos se deben implementar según la receta de diseño de TADs?

**Respuestas correctas: a), b) y c)**

**Justificación:**

La receta de diseño de TADs vista en clase (Clase 4) establece:

1. Implementar **un constructor** por cada variante → `hoja` y `nodo` (opción a).
2. Implementar **un predicado** por cada variante → `hoja?` y `nodo?` (opción b).
3. Implementar **un extractor** por cada campo de cada variante → `hoja-val`, `nodo-key`, `nodo-izq`, `nodo-der` (opción c).

¿Por qué las demás son incorrectas?

- **d)** La receta **no** incluye una función de validación. De hecho, en clase se discutió específicamente que esto **no es parte** de la receta: *``No es correcto incluir una función de validación de datos''* (referencia directa de los contenidos del parcial anterior, pregunta 10 de Parcial1.tex).
- **e)** La receta exige un constructor **por variante**, no un constructor genérico único.

---

#### Pregunta 6 (Difícil)

**Enunciado:** Si se cambia la representación interna de listas a procedimientos, ¿cuáles afirmaciones son correctas?

**Respuestas correctas: a), b) y c)**

**Justificación:**

Este es el concepto central de abstracción de datos en EOPL §2.1 y un tema fundamental de la Clase 4 y los talleres del curso:

- **a)** Las funciones externas que usan la interfaz **no cambian** — Correcto. Este es el principio fundamental de la abstracción de datos: al cambiar la representación interna, las funciones que solo usan la interfaz pública (constructores, predicados, extractores) permanecen intactas. Esto fue verificado en el Taller 1 donde se implementaron tres representaciones del TAD Map.

- **b)** Los constructores internos deben ser reimplementados — Correcto. La representación interna cambia, por lo que la implementación de los constructores debe adaptarse (e.g., pasar de listas a procedimientos lambda).

- **c)** Los predicados y extractores internos deben ser reimplementados — Correcto. Análogo a los constructores, forman parte de la implementación que depende de la representación.

¿Por qué las demás son incorrectas?

- **d)** Si las funciones acceden *directamente* a la representación interna, eso violaría la abstracción del TAD. El diseño correcto evita esto, y las funciones externas solo usan la interfaz.
- **e)** La interfaz pública no se modifica — ese es precisamente el beneficio de la abstracción de datos.

---

### Sección 3: Árboles de sintaxis abstracta

#### Pregunta 7 (Fácil)

**Enunciado:** Un parser es un procedimiento que:

**Respuestas correctas: a) y b)**

**Justificación:**

Según lo visto en clase (Clase 5 — Interpretación y compilación):

- **a)** Transforma sintaxis concreta a sintaxis abstracta — Correcto. El parser toma la cadena de texto (sintaxis concreta) y genera el AST (sintaxis abstracta). Esto fue implementado con `sllgen:make-string-parser`.

- **b)** Recibe texto y produce un AST — Correcto. Es la descripción operativa del parser, como se demostró con ejemplos como `(parser "+(1,2)")` que retorna `#(struct:a-program #(struct:prim-exp ...))`.

¿Por qué las demás son incorrectas?

- **c)** De abstracta a concreta sería un *unparser*, no un parser.
- **d)** Extraer unidades léxicas es función del *scanner*, no del parser.
- **e)** Evaluar expresiones es función del *evaluador/intérprete* (`eval-expression`), no del parser.

**Concepto de clase:** *``Parsing: Toma un conjunto de unidades significativas y genera el AST.''*

---

#### Pregunta 8 (Media)

**Enunciado:** Sobre el `define-datatype` de `lc-exp`, ¿cuáles construcciones son válidas?

**Respuestas correctas: a), c) y e)**

**Justificación:**

La definición del datatype establece los predicados de tipo para cada campo:

```scheme
(define-datatype lc-exp lc-exp?
  (var-exp (id symbol?))
  (lambda-exp (lid (list-of symbol?)) (exp lc-exp?))
  (app-exp (rator lc-exp?) (rand lc-exp?)))
```

- **a) `(var-exp 'x)`** — Válida. `'x` es un `symbol?`, cumple el predicado del campo `id`.
- **c) `(lambda-exp '(x y) (var-exp 'x))`** — Válida. `'(x y)` es `(list-of symbol?)` y `(var-exp 'x)` es `lc-exp?`.
- **e) `(app-exp (var-exp 'f) (var-exp 'a))`** — Válida. Ambos argumentos son `lc-exp?`.

¿Por qué las demás son incorrectas?

- **b) `(var-exp 3)`**: El campo `id` requiere `symbol?`, pero `3` es un número, no un símbolo.
- **d) `(app-exp (var-exp 'f) 'x)`**: El campo `rand` requiere `lc-exp?`, pero `'x` es un símbolo, no una instancia de `lc-exp`. Debería ser `(var-exp 'x)`.

**Concepto clave:** `define-datatype` genera constructores que **verifican los predicados** de cada campo en tiempo de ejecución, garantizando la integridad de los datos.

---

#### Pregunta 9 (Difícil)

**Enunciado:** ¿Cuál es la estructura del AST para `(parser "+(x,3)")`?

**Respuesta correcta: a)**

```
#(struct:a-program
 #(struct:prim-exp
  #(struct:add-prim)
  (#(struct:var-exp x)
   #(struct:lit-exp 3))))
```

**Justificación:**

Siguiendo la gramática del interpretador simple vista en clase (Clase 5):

1. El programa completo se envuelve en `a-program`.
2. La expresión `+(x,3)` corresponde a una `prim-exp` con:
   - Primitiva: `add-prim` (el operador `+`)
   - Lista de operandos: `x` se parsea como `var-exp` (es un identificador), `3` se parsea como `lit-exp` (es un número).

¿Por qué las demás son incorrectas?

- **b)** Falta el nivel `prim-exp` que envuelve la primitiva y sus argumentos.
- **c)** Usa `lit-exp` para `x`, pero `x` es un identificador, debe ser `var-exp`.
- **d)** Falta el envoltorio `a-program` — todo programa inicia con esta estructura.
- **e)** Usa `num-exp` en lugar de `lit-exp` — el constructor correcto según la gramática es `lit-exp`.

---

### Sección 4: Lenguajes compilados e interpretados

#### Pregunta 10 (Fácil)

**Enunciado:** ¿Cuáles afirmaciones sobre la interpretación son correctas?

**Respuestas correctas: a), c) y e)**

**Justificación:**

Según lo visto en clase (Clase 5 — Lenguajes interpretados vs compilados):

- **a)** Un intérprete ejecuta línea por línea — Correcto. *``Interpretar línea por línea y va resolviendo''*.
- **c)** Facilita la escritura de código — Correcto. *``Más sencillo para escribir código, desarrollador no se preocupe por cosas de bajo nivel''*.
- **e)** Más lento que un compilador — Correcto. *``Desventaja: Más lento que los compilados''* porque existe un intermediario entre el código fuente y la CPU.

¿Por qué las demás son incorrectas?

- **b)** La traducción a código máquina es propia de la *compilación*, no de la interpretación.
- **d)** Un intérprete no genera un archivo ejecutable independiente; requiere el intérprete para ejecutar.

---

#### Pregunta 11 (Fácil)

**Enunciado:** El scanner (analizador léxico) tiene como función:

**Respuestas correctas: a), b) y d)**

**Justificación:**

Según la Clase 5:

- **a)** Extraer unidades significativas — Correcto. *``Scanner: Extracción unidades significativas (números, palabras reservadas, cosas de la gramática, etc)''*.
- **b)** Producir tokens con tipo y posición — Correcto. La salida del scanner son tuplas `(tipo-token lexema numero-linea)`, como `(number 1 1)`, `(identifier x 3)`.
- **d)** Ignorar comentarios y espacios — Correcto. En la especificación léxica se usa `skip` para estos: `(comment ("%" (arbno (not #\newline))) skip)` y `(whitespace (whitespace) skip)`.

¿Por qué las demás son incorrectas?

- **c)** Construir el AST es función del *parser*, no del scanner.
- **e)** Evaluar expresiones es función del *evaluador* (`eval-expression`).

---

#### Pregunta 12 (Media)

**Enunciado:** La especificación `(numero ("-" digit (arbno digit)) number)` define:

**Respuestas correctas: a) y c)**

**Justificación:**

Desglose de la especificación léxica en SLLGEN:

- `"-"`: Debe iniciar con el signo menos.
- `digit`: Exactamente un dígito obligatorio después del signo.
- `(arbno digit)`: Cero o más dígitos adicionales.
- `number`: Categoría del token resultante.

Por lo tanto:

- **a)** Números negativos con al menos un dígito después del signo — Correcto. El `digit` obligatorio garantiza al menos un dígito.
- **c)** El token tiene categoría `number` — Correcto, es el tercer elemento de la especificación.

¿Por qué las demás son incorrectas?

- **b)** Solo define negativos (inician con `-`), no positivos.
- **d)** `digit` es obligatorio (no puede haber cero dígitos después del signo).
- **e)** No son identificadores; un identificador comienza con `letter`, no con `-`.

---

### Sección 5: Ambientes — let, condicionales y procedimientos

#### Código base para las preguntas 13–15

```scheme
let
  x = 5
  y = let a = 3 in +(a, 7)    ; y = 10
  in
    let
      f = proc(m, n)
            if >(m, 0)
            then +(n, (f -(m,1) *(n,2)))
            else n
      in
        letrec
          g(p) = if >(p, 1)
                 then +(p, (g -(p,1)))
                 else 1
          in
            +(x, y, (f 2 y), (g 3))
```

**Cálculo previo de y:**

$y = +(a, 7)$ donde $a = 3$, por lo tanto $y = 10$.

---

#### Pregunta 13 (Media)

**Enunciado:** ¿Cuáles afirmaciones sobre los ambientes generados son correctas?

**Respuestas correctas: a), b) y c)**

**Justificación:**

Aplicando los conceptos de ambientes vistos en clase (Clases 6 y 7):

- **a)** Se genera un ambiente extendido para `x` e `y` — Correcto. El `let` externo crea un `extend-env` con las ligaduras `[x=5, y=10]` que extiende del ambiente vacío.

- **b)** Se genera un ambiente temporal para calcular `y` — Correcto. La expresión `let a = 3 in +(a,7)` crea un ambiente temporal con `[a=3]` que se usa solo para evaluar `+(a,7)` y luego se descarta. El resultado (10) se almacena como valor de `y`.

- **c)** El ambiente donde se define `f` extiende del que contiene `x` e `y` — Correcto. El `let f = ...` crea un nuevo ambiente `[f=clausura]` que extiende del ambiente `[x=5, y=10]`.

¿Por qué las demás son incorrectas?

- **d)** El ambiente recursivo de `g` extiende del ambiente que contiene `f`, que a su vez contiene `x` e `y`. No extiende directamente del vacío.
- **e)** La variable `a` solo existe en el ambiente temporal creado para calcular `y`. No es visible en el cuerpo del `letrec`.

---

#### Pregunta 14 (Difícil)

**Enunciado:** `f` no es recursivo (definido con `let`). ¿Cuáles afirmaciones son correctas?

**Respuestas correctas: a), b), c) y d)**

**Justificación:**

Este es el problema central de los procedimientos no recursivos visto en clase (Clase 7 — Procedimientos recursivos):

- **a)** `(f 2 y)` genera error porque `f` no se encuentra en su propio ambiente — Correcto. Los procedimientos definidos con `let` almacenan el ambiente *anterior* a su definición en la clausura. Cuando `f` intenta llamarse a sí misma dentro de su cuerpo, `f` no existe en el ambiente almacenado en la clausura. *``Los procedimientos regulares no pueden referenciarse a sí mismos porque almacenan el ambiente anterior a su definición''*.

- **b)** Con `letrec`, la clausura apuntaría al ambiente recursivo — Correcto. El `extend-recursively-env` crea clausuras que apuntan al ambiente recursivo actual (`env`), no al `old-env`. Esto permite la auto-referencia.

- **c)** El ambiente donde se evalúa el cuerpo de `f` contiene `m` y `n` — Correcto. Al invocar `(f 2 y)`, se crea un ambiente extendido `[m=2, n=10]` que extiende del ambiente almacenado en la clausura (así funciona `apply-procedure`).

- **d)** La clausura de `f` almacena el ambiente donde fue creado — Correcto. `(closure lid exp old-env)` almacena `old-env` que es el ambiente al momento de evaluar `proc(m,n)...`.

¿Por qué la otra es incorrecta?

- **e)** La variable `f` no es visible dentro del cuerpo de `g` directamente. El ambiente recursivo de `g` extiende del ambiente que contiene `f`, por lo que `f` sí sería accesible buscando en el `old-env` del ambiente recursivo. Sin embargo, la afirmación sugiere visibilidad directa en el ambiente recursivo, lo que no es correcto — `f` está en un ambiente ancestro, no en el ambiente recursivo de `g`. La búsqueda la resolvería `apply-env` yendo al `old-env`, pero `f` no está *dentro* del cuerpo de `g` como definición.

---

#### Pregunta 15 (Difícil)

**Enunciado:** Suponiendo `f` definido con `letrec`. ¿Cuáles valores son correctos?

**Respuestas correctas: a), b), c) y d)**

**Justificación — Cálculo de `(f 2 10)`:**

Si `f` fuera recursivo (definido con `letrec`):

| Llamada | m | n | Condición | Resultado |
|---------|---|---|-----------|-----------|
| f(2, 10) | 2 | 10 | 2 > 0 → then | +(10, f(1, 20)) |
| f(1, 20) | 1 | 20 | 1 > 0 → then | +(20, f(0, 40)) |
| f(0, 40) | 0 | 40 | 0 ≤ 0 → else | 40 |

Resolviendo hacia atrás:
- $f(0, 40) = 40$
- $f(1, 20) = 20 + 40 = 60$
- $f(2, 10) = 10 + 60 = 70$

**a) `(f 2 10)` = 70** — Correcto ✓

**d) Se realizan 3 llamadas a `f`** — Correcto (m=2, m=1, m=0) ✓

**Cálculo de `(g 3)`:**

| Llamada | p | Condición | Resultado |
|---------|---|-----------|-----------|
| g(3) | 3 | 3 > 1 → then | +(3, g(2)) |
| g(2) | 2 | 2 > 1 → then | +(2, g(1)) |
| g(1) | 1 | 1 ≤ 1 → else | 1 |

Resolviendo:
- $g(1) = 1$
- $g(2) = 2 + 1 = 3$
- $g(3) = 3 + 3 = 6$

**b) `(g 3)` = 6** — Correcto ✓

**Valor final:** $+(x, y, f(2,10), g(3)) = +(5, 10, 70, 6) = 91$

**c) Resultado = 91** — Correcto ✓

**e) El último llamado de `(g 3)` tiene `p = 0`** — Incorrecto. El último llamado tiene $p = 1$ (caso base: $p \leq 1$).

---
## Tabla resumen de respuestas

### Versión A

| Pregunta | Respuesta | Dificultad | Tema |
|----------|-----------|------------|------|
| 1 | A, B | Media | Representación de datos |
| 2 | A, C | Media | Representación de datos |
| 3 | A, B, D | Difícil | Representación de datos |
| 4 | A, C, E | Fácil | TADs |
| 5 | A, B, C | Media | TADs |
| 6 | A, B, C | Difícil | TADs |
| 7 | A, B | Fácil | AST |
| 8 | A, C, E | Media | AST |
| 9 | A | Difícil | AST |
| 10 | A, C, E | Fácil | Compilación/Interpretación |
| 11 | A, B, D | Fácil | Compilación/Interpretación |
| 12 | A, C | Media | Compilación/Interpretación |
| 13 | A, B, C | Media | Ambientes |
| 14 | A, B, C, D | Difícil | Ambientes |
| 15 | A, B, C, D | Difícil | Ambientes |


