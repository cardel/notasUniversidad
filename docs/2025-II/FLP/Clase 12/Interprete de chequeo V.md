# Primitivas

Las primitivas se trabajan como procedimientos de acuerdo al tipo que tengan:

1. **Primitivas numéricas**: ingresan `int` y emiten `int`
2. **Primitivas relacionales**: ingresan dos `int` y emiten `bool`  
3. **Primitivas booleanas**: ingresan `bool` y emiten `bool`

```scheme
(define type-of-expression
  (lambda (exp tenv)
    (cases expression exp
      (prim-exp (prim rands)
        ; Las primitivas se manejan como aplicaciones de procedimientos
        (type-of-application 
          (type-of-primitive prim rands)        ; Tipo de la primitiva
          (map (lambda (x) (type-of-expression x tenv)) rands) ; Tipos de los argumentos
          prim
          rands
          exp)
        )
      )
    )
  )
```

Se trabaja como una aplicación de un procedimiento, dado que una primitiva realiza una operación con argumentos, por ello las manejamos como tipos.

```scheme
(define type-of-primitive
  (lambda (prim rands)
    (cases primitive prim
      ; Primitivas aritméticas: toman N enteros y retornan un entero
      (add-prim ()
        (proc-type (map (lambda (x) int-type) rands) int-type))
      (sub-prim ()
        (proc-type (map (lambda (x) int-type) rands) int-type))      
      (prod-prim ()
        (proc-type (map (lambda (x) int-type) rands) int-type))
      (div-prim ()
        (proc-type (map (lambda (x) int-type) rands) int-type))
      
      ; Primitivas booleanas: toman N booleanos y retornan un booleano
      (and-prim ()
        (proc-type (map (lambda (x) bool-type) rands) bool-type))  
      (or-prim ()
        (proc-type (map (lambda (x) bool-type) rands) bool-type))
      
      ; Primitivas relacionales: toman 2 enteros y retornan un booleano
      (less-prim ()
        (proc-type (list int-type int-type) bool-type))  
      (lesseq-prim ()
        (proc-type (list int-type int-type) bool-type))  
      (more-prim ()
        (proc-type (list int-type int-type) bool-type))  
      (moreeq-prim ()
        (proc-type (list int-type int-type) bool-type))  
      (eq-prim ()
        (proc-type (list int-type int-type) bool-type))  ; Corregido: debe ser list
      (neq-prim ()
        (proc-type (list int-type int-type) bool-type))  ; Corregido: debe ser list
      )
    )
  )
```

# Letrec

El tipo `letrec` permite definir procedimientos recursivos. Ejemplo:

```scheme
letrec
  int f(int x, int y) = if >(x,0)
                        then (f -(x,1) +(y,1))
                        else y
                            
  bool g(int x) = if >(x,0) (g -(x,1)) else false
in
  (f 20 30)
```

**Proceso de verificación de tipos para letrec:**

1. Primero debemos crear los tipos para f y g:
   - tf = (int * int) → int
   - tg = int → bool
2. Verificamos que los cuerpos de f y g cumplan con emitir un int y un bool respectivamente
3. Retornamos el tipo de la expresión del letrec (f 20 30)

```scheme
(define type-of-expression
  (lambda (exp tenv)
    (cases expression exp
      (letrec-exp (typesproc procnames ttargs args bodies exp-body)
        (type-of-letrec typesproc procnames ttargs args bodies exp-body tenv)
        )
      )
    )
  )

(define type-of-letrec
  (lambda (tprocs procnames ttargs args bodies exp-body tenv)
    (let*
        (
         ; Expandir tipos de argumentos y resultados
         (arg-types (map (lambda (x) (expand-type-expression x)) ttargs))
         (result-types (map (lambda (x) (expand-type-expression x)) tprocs))
         ; Crear tipos de procedimiento
         (the-proc-types (map proc-type arg-types result-types))
         ; Extender ambiente con los procedimientos definidos
         (the-env-body (extend-env procnames (list->vector the-proc-types) tenv))
         )
      ; Verificar que cada cuerpo tenga el tipo declarado
      (for-each
        (lambda (ids args-types body result-type)
          (check-equal-type!
            (type-of-expression
              body
              (extend-env ids (list->vector args-types) the-env-body))
            result-type
            body))
        args arg-types bodies result-types)
      ; Retornar tipo de la expresión del cuerpo del letrec
      (type-of-expression exp-body the-env-body)
      )
    )
  )
```

# Set

La expresión `set` modifica el valor de una variable. No tiene tipo en el sentido tradicional, pero asumimos que retorna un `int` para evitar tener que crear un tipo nulo (void).

```scheme
(define type-of-expression
  (lambda (exp tenv)
    (cases expression exp
      (set-exp (id exp)
        ; Asignación retorna int por convención (evita tipo void)
        int-type)
      )
    )
  )
```

# Begin

La expresión `begin` evalúa una secuencia de expresiones y retorna el valor de la última expresión.

```scheme
(define type-of-expression
  (lambda (exp tenv)
    (cases expression exp
      (begin-type-exp (exps)
        (begin-type-exp exps tenv))
      )
    )
  )

(define begin-type-exp
  (lambda (lexp tenv)
    (cond
      ; Última expresión: su tipo es el tipo del begin
      [(null? (cdr lexp)) (type-of-expression (car lexp) tenv)]
      [else
        ; Evaluar tipos de expresiones intermedias
        (begin
          (type-of-expression (car lexp) tenv)
          (begin-type-exp (cdr lexp) tenv)
          )
        ]
      )
    )
  )
```

# Intérprete de tipos

El intérprete realiza dos procesos fundamentales:

1. **Verificación de tipos**: Se evalúa el tipo de la expresión
2. **Evaluación**: Se evalúa la expresión para obtener su valor

```scheme
(define eval-program
  (lambda (pgm)
    (cases program pgm
      (a-program (exp)
        ; Primero verificar tipos, luego evaluar
        (if
          (type? (type-of-expression exp init-tenv))
          (eval-expression exp init-env)
          (eopl:error "The evaluation of types is incorrect!")
          )
        )
      )
    )
  )
```

**Conceptos teóricos importantes:**

- **Sistema de tipos**: Garantiza que las operaciones se realicen sobre valores del tipo correcto
- **Verificación estática**: Se realiza antes de la ejecución del programa
- **Ambiente de tipos (tenv)**: Mantiene información sobre los tipos de las variables
- **Polimorfismo limitado**: Las primitivas pueden trabajar con diferentes cantidades de argumentos del mismo tipo