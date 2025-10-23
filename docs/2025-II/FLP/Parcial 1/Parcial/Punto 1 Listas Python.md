
(35 puntos) Se desea agregar al interpretador las listas al estilo Python, es decir, listas que pueden contener cualquier tipo de dato y que se representan como en el siguiente ejemplo: `[1][2][4][5]`, así mismo las primitivas `concat` para concatenar dos o más listas y `nth` para acceder a un elemento. Para esto se deben hacer cambios en la gramática, en la función eval-expression y se debe generar funciones auxiliares para trabajar con las listas.​

```scheme
let
    x = [1,2,3]
    y = [4,5,6]
    in let z = concat(x,y)
    	in [z, nth(z, 4)]
```


Debe retornar: `[[1,2,3,4,5],5]`

1. (10 puntos) Modifique la gramática para soportar las listas al estilo Python y agregar las primitivas `concat` y `nth`
    
2. (10 puntos) Modifique la función `eval-expression` para representar las listas
    
3. (15 puntos) Implemente las funciones auxiliares necesarias para soportar las primitivas `concat` y `nth`
    

A continuación se muestra la estructura general de lo que usted debe entregar, solo se requiere lo estrictamente necesario para resolver el problema. Solo escriba lo se debe agregar al interpretador.

```scheme
  (define grammar
   '( 
    (expression (....) list-exp) 
    (primitive (....) concat-exp)
    (primitive (....) nth-exp)
   )


  (define eval-expression)
    (lambda (exp env)
     (cases expression exp
      ......
    )
  )

  (define apply-primitive)
    (lambda (prim args)
     (cases primitive prim
      ......
    )
  )
```

# Solución

## Gramática

```scheme

  (define grammar
   '( 
   ; .....
    (expression ("[" (separated-list expression ",") "]") list-exp) 
    (primitive ("concat") concat-exp)
    (primitive ("nth") nth-exp)
    ; ...
   )

```

# Eval-expression

```scheme
  (define eval-expression)
    (lambda (exp env)
     (cases expression exp
      ;......
      (list-exp (lexp) 
        (map (lambda (x) (eval-expression x env)) lexp)
      )
      ; .....
    )
  )
```

# Apply-primitive

```scheme
  (define apply-primitive)
    (lambda (prim args)
     (cases primitive prim
      ; ....
      (concat-exp () (append (car args) (cadr args))) 
      (nth-exp () (list-ref (car args) (cadr args)))
      ; ....
    )
  )
```

`(list-ref l a)` es una función de Racket que retorna el elemento en la posición  a de lista l. También se podía crear una función auxiliar que usara un contador y una lista, cuando este contador llegara a cero retornar el primer elemento.

```scheme
  (define apply-primitive)
    (lambda (prim args)
     (cases primitive prim
      ; ....
      (concat-exp () (append (car args) (cadr args))) 
      (nth-exp () (search-val (car args) (cadr args)))
      ; ....
    )
  )
  
  (define search-val
	  (lambda (l val)
		  (cond
			  [(null? l) (eopl:error "Index bounds exception")]
			  [(= 0 val) (car l)]
			  [else (search-val (cdr l) (- val 1))]
		  )	   
	  )
  )

```

# Interprete

```scheme
#lang eopl  ; Lenguaje Essentials of Programming Languages

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
    (expression ("if" expression "then" expression "else" expression) if-exp)
    (expression ("let" (arbno identifier "=" expression)
                       "in" expression) let-exp)
    (expression ("proc" "(" (separated-list identifier ",") ")" expression) proc-exp)
    (expression ("letrec" (arbno
                           identifier "(" (separated-list identifier ",") ")"
                           "=" expression)
                          "in"
                          expression) letrec-exp)
    (expression ("(" expression (arbno expression) ")") app-exp)
    (expression ("[" (separated-list expression ",") "]") list-exp) 
    (primitive ("concat") concat-exp)
    (primitive ("nth") nth-exp)
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
(define-datatype environment environment?
  (empty-env)  ; Entorno vacío
  (extend-env  ; Extender entorno con nuevos bindings
   (lid (list-of symbol?))     ; Lista de identificadores
   (lval (list-of value?))     ; Lista de valores
   (old-env environment?)); Entorno anterior
  (extend-recursively-env
   (procname (list-of symbol?))
   (argss (list-of (list-of symbol?)))
   (bodies (list-of expression?))
   (old-env environment?))   
  )     
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
                    (search-var lid lval)))
      (extend-recursively-env
       (procnames llargs bodies old-env)
       (letrec
           (
            (search-proc
             (lambda (procs args bodies)
               (cond
                 [(null? procs) (apply-env old-env var)]
                 [(eqv? (car procs) var)
                  (closure (car args)
                           (car bodies)
                           env)]
                 [else (search-proc (cdr procs) (cdr args) (cdr bodies))]
                 )
               )
             )
            )
         (search-proc procnames llargs bodies)
         )
       )
      )
    )
  )

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
      (if-exp (cond-exp true-exp false-exp)
               (let
                   (
                    (cond-value (eval-expression cond-exp env))
                    )
                 (if (boolean? cond-value)
                     (if
                      cond-value
                      (eval-expression true-exp env)
                      (eval-expression false-exp env)
                      )
                     (eopl:error "The condition must be a boolean " cond-exp)
                     )
                 )
               )
      (let-exp (lid lexpr expr)
               (let
                   (
                    (vexpr (map (lambda (x) (eval-expression x env)) lexpr))
                    )
                 (eval-expression expr
                                     (extend-env lid vexpr env))
                 )
               )
      (proc-exp (lid exp)
                (closure lid exp env))
      (app-exp (rator rands)
               (let
                   (
                    (procv (eval-expression rator env))
                    (vrands (map (lambda (x) (eval-expression x env)) rands))
                    )
                 (if
                  (and
                   (procVal? procv)
                   (= (length (procVal->lid procv))
                      (length vrands))
                   )
                  (cases procVal procv
                    (closure
                     (lid exp old-env)
                     (eval-expression exp
                                      (extend-env lid vrands old-env))))
                  (eopl:error "Not a procedure or incorrect of number of args"))
                 )
               )

      ;; Manejo de expresiones letrec en eval-expression
      (letrec-exp
       (procnames llargs bodies expn)     ; Componentes de la expresión letrec
       (eval-expression
        expn                             ; Expresión del cuerpo principal (después de "in")
        (extend-recursively-env          ; Extender el ambiente con definiciones recursivas
         procnames                       ; Lista de nombres de procedimientos
         llargs                          ; Lista de listas de argumentos (parámetros formales)
         bodies                          ; Lista de cuerpos de los procedimientos
         env)))                          ; Ambiente actual (base para la extensión)
      (list-exp (lexp) 
        (map (lambda (x) (eval-expression x env)) lexp))
      (else "Not implemeted yet")))) ; Default (no debería ocurrir)

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
      (concat-exp () (append (car values) (cadr values)))
      (nth-exp () (list-ref (car values) (cadr values)))
      (else 0)
      )))

; Intérprete interactivo: loop de lectura-evaluación-impresión
(define interpreter
  (sllgen:make-rep-loop
   "-->"          ; Prompt
   eval-program   ; Función de evaluación
   (sllgen:make-stream-parser lexical grammar) ; Parser para input stream
   ))

; Closure
; Representación de los procedimientos
(define-datatype procVal procVal?
  (closure
   (lid (list-of symbol?))
   (exp expression?)
   (old-env environment?)
   ))

;;Extractor para lid en un closure
(define procVal->lid
  (lambda (cls)
    (cases procVal cls
      (closure (lid exp old-env)
               lid))))

; Iniciar el intérprete
(interpreter)
```