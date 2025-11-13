
```scheme
#lang eopl
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
    (expression ("proc" "(" (separated-list type-exp identifier ",") ")" expression) proc-exp)
    (expression ("letrec" (arbno
                           type-exp identifier "(" (separated-list type-exp identifier ",") ")"
                           "=" expression)
                          "in"
                          expression) letrec-exp)

    (expression ("set" identifier "=" expression) set-exp)
    (expression ("begin" expression (arbno ";" expression) "end") begin-exp)
    (expression ("(" expression (arbno expression) ")") app-exp)
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
    (type-exp ("int") int-exp)
    (type-exp ("bool") bool-exp)
    (type-exp
     ("(" (separated-list type-exp "*") "->" type-exp ")") proc-type-exp)
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
   (lval vector?)     ; Lista de valores
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
; apply-env: environment -> valor
(define apply-env
  (lambda (env var)
    (deref (apply-env-ref env var))))


; apply-env: environment -> referencia
(define apply-env-ref
  (lambda (env var)
    (cases environment env
      (empty-env () (eopl:error "Variable not found" var)) ; Error si no se encuentra
      (extend-env (lid vec old-env)
                  (letrec
                      ((search-var ; Búsqueda recursiva en la lista de bindings
                        (lambda (lid lval [pos 0])
                          (cond
                            [(null? lid) (apply-env-ref old-env var)] ; Buscar en entorno anterior
                            [(equal? (car lid) var) (a-ref pos vec)]   ; Voy a generar una referencia cuando encuentro la variable
                            [else (search-var (cdr lid) vec (+ pos 1))]) ; Continuar búsqueda
                        )))
                    (search-var lid vec)))
      (extend-recursively-env
       (procnames llargs bodies old-env)
       (letrec
           (
            (search-proc
             (lambda (procs args bodies)
               (cond
                 [(null? procs) (apply-env-ref old-env var)]
                 [(eqv? (car procs) var)
                  (a-ref
                   0
                   (list->vector (list
                                  (closure (car args)
                                           (car bodies)
                                           env)
                                  )
                    ))]
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
      (a-program (exp)
                 (if
                  (type? (type-of-expression exp init-tenv))
                  (eval-expression exp init-env)
                  (eopl:error "The evaluation of types is incorrect!")
                  )
                 ); Evalúa la expresión con entorno inicial
      )
    ))


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
                                     (extend-env lid (list->vector vexpr) env))
                 )
               )
      (proc-exp (types lid exp)
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
                                      (extend-env lid (list->vector vrands) old-env))))
                  (eopl:error "Not a procedure or incorrect of number of args"))
                 )
               )

      ;; Manejo de expresiones letrec en eval-expression
      (letrec-exp
       (type procnames lltypes llargs bodies expn)     ; Componentes de la expresión letrec
       (eval-expression
        expn                             ; Expresión del cuerpo principal (después de "in")
        (extend-recursively-env          ; Extender el ambiente con definiciones recursivas
         procnames                       ; Lista de nombres de procedimientos
         llargs                          ; Lista de listas de argumentos (parámetros formales)
         bodies                          ; Lista de cuerpos de los procedimientos
         env)))                          ; Ambiente actual (base para la extensión)
      (begin-exp (exp lexp)
                 (letrec
                     (
                      (evaluation (lambda (lexp)
                                    (cond
                                      [(null? (cdr lexp)) (eval-expression (car lexp) env)]
                                      [else (begin
                                              (eval-expression (car lexp) env)
                                              (evaluation (cdr lexp)))]
                                      )
                                    )
                                  )
                      )
                   (evaluation (cons exp lexp))
                   )
                 )
      (set-exp (id exp)
               (begin
                 (setref!
                  (apply-env-ref env id)
                  (eval-expression exp env))
                 (void)))
                 
      (else "Not implemented yet")))) ; Default (no debería ocurrir)



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


;;References
(define-datatype reference reference?
  (a-ref (position integer?)
         (vec vector?)))

;;dref: reference -> value
(define deref
  (lambda (ref)
    (primitive-deref ref)))

;primitive-refef: reference -> valor
(define primitive-deref
  (lambda (ref)
    (cases reference ref
      (a-ref (pos vec)
             (vector-ref vec pos)))))

;setref
;Setref es un procedimiento para cambiar el valor de una referencia
(define setref!
  (lambda (ref val)
    (primitive-setref! ref val)))

(define primitive-setref!
  (lambda (ref val)
    (cases reference ref
      (a-ref (pos vec)
             (vector-set! vec pos val)))))
  

;;defininición del valor nulo
(define-datatype nulltype nulltype?
  (void))

; Tipos
(define-datatype type type?
  (atomic-type
   (nombre symbol?))
  (proc-type
   (arg-type (list-of type?))
   (result-t type?)))

;int
(define int-type (atomic-type 'int))
;bool
(define bool-type (atomic-type 'bool))

;expand-type-expression: expresion de tipos -> tipo
(define expand-type-expression
  (lambda (texp)
    (cases type-exp texp
      (int-exp () int-type)
      (bool-exp () bool-type)
      (proc-type-exp
       (targs tresult)
       (proc-type
        (expand-type-expressions targs)
        (expand-type-expression tresult)))
      )
    )
  )

;expand-type-expressions: list of type-exp -> list of types
(define expand-type-expressions
  (lambda (texps)
    (map expand-type-expression texps)))

;type-of-expression: expression -> type
(define type-of-expression
  (lambda (exp tenv)
    (cases expression exp
      (lit-exp (d) int-type)
      (true-exp () bool-type)
      (false-exp () bool-type)
      (var-exp (id) (deref (apply-tenv tenv id)))
      (if-exp (test-exp true-exp false-exp)
              (let
                  (
                   (test-type (type-of-expression test-exp tenv))
                   (true-type (type-of-expression true-exp tenv))
                   (false-type (type-of-expression false-exp tenv))
                   )
                (begin
                  (check-equal-type! test-type bool-type test-exp)
                  (check-equal-type! true-type false-type exp)
                  true-type ;false-type
                  )
                )
              )
      (proc-exp (targs args body)
                (type-of-proc-exp targs args body tenv))
      (app-exp (rator rands)
               (let
                   (
                    (trator (type-of-expression rator tenv))
                    (trands (map (lambda (x) (type-of-expression x tenv)) rands))
                    )
                 (type-of-application trator trands rator rands exp)
                 )
               )
      (let-exp (lid lval exp)
               (type-of-expression
                exp
                (extend-env
                 lid
                 (list->vector (map (lambda (x) (type-of-expression x tenv)) lval))
                 tenv)))
      (prim-exp (prim rands)
                (type-of-application 
                 (type-of-primitive prim rands)
                 (map (lambda (x) (type-of-expression x tenv)) rands)
                 prim
                 rands
                 exp)
                )
      (letrec-exp (typesproc procnames ttargs args bodies exp)
        (type-of-letrec exp typesproc procnames ttargs args bodies tenv)
        )
      (set-exp (id exp)
               int-type)
      (begin-exp (exp exps)
                 (begin-type-exp (cons exp exps) tenv))
      )))

;Type enviroment
(define init-tenv
  (extend-env '(x y z f) (list->vector (list int-type int-type int-type
                                           (proc-type
                                            (list int-type int-type int-type)
                                            int-type)
                                             ))
              (extend-env '(a b c) (list->vector (list int-type int-type int-type)) (empty-env))))


; apply-env: environment -> type
(define apply-tenv
  (lambda (env var)
    (cases environment env
      (empty-env () (eopl:error "Variable not found" var)) ; Error si no se encuentra
      (extend-env (lid vec old-env)
                  (letrec
                      ((search-var ; Búsqueda recursiva en la lista de bindings
                        (lambda (lid lval [pos 0])
                          (cond
                            [(null? lid) (apply-tenv old-env var)] ; Buscar en entorno anterior
                            [(equal? (car lid) var) (a-ref pos vec)]   ; Voy a generar una referencia cuando encuentro la variable
                            [else (search-var (cdr lid) vec (+ pos 1))]) ; Continuar búsqueda
                        )))
                    (search-var lid vec)))
      (extend-recursively-env
       (procnames llargs bodies old-env)
       (letrec
           (
            (search-proc
             (lambda (procs args bodies)
               (cond
                 [(null? procs) (apply-env-ref old-env var)]
                 [(eqv? (car procs) var)
                  (a-ref
                   0
                   (list->vector (list
                                  (closure (car args)
                                           (car bodies)
                                           env)
                                  )
                    ))]
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


;check-equal-type: type, type -> type
(define check-equal-type!
   (lambda (t1 t2 exp)
     (if
      (not (equal? t1 t2))
      (eopl:error 'type-check "Types didn't match ~s != ~s in ~%~s"
            (type-to-external-form t1)
            (type-to-external-form t2)
            exp)
      t1)))

(define type-to-external-form
  (lambda (t)
    (cases type t
      (atomic-type (name) name)
      (proc-type (targs tresult)
                 (append
                  (arg-types-to-external-form targs)
                 '(->)
                 (list (type-to-external-form tresult))
                 )
                 )
      )
    )
  )

(define arg-types-to-external-form
  (lambda (ty)
    (cond
      [(null? ty) '()]
      [(null? (cdr ty))
             (list (type-to-external-form (car ty)))]
      [else (append
                         (list (type-to-external-form (car ty)))
                         (list "*")
                         (arg-types-to-external-form (cdr ty)))]
     )
    )
  )

;type-of-proc-exp list of types, list of idenfier, exp => type
(define type-of-proc-exp
  (lambda (targs args body tenv)
    (let*
        (
         (args-types (expand-type-expressions targs))
         (result-type  (type-of-expression body
                                          (extend-env
                                           args
                                           (list->vector args-types)
                                           tenv)))
         )
      (proc-type args-types result-type))
    )
  )

(define type-of-application
  (lambda (trator trands rator rands exp)
    (cases type trator
      (proc-type (args-types result-type)
                 (if (= (length args-types) (length trands))
                     (begin
                       (for-each
                        check-equal-type!
                        trands
                        args-types
                        rands)
                       result-type)

                     (eopl:error 'type-of-application "Length of the args mismatch ~s ~s"  args-types trands)
                     )
                 )
      (else (eopl:error 'type-of-expression
                        "Rator isn't a proc-type ~s is a type ~s"
                        rator
                        (type-to-external-form trator)))
      )
    )
  )


; Entorno inicial predefinido (variables x,y,z y a,b,c con valores numéricos)
(define env0
  (extend-env '(a b c) (list->vector '(4 5 6)) (empty-env)))

(define init-env
  (extend-env '(x y z f) (list->vector (list 1 2 3 (closure '(x y)
                                                            (prim-exp (add-prim) (list (var-exp 'x) (var-exp 'y))) env0)))
              env0))


;; TIpos de los procedimientos
(define type-of-primitive
  (lambda (prim rands)
    (cases primitive prim
      (add-prim ()
                (proc-type (map (lambda (x) int-type) rands) int-type))
      (sub-prim ()
                (proc-type (map (lambda (x) int-type) rands) int-type))      
      (prod-prim ()
                 (proc-type (map (lambda (x) int-type) rands) int-type))
      (div-prim ()
                (proc-type (map (lambda (x) int-type) rands) int-type))        
      (and-prim ()
                (proc-type (map (lambda (x) bool-type) rands) bool-type))  
      (or-prim ()
               (proc-type (map (lambda (x) bool-type) rands) bool-type))
      (less-prim ()
                 (proc-type (list int-type int-type) bool-type))  
      (lesseq-prim ()
                   (proc-type (list int-type int-type) bool-type))  
      (more-prim ()
                 (proc-type (list int-type int-type) bool-type))  
      (moreeq-prim ()
                   (proc-type (list int-type int-type) bool-type))  
      
      (eq-prim ()
               (proc-type (int-type int-type) bool-type))
      
      (neq-prim ()
                (proc-type (int-type int-type) bool-type))  
      )
    )
  )

;;Procedimientos recursivos

(define type-of-letrec
  (lambda (exp tprocs procnames ttargs args bodies tenv)
    (let*
        (
         (arg-types (map (lambda (x) (expand-type-expressions x)) ttargs))
         (result-types (map (lambda (x) (expand-type-expression x)) tprocs))
         (the-proc-types (map proc-type arg-types result-types))
         (the-env-body (extend-env procnames (list->vector the-proc-types) tenv))
         )
         (for-each
          (lambda (ids args-types body result-type)
            (check-equal-type!
             (type-of-expression
              body
              (extend-env ids (list->vector args-types) the-env-body))
              result-type
              body))
          args arg-types bodies result-types)
      (type-of-expression exp the-env-body)
      
      )
    )
  )

;;begin-type-exp: lista exp -> type
(define begin-type-exp
  (lambda (lexp tenv)
    (cond
      [(null? (cdr lexp)) (type-of-expression (car lexp) tenv)]
      [else
       (begin
         (type-of-expression (car lexp) tenv)
         (begin-type-exp (cdr lexp) tenv)
         )
       ]
      )
    )
  )

; Iniciar el intérprete
(interpreter)
```