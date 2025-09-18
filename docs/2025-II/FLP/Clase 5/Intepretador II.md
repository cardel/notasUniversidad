# Resumen

1. Vamos a una especificación lexica y gramatical
2. El interprete nos proporciona un scanner y un parser: Transformar código en AST
3. Nuestra tarea siempre va ser trabajar el AST para retornar una respuesta al programador


# Aspectos

1. Vamos a un prompt (REPL) que nos va permitir introducir el código
2. Vamos a generar un ambiente para tener ligaduras, para esto vamos a tener datatype. El ambiente no tiene nada que ver con el código

```scheme
#lang eopl  ; Lenguaje Essentials of Programming Languages

; Definición de la gramática en comentario (BNF extendido)
#|
<expression> ::= <identifier>
                 var-exp(id)
             ::= <number>
                 lit-exp(dat)
             ::= "true"
                 true-exp()
             ::= "false"
                 false-exp()
             ::= <primitive> "(" <expression>* (,) ")"
                 prim-exp(prim, rands)
                 
<primitive> 
            ::= "+" plus-prim()
            ::= "-" sub-prim()
            ::= "*" times-prim()
            ::= "/" div-prim()
            ::= "and" and-prim()
            ::= "or" or-prim()
            ::= ">" more-prim()
            ::= ">=" moreeq-prim()
            ::= "<" less-prim()
            ::= "<=" lesseq-prim()
|#

; Especificación léxica: define tokens y patrones regex
(define lexical
  '(
    (comment ("%" (arbno (not #\newline))) skip)  ; Comentarios: % hasta newline (se ignoran)
    (whitespace (whitespace) skip)                ; Espacios en blanco (se ignoran)
    (number (digit (arbno digit)) number)         ; Números positivos: dígitos
    (number ("-" digit (arbno digit)) number)     ; Números negativos: - seguido de dígitos
    (identifier (letter (arbno (or letter digit))) symbol) ; Identificadores: letra seguida de letras/dígitos
    ))

; Gramática para el parser (producciones y constructores del AST)
(define grammar
  '(
    (program (expression) a-program)              ; Programa: una expresión
    (expression (identifier) var-exp)             ; Expresión: variable
    (expression (number) lit-exp)                 ; Expresión: literal numérico
    (expression ("true") true-exp)                ; Expresión: booleano true
    (expression ("false") false-exp)              ; Expresión: booleano false
    (expression (primitive "(" (separated-list expression ",") ")") prim-exp) ; Expresión primitiva con argumentos
    (primitive ("+") add-prim)                    ; Primitiva: suma
    (primitive ("-") sub-prim)                    ; Primitiva: resta
    (primitive ("*") prod-prim)                   ; Primitiva: multiplicación
    (primitive ("/") div-prim)                    ; Primitiva: división
    (primitive ("and") and-prim)                  ; Primitiva: and lógico
    (primitive ("or") or-prim)                    ; Primitiva: or lógico
    (primitive ("<") less-prim)                   ; Primitiva: menor que
    (primitive ("<=") lesseq-prim)                ; Primitiva: menor o igual
    (primitive (">") more-prim)                   ; Primitiva: mayor que
    (primitive (">=") moreeq-prim)                ; Primitiva: mayor o igual
    (primitive ("==") eq-prim)                    ; Primitiva: igualdad
    (primitive ("!=") neq-prim)                   ; Primitiva: desigualdad
    )
  )

;; Generar datatypes automáticamente a partir de lexical/grammar
(sllgen:make-define-datatypes lexical grammar)

; Scanner: convierte string en lista de tokens```scheme
#lang eopl  ; Lenguaje Essentials of Programming Languages

; Definición de la gramática en comentario (BNF extendido)
#|
<expression> ::= <identifier>
                 var-exp(id)
             ::= <number>
                 lit-exp(dat)
             ::= "true"
                 true-exp()
             ::= "false"
                 false-exp()
             ::= <primitive> "(" <expression>* (,) ")"
                 prim-exp(prim, rands)
                 
<primitive> 
            ::= "+" plus-prim()
            ::= "-" sub-prim()
            ::= "*" times-prim()
            ::= "/" div-prim()
            ::= "and" and-prim()
            ::= "or" or-prim()
            ::= ">" more-prim()
            ::= ">=" moreeq-prim()
            ::= "<" less-prim()
            ::= "<=" lesseq-prim()
|#

; Especificación léxica: define tokens y patrones regex
(define lexical
  '(
    (comment ("%" (arbno (not #\newline))) skip)  ; Comentarios: % hasta newline (se ignoran)
    (whitespace (whitespace) skip)                ; Espacios en blanco (se ignoran)
    (number (digit (arbno digit)) number)         ; Números positivos: dígitos
    (number ("-" digit (arbno digit)) number)     ; Números negativos: - seguido de dígitos
    (identifier (letter (arbno (or letter digit))) symbol) ; Identificadores: letra seguida de letras/dígitos
    ))

; Gramática para el parser (producciones y constructores del AST)
(define grammar
  '(
    (program (expression) a-program)              ; Programa: una expresión
    (expression (identifier) var-exp)             ; Expresión: variable
    (expression (number) lit-exp)                 ; Expresión: literal numérico
    (expression ("true") true-exp)                ; Expresión: booleano true
    (expression ("false") false-exp)              ; Expresión: booleano false
    (expression (primitive "(" (separated-list expression ",") ")") prim-exp) ; Expresión primitiva con argumentos
    (primitive ("+") add-prim)                    ; Primitiva: suma
    (primitive ("-") sub-prim)                    ; Primitiva: resta
    (primitive ("*") prod-prim)                   ; Primitiva: multiplicación
    (primitive ("/") div-prim)                    ; Primitiva: división
    (primitive ("and") and-prim)                  ; Primitiva: and lógico
    (primitive ("or") or-prim)                    ; Primitiva: or lógico
    (primitive ("<") less-prim)                   ; Primitiva: menor que
    (primitive ("<=") lesseq-prim)                ; Primitiva: menor o igual
    (primitive (">") more-prim)                   ; Primitiva: mayor que
    (primitive (">=") moreeq-prim)                ; Primitiva: mayor o igual
    (primitive ("==") eq-prim)                    ; Primitiva: igualdad
    (primitive ("!=") neq-prim)                   ; Primitiva: desigualdad
    )
  )

;; Generar datatypes automáticamente a partir de lexical/grammar
(sllgen:make-define-datatypes lexical grammar)

; Scanner: convierte string en lista de tokens
; scanner -> string -> lista de tokens
(define scanner
  (lambda (program)
    ((sllgen:make-string-scanner lexical grammar) program)))

; Parser: convierte string en AST usando la gramática
; parser: string -> ast
(define parser
  (lambda (program)
    ((sllgen:make-string-parser lexical grammar) program)))

; Definición del entorno (environment) como estructura de datos
(define-datatype environment enviroment?
  (empty-env)  ; Entorno vacío
  (extend-env  ; Extender entorno con nuevos bindings
   (lid (list-of symbol?))     ; Lista de identificadores
   (lval (list-of value?))     ; Lista de valores
   (old-env enviroment?)))     ; Entorno anterior

; Predicado value?: cualquier valor es válido (implementación simplificada)
(define value?
  (lambda (v)
    #T))

; Aplicar entorno: busca un símbolo en el entorno y retorna su valor
; apply-env: environment -> value
(define apply-env
  (lambda (env var)
    (cases environment env
      (empty-env () (eopl:error "Variable not found" var)) ; Error si no se encuentra
      (extend-env (lid lval old-env)
                  (letrec
                      ((search-var ; Búsqueda recursiva en la lista de bindings
                        (lambda (lid lval)
                          (cond
                            [(null? lid) (apply-env old-env var)] ; Buscar en entorno anterior
                            [(equal? (car lid) var) (car lval)]   ; Encontrado
                            [else (search-var (cdr lid) (cdr lval))]) ; Continuar búsqueda
                        )))
                    (search-var lid lval))))))

; Evaluar programa: punto de entrada, evalúa la expresión del programa
; eval-program: program -> value
(define eval-program
  (lambda (pgm)
    (cases program pgm
      (a-program (exp) (eval-expression exp init-env)) ; Evalúa la expresión con entorno inicial
      )
    ))

; Entorno inicial predefinido (variables x,y,z y a,b,c con valores numéricos)
(define init-env
  (extend-env '(x y z) '(1 2 3)
              (extend-env '(a b c) '(4 5 6) (empty-env))))

; Evaluar expresión: recursivamente evalúa según el tipo de expresión
; eval-expression: expression -> value
(define eval-expression
  (lambda (exp env)
    (cases expression exp
      (var-exp (id) (apply-env env id))      ; Variable: busca en entorno
      (lit-exp (datum) datum)                ; Literal: retorna el número
      (true-exp () #t)                       ; True: retorna #t
      (false-exp () #f)                      ; False: retorna #f
      (prim-exp (prim lrands)                ; Primitiva: evalúa argumentos y aplica
                (let ((values (map (lambda (x) (eval-expression x env)) lrands)))
                  (apply-primitive prim values)))
      (else 0)))) ; Default (no debería ocurrir)

; Operación genérica: aplica una función binaria acumulativa a una lista
; operation: (T,T)->T, lista de valores, T -> value
(define operation
  (lambda (f lst acc)
    (cond
      [(null? lst) acc] ; Caso base: retorna acumulador
      [else (operation f (cdr lst) (f (car lst) acc))] ; Aplica f y acumula
      )))

; Aplicar primitiva: ejecuta la operación correspondiente sobre los valores
; apply-primitive: primitive, lista valores -> value
(define apply-primitive
  (lambda (prim values)
    (cases primitive prim
      (add-prim () (operation + values 0))        ; Suma acumulativa
      (sub-prim () (- (car values) (operation + (cdr values) 0))) ; Resta (first - sum(rest))
      (prod-prim () (operation * values 1))       ; Producto acumulativo
      (div-prim () (/ (car values) (operation * (cdr values) 1))) ; División (first / product(rest))
      (and-prim () (operation (lambda (a b) (and a b)) values #t)) ; AND acumulativo
      (or-prim () (operation (lambda (a b) (or a b)) values #f))   ; OR acumulativo
      (less-prim () (< (car values) (cadr values)))     ; < (2 args)
      (lesseq-prim () (<= (car values) (cadr values)))  ; <= (2 args)
      (more-prim () (> (car values) (cadr values)))     ; > (2 args)
      (moreeq-prim () (>= (car values) (cadr values)))  ; >= (2 args)
      (eq-prim () (= (car values) (cadr values)))       ; == numérico (2 args)
      (neq-prim () (not (= (car values) (cadr values)))) ; != numérico (2 args)
      )))

; Intérprete interactivo: loop de lectura-evaluación-impresión
(define interpreter
  (sllgen:make-rep-loop
   "-->"          ; Prompt
   eval-program   ; Función de evaluación
   (sllgen:make-stream-parser lexical grammar) ; Parser para input stream
   ))

; Iniciar el intérprete
(interpreter)
```

---

### Análisis del intérprete:

#### 1. **Valores denotados y expresados**:
- **Números**: Representados directamente como números de Scheme (ej: `5`).
- **Booleanos**: Representados como `#t` y `#f` de Scheme.
- **Valores expresados**: Son los resultados de la evaluación. El intérprete retorna valores de Scheme (números/booleanos).

#### 2. **Estructura del intérprete**:
- **`eval-program`**: Punto de entrada. Toma un AST de tipo `program` y evalúa su expresión con el entorno inicial.
- **`eval-expression`**: Evalúa recursivamente expresiones:
  - `var-exp`: Busca en el entorno.
  - `lit-exp`: Retorna el número.
  - `true-exp`/`false-exp`: Retornan booleanos.
  - `prim-exp`: Evalúa los argumentos y aplica la primitiva.

#### 3. **Manejo de entornos**:
- El entorno es una lista de bindings (`extend-env`) con alcance léxico.
- `apply-env` busca variables recursivamente (desde el entorno más reciente al más antiguo).
- El entorno inicial (`init-env`) define variables `x,y,z` y `a,b,c` con valores numéricos.

#### 4. **Primitivas**:
- Operaciones aritméticas (`+`, `-`, `*`, `/`): Implementadas con recursión acumulativa (`operation`).
- Operaciones booleanas (`and`, `or`): También usan `operation` con acumuladores iniciales (`#t` para `and`, `#f` para `or`).
- Comparaciones (`<`, `<=`, etc.): Operan sobre exactamente 2 argumentos (usando `car` y `cadr`).

#### 5. **Limitaciones**:
- **Tipado débil**: No hay verificación de tipos. Las primitivas aritméticas esperan números, pero no se valida.
- **Aridad fija**: Las comparaciones solo funcionan con 2 argumentos (aunque la gramática permite más).
- **División/resta no estándar**: 
  - `(- a b c)` se calcula como `a - (b + c)`.
  - `(/ a b c)` se calcula como `a / (b * c)`.
- **Booleanos y números mezclados**: No hay restricción para evitar operaciones como `(+ true 5)`.

#### 6. **Interactividad**:
- El `interpreter` usa `sllgen:make-rep-loop` para un REPL interactivo.
- Parseo y evaluación se integran automáticamente.

#### 7. **Convenciones de EOPL**:
- Usa `cases` para pattern matching en AST.
- Genera datatypes automáticamente con `sllgen:make-define-datatypes`.
- Errores manejados con `eopl:error`.

**Mejoras potenciales**: Añadir verificación de tipos, manejar aridad variable en comparaciones, y definir un valor denotado explícito (ej: `(define-datatype expval ...)`).

# Pruebas en el interprete

Debe comentar la ejecución del interprete, para evitar que el REPL se levante (prompt)

```scheme
> (eval-program (parser "x"))
1
> (eval-program (parser "y"))
2
> (eval-program (parser "+(x,y)"))
3
```