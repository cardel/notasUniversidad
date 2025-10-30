# Evaluación de procedimientos

En la evaluación se deben validar:

1. El `rator` debe ser un `procVal`
2. El número de argumentos debe ser igual al número que espera el `procVal`
3. Los tipos de los argumentos deben ser iguales a lo que espera el procedimiento

```scheme
let
	f = proc(int x) x
	in
	 (f 3)
```

Al evaluar el procedimiento, el resultado es el tipo de retorno del proc. Ejemplo:

1. `f` es `int -> int`
2. `(f 3)` es `int`

Para evaluar esto se modifican los ambientes iniciales:

```scheme
(define type-of-expression
	(lambda (exp tenv)
	...
		(app-exp (rator rands)
		               (let
		                   (
		                    (trator (type-of-expression rator tenv))
		                    (trands (map (lambda (x) (type-of-expression x tenv)) rands))
		                    )
		                 (type-of-application trator trands rator rands exp)
		                 )
		               )
		               
	...
	)
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
```

1. En `app-exp` se calculan los tipos del `rator` (debe ser un proc) y los de los argumentos (lista de tipos)
2. Se invoca `type-of-application`:
   - Verifica que el tamaño de lo enviado sea igual a lo esperado
   - Verifica que cada tipo enviado sea igual al tipo esperado
   - Si todo está bien, retorna el tipo resultado del proc

```scheme
(define env0
  (extend-env '(a b c) (list->vector '(4 5 6)) (empty-env)))

(define init-env
  (extend-env '(x y z f) (list->vector (list 1 2 3 (closure '(x y)
                                                            (prim-exp (add-prim) (list (var-exp 'x) (var-exp 'y))) env0)))
              env0))
              
(define init-tenv
  (extend-env '(x y z f) (list->vector (list int-type int-type int-type
                                           (proc-type
                                            (list int-type int-type int-type)
                                            int-type)
                                             ))
              (extend-env '(a b c) (list->vector (list int-type int-type int-type)) (empty-env))))
```

Evaluación:

```scheme
> (type-of-expression (cases program (parser "f") (a-program (exp) exp)) init-tenv)
#(struct:proc-type
  (#(struct:atomic-type int) #(struct:atomic-type int) #(struct:atomic-type int))
  #(struct:atomic-type int))
(type-of-expression (cases program (parser "(f 1 2 3)
") (a-program (exp) exp)) init-tenv)
#(struct:atomic-type int)
```