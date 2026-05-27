# Solución Segundo Parcial — Fundamentos de Lenguajes de Programación 2026-I

## Versión A (G50)

### Sección 1: Asignación y referencias

#### Pregunta 1 (Media)

**Enunciado:** Ligadura, asignación y valores denotados tras extender el lenguaje con `set`.

**Respuestas correctas: b), c) y e)**

**Justificación:**

La ligadura es una acción local que extiende el ambiente; la asignación es una acción potencialmente global que sobrescribe una ubicación existente (Clase 8, EOPL §4.2).

- **b)** Correcta. Es la distinción central: ligadura ⇒ ambiente extendido; asignación ⇒ sobreescritura *in-place*.
- **c)** Correcta. Con asignación se pierde la transparencia referencial; el orden de evaluación pasa a formar parte del significado del programa.
- **e)** Correcta. El valor denotado deja de ser un valor expresado y pasa a ser `Ref(valor expresado)`: un identificador denota una referencia a una ubicación.

¿Por qué las demás son incorrectas?

- **a)** El conjunto de valores expresados **no** cambia: sigue siendo Número + Booleano + ProcVal. Lo que cambia es el conjunto de valores *denotados*.
- **d)** `set` no extiende el ambiente: muta el contenido de la ubicación ya asociada al identificador. Quien extiende el ambiente es `let`.

**Concepto EOPL:** §4.2, p. 110, valores expresados y denotados con asignación.

---

#### Pregunta 2 (Media)

**Enunciado:** Programa con `let`, un procedimiento que muta su parámetro, evaluado con paso por valor.

**Respuestas correctas: a), c) y e)**

**Justificación:**

Con paso por valor, cada aplicación crea referencias nuevas para los parámetros formales (Clase 8, EOPL §4.3).

- **a)** Correcta. Cada `(p x)` parte de 100, incrementa a 101 y retorna 101; `+(101, 101) = 202`.
- **c)** Correcta. El parámetro formal `x` de `p` recibe una referencia nueva en cada llamado, independiente de la `x` exterior.
- **e)** Correcta. La `x` exterior nunca se modifica: la mutación `set x = add1(x)` actúa sobre la referencia local del parámetro. El segundo llamado vuelve a partir de 100.

¿Por qué las demás son incorrectas?

- **b)** `set x = add1(x)` modifica la referencia *local* del parámetro, no la de la `x` exterior. La `x` exterior conserva el valor 100.
- **d)** El resultado no es 203. Bajo paso por valor el segundo llamado no observa el efecto del primero, porque cada uno trabaja sobre su propia referencia.

**Concepto EOPL:** §4.3, p. 126, paso por valor.

---

#### Pregunta 3 (Difícil)

**Enunciado:** Programa con paso por referencia y dos parámetros ligados a la misma variable (`aliasing`).

**Respuestas correctas: a), c), d) y e)**

**Justificación:**

Con paso por referencia, un operando que es variable se pasa como la *misma* referencia del llamador (Clase 8, EOPL §4.3).

- **a)** Correcta. La referencia compartida pasa de 0 a 1 y luego de 1 a 2; `+(a, b)` lee 2 y 2, y retorna 4.
- **c)** Correcta. Los dos operandos son la variable `x`, así que `a` y `b` quedan ligados a la misma referencia: hay *aliasing*.
- **d)** Correcta. `eval-rand` crea un blanco directo (`direct-target`) cuando el operando no es una variable (literal o expresión compuesta); crea un blanco indirecto cuando sí lo es.
- **e)** Correcta. Ambas asignaciones operan sobre la única referencia compartida; tras las dos, la referencia vale 2.

¿Por qué la otra es incorrecta?

- **b)** El cuerpo **no** retorna 2. Esa sería la respuesta si cada parámetro tuviera su propia copia (paso por valor). El *aliasing* hace que el segundo `set` parta de 1, no de 0.

**Concepto EOPL:** §4.3, p. 127, paso por referencia, blancos directos e indirectos, *aliasing*.

---

#### Pregunta 4 (Media)

**Enunciado:** Traza de un `begin` con dos `set` sobre `a` y `b`.

**Respuestas correctas: a), b) y d)**

**Justificación:**

Las asignaciones se evalúan en orden; cada `set` ve los efectos de los anteriores (Clase 8, EOPL §4.2).

- **a)** Correcta. `set a = +(a,b)` lleva `a` a 3; `set b = +(a,b)` usa ese `a = 3` y lleva `b` a 5; `+(a,b) = +(3,5) = 8`.
- **b)** Correcta. Cuando se evalúa `set b`, la asignación anterior ya dejó `a = 3`; el `begin` secuencia los efectos.
- **d)** Correcta. El `begin` retorna el valor de su última expresión, `+(a,b)`.

¿Por qué las demás son incorrectas?

- **c)** El resultado no es 5. Cada `set` parte de los valores vigentes, no de los iniciales: `b` se calcula con `a = 3`.
- **e)** El orden sí importa: intercambiar los dos `set` cambiaría el resultado, porque `set b` depende del `a` ya actualizado.

**Concepto EOPL:** §4.2, secuenciación con `begin` y efecto de `set`.

---

### Sección 2: Chequeo de tipos

#### Pregunta 5 (Media)

**Enunciado:** Disciplinas de tipos y errores que detecta CHECKED.

**Respuestas correctas: b), c) y e)**

**Justificación:**

CHECKED rechaza, antes de ejecutar, los programas con errores de tipo definidos en Clase 9 (EOPL §7.1).

- **b)** Correcta. El tipado estático verifica antes de ejecutar; el dinámico lo hace durante la ejecución mediante etiquetas en cada valor.
- **c)** Correcta. `+(3, true)` mezcla `int` y `bool` donde `+` espera dos `int`: es un error de tipo que CHECKED detecta.
- **e)** Correcta. Usar `42` (de tipo `int`) como prueba de un `if` viola la regla del `if-exp`, que exige una prueba booleana.

¿Por qué las demás son incorrectas?

- **a)** La división por cero es un error de **ejecución**, no de tipo. El chequeador no lo detecta.
- **d)** La recursión infinita tampoco es un error de tipo: el programa está bien tipado, simplemente no termina.

**Concepto EOPL:** §7.1, qué errores de tipo detecta CHECKED y cuáles quedan en tiempo de ejecución.

---

#### Pregunta 6 (Media)

**Enunciado:** Tipo de `proc (int x, bool b) if b then add1(x) else x`.

**Respuestas correctas: a), c) y e)**

**Justificación:**

El tipo de un `proc` con anotaciones se arma con los tipos declarados, en orden de declaración, y el tipo del cuerpo (Clase 9, EOPL §7.1, Figura 7.4).

- **a)** Correcta. Los parámetros son `int` y `bool`, en ese orden; el cuerpo tiene tipo `int`. El tipo es `(int * bool -> int)`.
- **c)** Correcta. El cuerpo se chequea en `tenv` extendido con `x = int` y `b = bool`.
- **e)** Correcta. La regla del `if` exige prueba booleana (`b` es `bool`) y ambas ramas del mismo tipo (`add1(x)` y `x` son `int`).

¿Por qué las demás son incorrectas?

- **b)** El orden de los tipos en la firma es el orden de **declaración** de los parámetros (`x` antes que `b`), no el orden de uso. El tipo es `(int * bool -> int)`.
- **d)** Si la rama `else` fuera `b`, las dos ramas tendrían tipos distintos (`int` y `bool`) y `check-equal-type!` abortaría.

**Concepto EOPL:** §7.1, Figura 7.4, regla de tipamiento de `proc-exp` con anotaciones y regla del `if`.

---

#### Pregunta 7 (Difícil)

**Enunciado:** Chequeo de `letrec int dup (int n) = ... in (dup 4)`.

**Respuestas correctas: b), c), d) y e)**

**Justificación:**

`type-of-letrec-exp` añade los nombres de procedimiento al ambiente de tipos *antes* de chequear los cuerpos (Clase 9, EOPL §7.1).

- **b)** Correcta. El cuerpo de `dup` se chequea en `tenv` con `dup = (int -> int)` (recursión) y `n = int` (parámetro).
- **c)** Correcta. El cuerpo tiene tipo `int` y `(dup 4)` tiene tipo `int`; el programa completo es `int`.
- **d)** Correcta. `check-equal-type!` compara el tipo del cuerpo con el tipo resultado declarado.
- **e)** Correcta. Si el resultado declarado fuera `bool`, la comparación `int ≠ bool` abortaría con un error de tipo.

¿Por qué la otra es incorrecta?

- **a)** El programa **no** se rechaza por usar `dup` en su cuerpo. Justamente `letrec` liga `dup` en el ambiente de tipos antes de chequear, de modo que la llamada recursiva tiene tipo conocido.

**Concepto EOPL:** §7.1, `type-of-letrec-exp`.

---

#### Pregunta 8 (Media)

**Enunciado:** Chequeo de `proc (int x) if x then 1 else 2`.

**Respuestas correctas: a), b) y d)**

**Justificación:**

La regla del `if` exige que la prueba tenga tipo `bool` (Clase 9, EOPL §7.1).

- **a)** Correcta. La prueba del `if` es `x`, anotado como `int`; la regla del `if` exige `bool`, así que el programa se rechaza.
- **b)** Correcta. `check-equal-type!` compara el tipo de la prueba (`int`) con `bool` y aborta.
- **d)** Correcta. Las ramas `1` y `2` son ambas `int` y entre sí no hay conflicto; el error está en la prueba.

¿Por qué las demás son incorrectas?

- **c)** El programa **no** es bien tipado: la prueba no booleana lo hace fallar el chequeo.
- **e)** El intérprete no llega a ejecutarlo: CHECKED rechaza el programa en la fase de chequeo, antes de evaluar.

**Concepto EOPL:** §7.1, Figura 7.4, regla de tipamiento del `if`.

---

### Sección 3: Inferencia de tipos

#### Pregunta 9 (Media)

**Enunciado:** Inferencia de `proc (? x) proc (? y) x`.

**Respuestas correctas: a), b) y c)**

**Justificación:**

Cada `?` genera una variable de tipo fresca; el cuerpo decide cuáles quedan ligadas (Clase 10, EOPL §7.4).

- **a)** Correcta. Hay dos huecos: el inferidor crea `tx` para `x` y `ty` para `y`.
- **b)** Correcta. El cuerpo es `x`, de tipo `tx`; el `proc` interno tiene tipo `(ty -> tx)` y el externo, `(tx -> (ty -> tx))`.
- **c)** Correcta. Ninguna primitiva ni aplicación restringe `tx` o `ty`; ambas quedan sin asignar, y la expresión tipa para cualquier sustitución: es polimórfica en las dos.

¿Por qué las demás son incorrectas?

- **d)** `y` nunca se usa en el cuerpo, así que nada fuerza `ty` a `int`. Ser parámetro no fija el tipo; lo fija el uso.
- **e)** Una variable sin asignar no es un error: señala que el tipo quedó libre, es decir, polimorfismo.

**Concepto EOPL:** §7.4, variables de tipo, asignación única y polimorfismo.

---

#### Pregunta 10 (Difícil)

**Enunciado:** Generación de ecuaciones para `proc (? f, ? x) (f +(x,1) zero?(x))`.

**Respuestas correctas: a), c), d) y e)**

**Justificación:**

Cada constructor sintáctico genera una ecuación entre tipos (Clase 10, EOPL §7.4, Figura 7.7).

- **a)** Correcta. `+(x,1)` aplica la primitiva de tipo `(int * int -> int)` a operandos de tipo `tx` e `int`, con resultado `t2`: `(int * int -> int) = (tx * int -> t2)`.
- **c)** Correcta. Por la regla de aplicación sobre `(f +(x,1) zero?(x))`: `tf = (t2 * t3 -> t1)`.
- **d)** Correcta. `zero?(x)` aplica la primitiva de tipo `(int -> bool)` al operando `x` de tipo `tx`, con resultado `t3`: `(int -> bool) = (tx -> t3)`.
- **e)** Correcta. De las ecuaciones de las primitivas: `tx = int` y `t3 = bool`.

¿Por qué la otra es incorrecta?

- **b)** De las primitivas `+` y `zero?` se deduce `tx = int`, no `tx = bool`.

**Concepto EOPL:** §7.4, Figura 7.7, reglas de aplicación y de las primitivas.

---

#### Pregunta 11 (Difícil)

**Enunciado:** Inferencia de `let f = proc (? x) x in let y = (f 5) in let z = (f true) in f`.

**Respuestas correctas: a), b), c) y e)**

**Justificación:**

`f` es la identidad; cada aplicación fuerza el tipo de su parámetro, y la variable de tipo es de asignación única (Clase 10, EOPL §7.4).

- **a)** Correcta. `proc (? x) x` recibe `x` y lo devuelve sin cambios: su tipo es `(tx -> tx)`, la identidad.
- **b)** Correcta. `(f 5)` aplica `f` a un `int`; al unificar `(tx -> tx)` con `(int -> t1)` se obtiene `tx = int`.
- **c)** Correcta. `(f true)` aplica `f` a un `bool`; la unificación impone `tx = bool`.
- **e)** Correcta. `(f 5)` ya dejó `tx` en `int`; `(f true)` la querría en `bool`. Una variable de asignación única no admite ambos valores, y el sistema se rechaza.

¿Por qué la otra es incorrecta?

- **d)** El sistema del curso **no** admite *let*-polimorfismo: los usos sucesivos de `f` comparten la misma variable de tipo `tx`, no una copia por uso.

**Concepto EOPL:** §7.4, unificación y variables de tipo de asignación única.

---

#### Pregunta 12 (Media)

**Enunciado:** Inferencia de `proc (? g) if (g 0) then 1 else 2`.

**Respuestas correctas: a), b), c) y e)**

**Justificación:**

Cada constructor genera una ecuación; la unificación las resuelve (Clase 10, EOPL §7.4).

- **a)** Correcta. La aplicación `(g 0)` aplica `g` al literal `0` (de tipo `int`): `g` unifica con `(int -> tg)`.
- **b)** Correcta. `(g 0)` es la prueba del `if`; la regla del `if` fuerza su tipo a `bool`, de modo que `tg = bool`.
- **c)** Correcta. Con `g = (int -> bool)` y un `if` de tipo `int` (ramas `1` y `2`), el `proc` tiene tipo `((int -> bool) -> int)`.
- **e)** Correcta. La inferencia deja `g` con tipo `(int -> bool)`.

¿Por qué la otra es incorrecta?

- **d)** El tipo del `proc` no es `(int -> int)`: el parámetro `g` no recibe un `int`, recibe un procedimiento. Que `g` se aplique a `0` no hace que `g` sea `int`.

**Concepto EOPL:** §7.4, reglas de aplicación y del `if` en la inferencia.

---

### Sección 4: Objetos

#### Pregunta 13 (Media)

**Enunciado:** Análisis de un programa con la clase `cuenta` (dos instancias).

**Respuestas correctas: a), b) y c)**

**Justificación:**

Un objeto combina estado (campos) y comportamiento (métodos); cada instancia tiene su propio estado (Clase 11, EOPL §9).

- **a)** Correcta. `saldo` es el campo: el estado de la cuenta. `depositar` y `consultar` son métodos: su comportamiento.
- **b)** Correcta. La descripción de los métodos vive en la clase y la comparten `c1` y `c2`; el campo `saldo` es propio de cada instancia.
- **c)** Correcta. `send c1 depositar(20)` lleva el `saldo` de `c1` de 100 a 120; el de `c2` sigue en 50. El programa produce `(120 50)`.

¿Por qué las demás son incorrectas?

- **d)** Bajo encapsulación, el cuerpo del `let` no puede leer ni escribir `saldo` directamente: los campos solo están en alcance dentro de los métodos. El acceso pasa siempre por `send`.
- **e)** `c1` y `c2` no comparten `saldo`: cada `new` crea una instancia con su propio campo. Lo que comparten es la descripción de los métodos.

**Concepto EOPL:** §9, estado y comportamiento, instancias y encapsulación.

---

#### Pregunta 14 (Difícil)

**Enunciado:** Despacho dinámico con `send self m2()` heredado de `c1` por `c2`.

**Respuestas correctas: a), c), d) y e)**

**Justificación:**

`send` resuelve el método en la clase **real** del receptor (Clase 11, EOPL §9).

- **a)** Correcta. `(send o1 m3())` ejecuta `m3`, que llama `send self m2()` con `self = o1` (clase `c1`): retorna 2. `(send o2 m3())` tiene `self = o2` (clase `c2`): retorna 3.
- **c)** Correcta. `m3` se hereda sin cambios; la diferencia surge porque `send self m2()` se resuelve sobre la clase real de `self`.
- **d)** Correcta. Con despacho estático (según la clase `c1` donde se define `m3`), ambas llamadas usarían el `m2` de `c1` y darían 2.
- **e)** Correcta. El despacho de `send` se decide en tiempo de ejecución según la clase de la instancia receptora.

¿Por qué la otra es incorrecta?

- **b)** `(send o2 m3())` da 3, no 2. Aunque `m3` esté definido en `c1`, `send self m2()` despacha sobre la clase real de `self`, que es `c2`, y `c2` redefine `m2`.

**Concepto EOPL:** §9, despacho dinámico vía `self`.

---

#### Pregunta 15 (Media)

**Enunciado:** Representaciones de objetos: simples (lista de partes) y planos (vector único).

**Respuestas correctas: a), b), d) y e)**

**Justificación:**

Las dos representaciones producen el mismo comportamiento; difieren en el costo de acceso (Clase 11, EOPL §9.2 -- §9.3).

- **a)** Correcta. En la representación simple, `o2` es una lista con una parte de `p2` (`[c,d,e]`) y una de `p1` (`[a,b]`).
- **b)** Correcta. Para leer el campo `a` el intérprete recorre la lista de partes hasta la parte de `p1`, donde se declara `a`.
- **d)** Correcta. En la representación plana, `o2` es un único vector con los campos heredados de `p1` primero: `#(3 4 4 6 5)`.
- **e)** Correcta. Ambas representaciones producen el mismo comportamiento observable; difieren en costo de acceso, de `super` y de creación.

¿Por qué la otra es incorrecta?

- **c)** En la representación plana el acceso a un campo es una indexación directa por *offset* precalculado, con costo `O(1)`. El costo lineal en la profundidad es propio de la representación simple.

**Concepto EOPL:** §9.2 -- §9.3, objetos simples y planos.
