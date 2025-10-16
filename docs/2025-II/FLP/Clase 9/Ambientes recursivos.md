Los ambientes recursivos son estrictamente para procedimientos, no vamos a permitir modificaciones a sus valores (es posible pero requiere un proceso en el cual debemos validar que sean procedimientos)

```scheme
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


```

En esta modificaciń al consultar el procedimiento, vamos a retornar una referencia con un unico valor que es un clausura

```scheme
(a-ref
                   0
                   (list->vector (list
                                  (closure (car args)
                                           (car bodies)
                                           env)
                                  )
```