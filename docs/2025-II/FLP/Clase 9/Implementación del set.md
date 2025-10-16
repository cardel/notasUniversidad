Para implementar el set necesitamos introducir el concepto de referencia

La referencia nos va a mapear el nombre con su valor

![](attachments/Pasted%20image%2020251016143709.png)

El cambio que vamos a tener con respecto al paradigma funcional, es el hecho que introducir las referencias. Estas nos permiten relacionar nombres con valores y sencillamente cuando hacemos una asignación se genera una nueva referencia

# Referencias

Las referencias son TADs que permiten gestionar la relación entre nombres y valores, para esto1 vamos a generar un nuevo datatype

```scheme
(define-datatype reference reference?
  (a-ref (position integer?)
         (vec vector?)))
```
Una referencia se define como una posición y un vector
## deref
Es una operación que toma una referencia y me devuelve el valor asociado

```scheme
;;dref: reference -> value
(define deref
  (lambda (ref)
    (primitive-deref ref)))

;primitive-refef: reference -> valor
(define primitiva-deref
  (lambda (ref)
    (cases reference ref
      (a-ref (pos vec)
             (vector-ref vec pos)))))
```

## setref!

El setref! toma una referencia y un valor, genera una nueva referencia con el valor modificado

```scheme
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
  

```

Esto va permitir que cuando consultemos el ambiente (almacen de valores), se generen las referencias.

```scheme
; Definición del entorno (environment) como estructura de datos
(define-datatype environment environment?
  (empty-env)  ; Entorno vacío
  (extend-env  ; Extender entorno con nuevos bindings
   (lid (list-of symbol?))     ; Lista de identificadores
   (lval vector?)     ; Vector de valores
   (old-env environment?)); Entorno anterior
  (extend-recursively-env
   (procname (list-of symbol?))
   (argss (list-of (list-of symbol?)))
   (bodies (list-of expression?))
   (old-env environment?))   
  )     
; Pre
```
Al cambiar la lista por el vector esto nos va permitir hacer cambios en los valores, sin embargo, esto no es totalmente leal a lo que pasa realmente.

Tener en cuenta que por el momento los **ambientes extendidos recursivos no pueden ser redefinidos**

```scheme
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
                 [(null? procs) (apply-env-ref| old-env var)]
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

```

El principal cambio es que ahora apply-env me retorna una referencia cuando hago la busqueda las variables.

Observe que las referencias están asociadas a las ligaduras (sin el deref)
```scheme
-->x
#(struct:a-ref 0 #(1 2 3))
-->y
#(struct:a-ref 1 #(1 2 3))
-->z
#(struct:a-ref 2 #(1 2 3))
-->a
#(struct:a-ref 0 #(4 5 6))
-->b
#(struct:a-ref 1 #(4 5 6))
-->c
#(struct:a-ref 2 #(4 5 6))
```

Ahora debemos cambiar en el let para adaptarnos a los ambientes con vectores

```scheme
      (let-exp (lid lexpr expr)
               (let
                   (
                    (vexpr (map (lambda (x) (eval-expression x env)) lexpr))
                    )
                 (eval-expression expr
                                     (extend-env lid (list->vector vexpr) env))
                 )
               )
```

Hay un cambio tambien en el app-exp

```scheme
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

```

Ahora implementamos el set

```scheme
      (set-exp (id exp)
               (begin
                 (setref!
                  (apply-env-ref env id)
                  (eval-expression exp env))
                 (void)))
```

Aqui el set, sencillamente.

```scheme
set x = 10
```

1. Obtiene la referencia asociada a la variable
2. Obtiene el valor (evalua el argumento de la derecha)
3. Invoca al procedimiento observador setref! para aplicar el cambio en la referencia

# Ejemplos

```scheme
-->x
1
-->set x = 10
#(struct:void)
-->x
10
```

```scheme
let x = 10 y = 20 z = 30
in
	begin
		set x = 30;
		set y = 40;
		set z = 100;
		+(x,y,z)
	end
170
```