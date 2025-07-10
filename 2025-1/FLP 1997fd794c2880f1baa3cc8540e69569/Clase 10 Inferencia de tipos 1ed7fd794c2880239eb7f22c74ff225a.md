# Clase 10: Inferencia de tipos

```racket
--> proc(? a) +(a,1)
#(struct:closure (a) #(struct:primapp-exp #(struct:add-prim) (#(struct:var-exp a) #(struct:lit-exp 1))) #(struct:extended-env-record (x y z f) (4 2 5 #(struct:closure (y) #(struct:primapp-exp #(struct:mult-prim) (#(struct:var-exp y) #(struct:primapp-exp #(struct:decr-prim) (#(struct:var-exp y))))) #(struct:empty-env-record))) #(struct:empty-env-record)))
--> . . parsing: at line 1: nonterminal <program> can't begin with end-marker #f
> scan&parse
#<procedure:.../private/sllgen.rkt:1371:2>
> (type-of-expression (scan&parse "proc(? a) +(a,1)"))
. . type-of-expression: arity mismatch;
 the expected number of arguments does not match the given number
  expected: 2
  given: 1
> (type-of-expression (scan&parse "proc(? a) +(a,1)") init-tenv)
. . init-tenv: undefined;
 cannot reference an identifier before its definition
> (type-of-program (scan&parse "proc(? a) +(a,1)"))
#(struct:proc-type
  (#(struct:tvar-type 3 #(#(struct:atomic-type int))))
  #(struct:tvar-type 4 #(#(struct:atomic-type int))))
> (type-to-external-form  (type-of-program (scan&parse "proc(? a) +(a,1)")))
(int -> int)
> (type-to-external-form  (type-of-program (scan&parse "proc(? a) 1")))
(tvar7 -> int)
> (type-to-external-form  (type-of-program (scan&parse "proc(? a) (a 1)")))
((int -> tvar9) -> tvar9)
> (type-to-external-form  (type-of-program (scan&parse "proc(? a) +((a 1),2)")))
((int -> int) -> int)
> (type-to-external-form  (type-of-program (scan&parse "proc(? a) if (a 1) then 2 else 3")))
((int -> bool) -> int)
> (type-to-external-form  (type-of-program (scan&parse "proc(? a) if (a 1) then proc(? s) s else proc(int k) k")))
((int -> bool) -> (int -> int))
> (type-to-external-form  (type-of-program (scan&parse "proc(? a) if (a 1) then proc(? s) s else proc(? k) k")))
((int -> bool) -> (tvar20 -> tvar20))
> (type-to-external-form  (type-of-program (scan&parse "proc(? a) if (a 1) then proc(? s) s else proc(bool k) k")))
((int -> bool) -> (bool -> bool))
> (type-to-external-form  (type-of-program (scan&parse "proc(? a) if (a 1) then proc(? s) s else proc(bool k, int t) k")))
. . check-equal-type!: Different numbers of arguments (tvar27 -> tvar27) and (bool * int -> bool) in #(struct:if-exp #(struct:app-exp #(struct:var-exp a) (#(struct:lit-exp 1))) #(struct:proc-exp (#(struct:no-type-exp)) (s) #(struct:var-exp s)) #(struct:proc-exp (#(struct:a-type-exp #(struct:bool-type-exp)) #(struct:a-type-exp #(struct:int-type-exp))) (k t) #(struct:var-exp k)))

```

1. Incluimos el tipo opcional ? esto quiere decir que no conocemos el tipo
2. Cuando tenemos ? vamos a **inferir** el tipo, pero inicialmente lo marcamos una variable de tipo: la cual es una variable de asignación única ← Se asigna solo una vez, y si se intenta cambiar por un valor diferente entonces hay error de tipos, por ejemplo a es int, pero posteriormente se calcula es booleano, debe de fallar
3. Vamos a tener un conjunto de reglas para poder inferir los tipos
    1. let y letrec
    2. condicionales
    3. procedimientos y su evaluación
    4. primitivas

## Cambios en el interprete

Incluir type-opc-exp

```racket
    (optional-type-exp ("?")
      no-type-exp)
    (optional-type-exp (type-exp)
      a-type-exp)
```

Cuando es ? es el nuevo comportamiento, en caso de que sea int, bool o proc el comportamiento es igual que en chequeo de tipos

```racket
(define-datatype type type?
  (atomic-type (name symbol?))
  (proc-type
    (arg-types (list-of type?))
    (result-type type?))
  (tvar-type
    (serial-number integer?)
    (container vector?)))

(define expand-optional-type-expression
  (lambda (otexp tenv)
    (cases optional-type-exp otexp
      (no-type-exp () (fresh-tvar))
      (a-type-exp (texp) (expand-type-expression texp)))))
      
 ;crea un nuevo tipo de variable de tipo
(define fresh-tvar
  (let ((serial-number 0))
    (lambda ()
      (set! serial-number (+ 1 serial-number))
      (tvar-type serial-number (vector '())))))
```

Cuando tenemos un tipo, puede ? o un tipo (int, bool o proc) en caso que sea ? se genera una variable de tipo t1, t2, …, tn, en otro caso tiene el mismo comportamiento que en chequeo de tipos

```racket
(define check-tvar-equal-type!
  (lambda (tvar ty exp)
    (if (tvar-non-empty? tvar)
      (check-equal-type! (tvar->contents tvar) ty exp)
      (begin
        (check-no-occurrence! tvar ty exp)
        (tvar-set-contents! tvar ty)))))

```

Cuando es un  ? tiene el siguiente comportamiento

1. Cuando la variable está vacia, le asigna el tipo (begin …)
2. En otro caso, es decir si está asignado el tipo, invoca el procedimiento para comparar los tipos

### Reglas de tipos del libro EOPL

1. **Procedimientos (proc):**
Si la expresión de procedimiento tiene la forma `proc(x) e`, entonces:
    - Inferimos un nuevo tipo de variable `t1` para el parámetro `x`.
    - Inferimos el tipo de la expresión `e` en un entorno extendido donde `x` está asociado con `t1`. Supongamos que el tipo inferido de `e` es `t2`.
    - El tipo de `proc(x) e` es `(t1 -> t2)`.
2. **Aplicación de procedimientos:**
Si la expresión tiene la forma `(e1 e2)`, entonces:
    - Inferimos el tipo de la expresión `e1`, supongamos que es `t1`.
    - Inferimos el tipo de la expresión `e2`, supongamos que es `t2`.
    - Inferimos una nueva variable de tipo `t3`.
    - Comprobamos que el tipo `t1` es consistente con `(t2 -> t3)`.
    - El tipo de `(e1 e2)` es `t3`.
3. **Condicionales (if):**
Si la expresión tiene la forma `if e1 then e2 else e3`, entonces:
    - Inferimos el tipo de la expresión `e1`, supongamos que es `t1`.
    - Comprobamos que `t1` es consistente con `bool`.
    - Inferimos el tipo de la expresión `e2`, supongamos que es `t2`.
    - Inferimos el tipo de la expresión `e3`, supongamos que es `t3`.
    - Comprobamos que `t2` y `t3` son consistentes.
    - El tipo de `if e1 then e2 else e3` es `t2` (o `t3`, ya que son consistentes).
4. **Primitivas:**
Si la expresión tiene la forma de una operación primitiva como `+(e1, e2)` o `(e1, e2)`, entonces:
    - Inferimos el tipo de la expresión `e1`, supongamos que es `t1`.
    - Inferimos el tipo de la expresión `e2`, supongamos que es `t2`.
    - Comprobamos que `t1` y `t2` son consistentes con `int`.
    - El tipo de la operación primitiva es `int`.

## Resumen de inferencia de tipos

El documento aborda el concepto de inferencia de tipos en el lenguaje Racket, tomando como referencia las reglas de tipos descritas en el libro *Essentials of Programming Languages (EOPL)*. A continuación, se presenta un resumen de los aspectos más relevantes:

### Conceptos Principales

1. **Tipos Opcionales (`?`)**:
    - El tipo opcional `?` indica que el tipo es inicialmente desconocido.
    - Este tipo es tratado como una variable de tipo que puede asignarse una única vez. Si se intenta reasignar con un tipo diferente, se produce un error de tipos.
    - Se utilizan reglas para inferir los tipos en diferentes contextos, como procedimientos, condicionales y primitivas.
2. **Generación y Manejo de Variables de Tipo**:
    - Las variables de tipo (`t1`, `t2`, ...) se generan dinámicamente cuando el tipo es desconocido.
    - El procedimiento `fresh-tvar` crea una nueva variable de tipo única.
    - Si una variable de tipo ya tiene asignado un valor, se verifica la consistencia con el nuevo tipo utilizando `check-tvar-equal-type!`.
3. **Reglas de Inferencia de Tipos**:
    - **Procedimientos (`proc`)**:
    La expresión `proc(x) e` tiene tipo `(t1 -> t2)` donde `t1` es el tipo del parámetro `x` y `t2` es el tipo del cuerpo `e` evaluado en un entorno extendido.
    - **Aplicación de Procedimientos**:
    En `(e1 e2)`, el tipo de `e1` debe ser consistente con `(t2 -> t3)` donde `t2` es el tipo de `e2` y `t3` es el tipo inferido del resultado.
    - **Condicionales (`if`)**:
    En `if e1 then e2 else e3`, el tipo de `e1` debe ser `bool`, y los tipos de `e2` y `e3` deben ser consistentes entre sí.
    - **Primitivas**:
    Las operaciones primitivas como `+(e1, e2)` requieren que los tipos de `e1` y `e2` sean `int` y producen un resultado de tipo `int`.
4. **Extensiones al Intérprete**:
    - Se introduce `optional-type-exp` para manejar los tipos opcionales.
    - El manejo de tipos opcionales incluye la expansión mediante `expand-optional-type-expression` y la asignación de tipos mediante `check-tvar-equal-type!`.

### Aspectos Adicionales del Libro EOPL

- **Generalización de Tipos**:
El sistema de inferencia de tipos permite la generalización de tipos en expresiones como `let`, donde las variables pueden ser polimórficas siempre que no interfieran con el contexto local.
- **Limitaciones del Sistema**:
Aunque el sistema es robusto, no soporta completamente características avanzadas como la inferencia de tipos en presencia de subtipos o sobrecarga de operadores.

### Ejemplo de Inferencia

Un ejemplo típico es la evaluación de un procedimiento como `proc(? a) +(a,1)`:

- La variable `a` tiene un tipo inicial desconocido (`t1`).
- Se infiere que el tipo de la operación `+(a,1)` es `int`, lo que implica que `t1` debe ser consistente con `int`.
- El tipo inferido para el procedimiento completo es `(int -> int)`.

### Resumen Final

La inferencia de tipos permite la flexibilidad de trabajar con tipos inicialmente desconocidos, asignándolos dinámicamente a medida que se evalúan las expresiones. Este enfoque asegura que los programas sean tipados correctamente mientras se mantienen las ventajas del polimorfismo y la reutilización de código.

Lenguajes de programación que utilizan inferencia de tipos incluyen:

1. **Haskell**: Usa el sistema de tipos Hindley-Milner para inferir tipos estáticamente sin necesidad de anotaciones explícitas por parte del programador.
2. **OCaml**: También emplea Hindley-Milner, permitiendo la inferencia de tipos polimórficos en expresiones complejas.
3. **Scala**: Utiliza una combinación de inferencia de tipos local y estática, complementada con anotaciones opcionales cuando los tipos no se pueden deducir.
4. **TypeScript**: Realiza inferencia de tipos a partir del contexto del código y las asignaciones, combinando inferencia estática con anotaciones explícitas.
5. **Rust**: Inferencia de tipos a nivel local, basada en las variables y funciones en uso, pero requiere anotaciones cuando los tipos no son evidentes.
6. **Kotlin**: Utiliza inferencia de tipos estática para deducir tipos en variables y funciones, reduciendo la necesidad de anotaciones explícitas.

Todos estos lenguajes dependen de algoritmos como Hindley-Milner o sistemas similares que analizan las expresiones y su contexto, asegurando que los tipos sean consistentes a lo largo del programa.

# Procedimiento para resolver inferencia

1. Crear una variable de tipo para cada ligadura y argumento de proc en el código
2. Determinar los tipos de los procedimientos, las salidas las vamos a nombrar como t1,t2, … porque no las conocemos
3. Evaluar los llamados de los procedimientos
4. Hacer inferencia entre los pasos 2 y 3 para determinar algunos tipos
5. Revisar los cuerpos de los procedimientos y completar el procedimiento de inferencia de tipos

Tip para estudiar para el examen

```racket
(type-to-external-form (type-of-program (scan&parse "let
  f = proc (?x, int y) 
    if x then +(y, 1) 
    else -(y,1)
in
  let
    g = proc (?m, int n) 
      (m true n)
  in
    let
      h = (g f 5)
    in
      g")))
```

[2025-05-08-Note-08-29_annotated.pdf](2025-05-08-Note-08-29_annotated.pdf)

# Ejercicios

```racket

let
  f = proc (?x, ?y, ?z)
    if (x y) then *(z, 2) 
    else z
in
  let
    g = proc (?m)
      if m then true 
      else false
    k = 5
  in
    (f g true k)
```

[2025-05-08-Note-09-34_annotated.pdf](2025-05-08-Note-09-34_annotated.pdf)

## Ejercicio 2

```racket
let
  a = proc (int x, ?y)
    if (y x) then +(x, 1) 
    else +(x, 3)
  
  b = proc (?n, ?m, ?o, ?p)
    if (p m) then (n m o) 
    else (n *(m, 3) o)
  
  c = proc (int q)
    zero?(q)
  
  d = 3
in
  let
    t = proc (?f, ?g, ?z, ?w)
      (f g w z z)
  in
    (t b a c d)
```

codigo de prueba

```racket
(type-to-external-form (type-of-program (scan&parse "
let
  a = proc (int x, ?y)
    if (y x) then +(x, 1) 
    else +(x, 3)
  
  b = proc ((int*(int->bool)->int) n, ?m, ?o, ? p)
    if (p m) then (n m o) 
    else (n *(m, 3) o)
  
  c = proc (int q)
    zero?(q)
  
  d = 3
in
  let
    t = proc (?f, ?g, ?z, ?w)
      (f g w z z)
  in
    let t1 = (t b a c d) in t1")))
```

[2025-05-08-Note-10-26_annotated.pdf](2025-05-08-Note-10-26_annotated.pdf)

Recuerda que incluso los días más oscuros tienen un amanecer. Aunque ahora te sientas desmotivado, aburrido o sin creer en nada, esto no es el final de tu historia. Cada pequeño paso que das, aunque parezca insignificante, te acerca más a tus metas. La clave no está en ser perfecto, sino en ser constante. Permítete descansar, pero no renuncies. Dentro de ti hay una fuerza que aún no has descubierto, y lo mejor de tu camino está por venir. ¡Tú puedes con esto!