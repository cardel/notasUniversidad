# Solución Segundo Parcial — Fundamentos de Lenguajes de Programación 2026-I

## Versión B (G51)


---

### Sección 1: Asignación y referencias

#### Pregunta 1 (Media)

**Enunciado:** Traza de un `begin` con dos `set` sobre `c`.

**Respuestas correctas: a), c) y d)**

**Justificación:**

`c` parte de 5; `*(c, 2)` la lleva a 10; `add1(c)` a 11; la última expresión lee 11 (Clase 8, EOPL §4.2).

- **a)** Correcta. `c`: 5 → 10 → 11. El programa evalúa a `11`.
- **c)** Correcta. `begin` retorna el valor de su última expresión, `c`.
- **d)** Correcta. Las tres expresiones comparten la referencia que `let` asoció a `c`; por eso cada `set` es visible para la siguiente.

¿Por qué las demás son incorrectas?

- **b)** `set` muta el contenido de la referencia de `c`. El programa no evalúa a 5.
- **e)** `set` no crea una ligadura nueva: muta la ubicación existente. No hay una segunda ligadura de `c`.

**Concepto EOPL:** §4.2, semántica de `begin-exp` y `set-exp`.

---

#### Pregunta 2 (Difícil)

**Enunciado:** Clausura que captura `z`, evaluada con un ambiente basado en referencias.

**Respuestas correctas: a), c), d) y e)**

**Justificación:**

Con un ambiente basado en referencias, la clausura de `f` y el `begin` comparten la referencia de `z` (Clase 8, EOPL §4.2).

- **a)** Correcta. `set z = 1` muta la referencia compartida; `(f 2)` evalúa `z` y lee 1.
- **c)** Correcta. La clausura y el `begin` comparten la misma referencia de `z`; por eso `f` observa el efecto del `set`.
- **d)** Correcta. `f` ignora su argumento; su cuerpo es `z` y retorna el contenido actual de la referencia.
- **e)** Correcta. Tras introducir referencias, `z` denota una referencia y `set z = 1` cambia su contenido.

¿Por qué la otra es incorrecta?

- **b)** Esa sería la respuesta de una implementación ingenua que copia valores en la clausura. Con referencias compartidas no se copia el valor: el resultado es 1, no 0.

**Concepto EOPL:** §4.2, clausuras y estado compartido mediante referencias.

---

#### Pregunta 3 (Difícil)

**Enunciado:** Procedimiento con dos parámetros, llamado con un operando variable y uno compuesto, bajo paso por referencia.

**Respuestas correctas: a), b), c) y e)**

**Justificación:**

Bajo paso por referencia, un operando variable se pasa como blanco indirecto a su referencia; un operando no variable, como blanco directo (Clase 8, EOPL §4.3).

- **a)** Correcta. `a` es variable: `x` queda como blanco indirecto a la referencia de `a`; `set x` propaga y `a` pasa a 11.
- **b)** Correcta. `+(a, b)` no es variable: `y` recibe un blanco directo; `set y` solo modifica esa referencia local.
- **c)** Correcta. La expresión final `a` lee la referencia de `a`, ya mutada a 11.
- **e)** Correcta. `eval-rand` distingue: blanco indirecto si el operando es variable, blanco directo en otro caso.

¿Por qué la otra es incorrecta?

- **d)** El paso por referencia **sí** modifica al llamador cuando el operando es una variable. La expresión final retorna 11, no 10.

**Concepto EOPL:** §4.3, blancos directos e indirectos, `eval-rand`.

---

#### Pregunta 4 (Media)

**Enunciado:** Procedimiento que muta su parámetro, evaluado con paso por valor.

**Respuestas correctas: a), b), d) y e)**

**Justificación:**

Con paso por valor, el parámetro recibe una referencia nueva en cada llamado (Clase 8, EOPL §4.3).

- **a)** Correcta. `(p a)` calcula `*(5, 10) = 50` y retorna 50; la `a` exterior sigue en 5; `+(50, 5) = 55`.
- **b)** Correcta. `set x` muta la referencia local del parámetro `x`, no la de `a`; `a` conserva su valor.
- **d)** Correcta. Cada aplicación de `p` crea una referencia nueva para `x` (paso por valor).
- **e)** Correcta. `+((p a), a)` suma el resultado del llamado (50) y el valor de `a` (5).

¿Por qué la otra es incorrecta?

- **c)** El resultado no es 100. `set x` no modifica la `a` exterior: bajo paso por valor la mutación es local al parámetro.

**Concepto EOPL:** §4.3, paso por valor.

---

### Sección 2: Chequeo de tipos

#### Pregunta 5 (Media)

**Enunciado:** Reglas de tipamiento de CHECKED.

**Respuestas correctas: a), c) y e)**

**Justificación:**

Las reglas de tipamiento se escriben como fracciones premisas/conclusión (Clase 9, EOPL §7.1, Figura 7.4).

- **a)** Correcta. La regla del `if` exige prueba `bool` y ramas del mismo tipo `t`; el `if` tiene tipo `t`.
- **c)** Correcta. En una aplicación, el operador debe tener tipo procedimiento y su aridad debe coincidir con el número de operandos.
- **e)** Correcta. Una regla de tipamiento es una fracción: premisas arriba, conclusión abajo.

¿Por qué las demás son incorrectas?

- **b)** `let` no necesita anotaciones: el tipo de cada variable ligada se deduce de su expresión de inicialización. Solo `proc` las exige.
- **d)** La regla del `if` exige que las dos ramas tengan el **mismo** tipo; ramas de tipos distintos hacen abortar el chequeo.

**Concepto EOPL:** §7.1, Figura 7.4, reglas de tipamiento.

---

#### Pregunta 6 (Media)

**Enunciado:** Chequeo de `let doble = proc (int n) +(n, n) in (doble 6)`.

**Respuestas correctas: a), b), d) y e)**

**Justificación:**

`doble` recibe un `int` y su cuerpo `+(n, n)` produce un `int` (Clase 9, EOPL §7.1).

- **a)** Correcta. `doble` tiene tipo `(int -> int)`.
- **b)** Correcta. La variable `doble`, ligada por `let`, no necesita anotación: su tipo sale de la expresión `proc`.
- **d)** Correcta. El tipo de `doble` se arma con la anotación `int` del parámetro y el tipo `int` del cuerpo.
- **e)** Correcta. `(doble 6)` aplica `(int -> int)` a un `int`; el programa completo tiene tipo `int`.

¿Por qué la otra es incorrecta?

- **c)** `(doble 6)` es bien tipada. `6` es un literal de tipo `int`; los literales no llevan anotación, y `let` tampoco la exige.

**Concepto EOPL:** §7.1, regla de `let` y regla de aplicación.

---

#### Pregunta 7 (Media)

**Enunciado:** Chequeo de `letrec bool par (int n) = ... in (par true)`.

**Respuestas correctas: a), b), d) y e)**

**Justificación:**

`par` está bien definida, pero la aplicación final la usa con un argumento del tipo equivocado (Clase 9, EOPL §7.1).

- **a)** Correcta. La prueba `zero?(n)` es booleana; las ramas `true` y `(par sub1(n))` tienen tipo `bool`. La definición es correcta.
- **b)** Correcta. Parámetro `int`, resultado `bool`: `par` tiene tipo `(int -> bool)`.
- **d)** Correcta. `(par true)` aplica `par` a un `bool`, pero `par` espera un `int`: la aplicación es mal tipada.
- **e)** Correcta. `type-of-application` compara el tipo del argumento (`bool`) con el del parámetro (`int`); `check-equal-type!` aborta.

¿Por qué la otra es incorrecta?

- **c)** Que `par` retorne `bool` y `true` sea `bool` no salva el programa: el error está en el **argumento** de la aplicación, no en el tipo del resultado.

**Concepto EOPL:** §7.1, regla de aplicación y `check-equal-type!`.

---

#### Pregunta 8 (Media)

**Enunciado:** Chequeo de `let f = proc (bool b) if b then 1 else 0 in (f true)`.

**Respuestas correctas: a), b) y c)**

**Justificación:**

`f` recibe un `bool` y su cuerpo, un `if` con ramas enteras, produce un `int` (Clase 9, EOPL §7.1).

- **a)** Correcta. Parámetro anotado `bool`, cuerpo de tipo `int`: `f` tiene tipo `(bool -> int)`.
- **b)** Correcta. La prueba `b` es `bool` y las ramas `1` y `0` son `int`; el `if` tiene tipo `int`.
- **c)** Correcta. `(f true)` aplica `(bool -> int)` a un `bool`; el programa completo tiene tipo `int`.

¿Por qué las demás son incorrectas?

- **d)** El programa es bien tipado: `f` espera un `bool` y `true` es un `bool`. No hay error.
- **e)** La variable `f`, ligada por `let`, no necesita anotación: su tipo se deduce de la expresión `proc`. Solo los parámetros de `proc` se anotan.

**Concepto EOPL:** §7.1, regla de `let`, regla del `if` y regla de aplicación.

---

### Sección 3: Inferencia de tipos

#### Pregunta 9 (Media)

**Enunciado:** Inferencia de `proc (? f) (f f)`.

**Respuestas correctas: a), b), c) y e)**

**Justificación:**

Aplicar `f` a sí misma obliga a unificar el tipo de `f` con un tipo que lo contiene (Clase 10, EOPL §7.4.2).

- **a)** Correcta. `f` tiene tipo `tf`; la aplicación `(f f)` exige `tf = (tf -> t1)`, donde `t1` es el tipo del resultado.
- **b)** Correcta. Antes de ligar `tf`, el chequeo de ocurrencia recorre `(tf -> t1)` y encuentra dentro a la propia `tf`.
- **c)** Correcta. Ligar `tf` a un tipo que la contiene produciría un tipo infinito (cíclico); el inferidor rechaza el programa.
- **e)** Correcta. Sin el chequeo de ocurrencia, expandir o comparar ese tipo cíclico no terminaría.

¿Por qué la otra es incorrecta?

- **d)** El programa no tipa. El sistema del curso no tiene tipos cíclicos ni un tipo «universal»; `(f f)` no es tipable.

**Concepto EOPL:** §7.4.2, unificación y chequeo de ocurrencia.

---

#### Pregunta 10 (Difícil)

**Enunciado:** Generación de ecuaciones para `proc (? h, ? n) if (h n) then n else 0`.

**Respuestas correctas: a), b), c) y d)**

**Justificación:**

Cada constructor sintáctico genera una ecuación (Clase 10, EOPL §7.4, Figura 7.7).

- **a)** Correcta. La aplicación `(h n)` produce `th = (tn -> t1)`.
- **b)** Correcta. `(h n)` es la prueba del `if`: la regla fuerza `t1 = bool`.
- **c)** Correcta. Las ramas del `if` son `n` (tipo `tn`) y `0` (tipo `int`); deben coincidir, así que `tn = int`.
- **d)** Correcta. Con `th = (int -> bool)` y `tn = int`, y un cuerpo de tipo `int`, el `proc` tiene tipo `((int -> bool) * int -> int)`.

¿Por qué la otra es incorrecta?

- **e)** `h` tiene tipo `(int -> bool)`: recibe `n` (un `int`) y produce el valor de prueba del `if` (un `bool`). No es `(bool -> bool)`.

**Concepto EOPL:** §7.4, Figura 7.7, reglas de aplicación, `if` y `proc`.

---

#### Pregunta 11 (Difícil)

**Enunciado:** Inferencia de `proc (? p) if (p 3) then (p true) else (p 4)`.

**Respuestas correctas: a), b), c) y e)**

**Justificación:**

`p` se aplica a un `int` y a un `bool`; su tipo de argumento no puede ser ambos (Clase 10, EOPL §7.4).

- **a)** Correcta. `(p 3)` aplica `p` a un `int`: `tp = (int -> t1)`.
- **b)** Correcta. `(p true)` aplica `p` a un `bool`: `tp = (bool -> t2)`.
- **c)** Correcta. El argumento de `p` tendría que ser `int` y `bool` a la vez; el sistema no admite solución y se rechaza.
- **e)** Correcta. La unificación encuentra una discrepancia entre dos tipos atómicos distintos (`int` frente a `bool`).

¿Por qué la otra es incorrecta?

- **d)** El sistema del curso no admite polimorfismo por uso: una variable de tipo es de asignación única. `p` no puede aceptar `int` y `bool`.

**Concepto EOPL:** §7.4.2, unificación y discrepancia de tipos.

---

#### Pregunta 12 (Difícil)

**Enunciado:** Inferencia de `proc (? f) (f (f 0))`.

**Respuestas correctas: a), b), c) y d)**

**Justificación:**

`f` se aplica dos veces; las dos aplicaciones obligan a unificar argumento y resultado (Clase 10, EOPL §7.4).

- **a)** Correcta. La aplicación interna `(f 0)` aplica `f` a un `int`: `f` unifica con `(int -> t1)`.
- **b)** Correcta. La aplicación externa `(f (f 0))` pasa `(f 0)` (de tipo `t1`) como argumento de `f`; al unificar con `(int -> t1)` se obtiene `t1 = int`.
- **c)** Correcta. De las dos ecuaciones, `f` queda con tipo `(int -> int)`.
- **d)** Correcta. El cuerpo `(f (f 0))` tiene tipo `int`; el `proc` recibe `f` y produce `int`: su tipo es `((int -> int) -> int)`.

¿Por qué la otra es incorrecta?

- **e)** No hay chequeo de ocurrencia: ninguna variable de tipo aparece dentro del tipo con el que se la liga. El sistema se resuelve sin contradicción.

**Concepto EOPL:** §7.4, reglas de aplicación e inferencia de orden superior.

---

### Sección 4: Objetos

#### Pregunta 13 (Media)

**Enunciado:** Análisis de un programa con la clase `punto`.

**Respuestas correctas: a), b), c) y d)**

**Justificación:**

`new`, `send` y `self` se leen sobre el programa concreto (Clase 11, EOPL §9.1).

- **a)** Correcta. `new punto(3, 7)` crea la instancia y ejecuta `initialize`, que asigna `x = 3` y `y = 7`.
- **b)** Correcta. `send p mover(5)` envía el mensaje `mover` a `p`; al ejecutar el método, `self` queda ligado a `p`.
- **c)** Correcta. `mover(5)` lleva `x` de 3 a 8; `send p getx()` retorna `x`. El programa evalúa a `8`.
- **d)** Correcta. `punto` extiende `object`, la raíz de la jerarquía; no aparece ninguna clase padre intermedia ni se redefine un método heredado.

¿Por qué la otra es incorrecta?

- **e)** El cuerpo del `let` no puede leer `x` directamente: los campos solo están en alcance dentro de los métodos. El acceso a `x` desde fuera pasa por `send ... getx()`.

**Concepto EOPL:** §9.1, constructos `class`, `new`, `send`, `self`.

---

#### Pregunta 14 (Difícil)

**Enunciado:** Programa con herencia, `super` e `initialize`; evaluación de `(send o valor())`.

**Respuestas correctas: a), b) y c)**

**Justificación:**

`new b()` ejecuta `b.initialize`, que invoca `super initialize()` (Clase 11, EOPL §9).

- **a)** Correcta. `b.initialize` deja `x = 10` (vía `super`) y `y = 20`; `b.valor` calcula `+(super valor(), y) = +(10, 20) = 30`.
- **b)** Correcta. `super initialize()` dentro de `b.initialize` ejecuta `a.initialize`, que asigna `x = 10`.
- **c)** Correcta. `super valor()` ejecuta el `valor` de la clase padre `a` (que retorna `x`), conservando `self`.

¿Por qué las demás son incorrectas?

- **d)** `super` no reinicia la búsqueda en la clase real del receptor; arranca en la clase padre del método actual. Reiniciar en la clase real es el comportamiento de `send self`.
- **e)** `b` redefine `valor` como `+(super valor(), y)`, no como «solo `y`». El resultado es 30, no 20.

**Concepto EOPL:** §9, `super`, `self` e `initialize`.

---

#### Pregunta 15 (Media)

**Enunciado:** Resolución de `send obj m(args)`.

**Respuestas correctas: a), b), c) y d)**

**Justificación:**

`send` resuelve el método subiendo por la jerarquía desde la clase real del receptor (Clase 11, EOPL §9).

- **a)** Correcta. La búsqueda arranca en la clase real del receptor y sube por la jerarquía hasta encontrarlo.
- **b)** Correcta. Si la clase no declara `m`, la búsqueda continúa en la clase padre.
- **c)** Correcta. El cuerpo se ejecuta en un ambiente que liga `self` al receptor y los parámetros formales a los argumentos.
- **d)** Correcta. Si la cadena de clases se agota sin hallar `m`, el intérprete aborta con un error.

¿Por qué la otra es incorrecta?

- **e)** La búsqueda arranca en la clase real del receptor (la más específica) y **sube**; no arranca en `object` para descender.

**Concepto EOPL:** §9, despacho de `send` y búsqueda de método.
