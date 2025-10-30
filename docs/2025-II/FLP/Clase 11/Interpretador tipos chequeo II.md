Para generar los tipos se crea el procedimiento `expand-type-expression` que recibe una expresión de tipo y retorna un tipo.

```scheme
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
```

Este procedimiento permite transformar las expresiones de tipo en un tipo (AST):

```scheme
 (expand-type-expression (int-exp))
#(struct:atomic-type int)
> (expand-type-expression (bool-exp))
> (expand-type-expression (proc-type-exp (list (int-exp) (int-exp)) (bool-exp)))
#(struct:proc-type
  (#(struct:atomic-type int) #(struct:atomic-type int))
  #(struct:atomic-type bool))
```

## Diseño del interpretador

### Expresiones literales

1. Los casos de `int-type` y `bool-type` corresponden a los literales numéricos y booleanos del lenguaje
2. Si la expresión corresponde a una variable, se retorna el valor almacenado en el ambiente de tipos

```scheme
(define type-of-expression
  (lambda (exp tenv)
    (cases expression exp
      (lit-exp (d) int-type)
      (true-exp () bool-type)
      (false-exp () bool-type)
      (var-exp (id) (deref (apply-tenv tenv id)))
	...
	)
)

;Type enviroment
(define init-tenv
  (extend-env '(x y z) (list->vector (list int-type int-type int-type))
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
      ...
    )
  )
```

1. Si es un número retorna `int`
2. Si es falso o verdadero retorna `bool`
3. Si es una variable, busca el tipo en el ambiente de tipos

```scheme
(type-of-expression (cases program (parser "5") (a-program (exp) exp)) init-tenv)
#(struct:atomic-type int)
> (type-of-expression (cases program (parser "false") (a-program (exp) exp)) init-tenv)
#(struct:atomic-type bool)
> (type-of-expression (cases program (parser "true") (a-program (exp) exp)) init-tenv)
#(struct:atomic-type bool)
> (type-of-expression (cases program (parser "x") (a-program (exp) exp)) init-tenv)
#(struct:a-ref
  0
  #(#(struct:atomic-type int) #(struct:atomic-type int) #(struct:atomic-type int)))
> (type-of-expression (cases program (parser "y") (a-program (exp) exp)) init-tenv)
#(struct:a-ref
  1
  #(#(struct:atomic-type int) #(struct:atomic-type int) #(struct:atomic-type int)))
```

### Condicionales

La expresión `if` tiene tres partes:

1. `test-exp` debe ser de tipo `bool`
2. `true-exp` debe ser igual al `false-exp`

```scheme
(define type-of-expression
  (lambda (exp tenv)
    (cases expression exp
      ...
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
      ...
      )))

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
```

1. Calcula el tipo de `test-exp`
2. Calcula los tipos de `true-exp` y `false-exp`
3. `test-exp` debe ser `bool` (se invoca `check-equal-type!`)
4. `true-type` debe ser igual a `false-type`

Se crean los procedimientos:

1. `check-equal-type!` verifica que dos tipos sean iguales y genera error si no lo son
2. `type-to-external-form` presenta mensajes de error legibles

```scheme
. . type-check: Types didn't match bool != int in 
#(struct:if-exp #(struct:true-exp) #(struct:true-exp) #(struct:lit-exp 2))
> (type-of-expression (cases program (parser "if 3 then 1 else 2") (a-program (exp) exp)) init-tenv)
. . type-check: Types didn't match int != bool in 
#(struct:lit-exp 3)
```

### Procedimientos

Un procedimiento sigue la regla: `t1 * t2 * ... * tn -> t`

Un `proc` recibe tres elementos:
1. Lista de expresiones de tipos
2. Lista de identificadores
3. Un cuerpo (expresión)

Proceso:

1. Convertir la lista de expresiones de tipos en lista de tipos
2. Calcular el tipo resultante con ambiente extendido (identificadores y tipos calculados)
3. Generar el `proc-type`

```scheme
(define type-of-expression
  (lambda (exp tenv)
    (cases expression exp
      ....
      (proc-exp (targs args body)
                (type-of-proc-exp targs args body tenv))
     ...
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
```

Ejemplos:

```scheme
(type-of-expression (cases program (parser "proc(int x, bool y) 5") (a-program (exp) exp)) init-tenv)
#(struct:proc-type
  (#(struct:atomic-type int) #(struct:atomic-type bool))
  #(struct:atomic-type int))
> (type-of-expression (cases program (parser "proc(int x, bool y) x") (a-program (exp) exp)) init-tenv)
#(struct:proc-type
  (#(struct:atomic-type int) #(struct:atomic-type bool))
  #(struct:atomic-type int))
```

Ejemplo con error de tipos:

```scheme
(type-of-expression (cases program (parser "if true then proc(int x, bool y) x else proc(int x, bool y) y") (a-program (exp) exp)) init-tenv)
. . type-check: Types didn't match (int "*" bool -> int) != (int "*" bool -> bool) in 
#(struct:if-exp #(struct:true-exp) #(struct:proc-exp (#(struct:int-exp) #(struct:bool-exp)) (x y) #(struct:var-exp x)) #(struct:proc-exp (#(struct:int-exp) #(struct:bool-exp)) (x y) #(struct:var-exp y)))
```