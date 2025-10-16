
Implementamos los targets

1. Target-directo un valor expresado
2. Target indirecto apunta a un target directo, esto garantiza que al pasar la referencia a un procedimiento siempre tengamos hacia un target directo
```scheme
;;Paso por referencia
(define-datatype target target?
  (direct-target (val expval?))
  (indirect-target (ref ref-to-direct-target?)))

;Expval is a number, boolean or procval (expressed value)
(define expval?
  (lambda (x)
    (or (number? x) (boolean? x) (procVal? x))))

;Ref a target direct must be a reference and this reference have to content a direct target
(define ref-to-direct-target?
  (lambda (x)
    (and
     (reference? x)
     (cases reference x
       (a-ref (pos vec)
              (cases target (vector-ref vec pos)
                             (direct-target (v) #T)
                             (indirect-target (v) #F)))))))
```

Cambia deref por el hecho de que una direct target contiene un valor y un indirect target contine un direct target que a su vez contiene un valor

```scheme
(define deref
  (lambda (ref)
    (cases target (primitive-deref ref)
      (direct-target (val) val)
      (indirect-target (ref1)
                       (cases target (primitive-deref ref1)
                         (direct-target (val) val)
                         (indirect-target (p)
                                          (eopl-error "Illegal reference" ref1)))))))
```

Ahora cambiamos setref

1. Si es un target directo usamos la misma referencia
2. Si es un target indirecto usamos la referencia que esta contenida en el

```scheme
;Setref es un procedimiento para cambiar el valor de una referencia
(define setref!
  (lambda (ref val)
    (let
        (ref1
         (cases target (primitive-deref ref)
           (direct-target (e) ref)
           (indirect-target (r) r))
         )
      (primitive-setref! ref1 (direct-target val)))))

```

Modificamos el let

```scheme
(let-exp (lid lexpr expr)
               (let
                   (
                    (vexpr (map (lambda (x) (direct-target (eval-expression x env))) lexpr))
                    )
                 (eval-expression expr
                                     (extend-env lid (list->vector vexpr) env))
                 )
               )
```

El let debe generar direct-target

Modificamos el ambiente inicial

```scheme
; Entorno inicial predefinido (variables x,y,z y a,b,c con valores numéricos)
(define init-env
  (extend-env '(x y z) (list->vector (list (direct-target 1)
                                           (direct-target 2)
                                           (direct-target 3)
                                           )
                                     )
              (extend-env '(a b c) (list->vector (list

                                                  (direct-target 4)
                                                  (direct-target 5)
                                                  (direct-target 6)
                                                  )
                                                 ) (empty-env))))
```

El ambiente inicial tiene direct-target