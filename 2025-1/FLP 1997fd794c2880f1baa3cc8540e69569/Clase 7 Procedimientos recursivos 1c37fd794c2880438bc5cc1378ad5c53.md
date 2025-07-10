# Clase 7: Procedimientos recursivos

Procedimientos recursivos

- Hasta el momento la definición de procedimiento no permite que se conozca a sí mismo, dado que al evaluarlo extiendo el ambiente donde fue creado el procedimiento

---

¿Como se resuelve?

Se introduce letrec como una caracteristica que permite **declarar procedimientos recursivos**

---

```racket
    (expresion ("letrec" (arbno identificador "(" (separated-list identificador ",") ")" "=" expresion) "in" expresion) letrec-exp) 
```

```racket
letrec
	f(x,y) = if >(x,0) then +(y, (f sub1(x) y)) else y
	g(x,y) = if >(x,0) then +(2, (f sub1(x) y)) else y
	in
		(f 5 3)
```

A diferencia de los procedimientos no recursivos, no **se almacena una clausura en el ambiente, si no que las definiciones**, la clausura se crea cuando se **invoca el procedimiento**

Esto obliga a definir un ambiente nuevo, ambiente extendido recursivo, es necesario cambiar el comportamiento de apply-env

```racket
(define-datatype ambiente ambiente?
  (ambiente-vacio)
  (ambiente-extendido
   (lids (list-of symbol?))
   (lvalue (list-of value?))
   (old-env ambiente?))

  (ambiente-extendido-recursivo
   (nombre-procedimientos (list-of symbol?))
   (argumentos-proc (list-of (list-of symbol?)))
   (cuerpos-proc (list-of expresion?))
   (old-env ambiente?))
  )
  
  ;;Hay un que agregar un caso nuevo en apply-env
  (define apply-env
	  (lambda (var env)
	     ....
	     (ambiente-extendido-recursivo (procnames lidss cuerpos old-env)
                          (letrec
                              (
                               (buscar-variable (lambda (procnames lidss cuerpos old-env)
                                                  (cond
                                                    [(null? procnames) (apply-env old-env var)]
                                                    [(equal? (car procnames) var)
                                                     **(closure
                                                      (car lidss)
                                                      (car cuerpos)
                                                      env)**
                                                     ]
                                                    [else
                                                     (buscar-variable (cdr procnames) (cdr lidss) (cdr cuerpos) old-env)]
                                                    )
                                                  )
                                                )
                               )
                            (buscar-variable procnames lidss cuerpos old-env)
                            )
                          )
      
      )
    )
```

Modifico a evaluar-expresion para incluir el caso de letrec

```racket
(letrec-exp (procnames idss cuerpos cuerpo-letrec)
                  (evaluar-expresion cuerpo-letrec
                                     (ambiente-extendido-recursivo procnames idss cuerpos amb)))
      )
```

[2025-03-27-Note-07-49_annotated.pdf](2025-03-27-Note-07-49_annotated.pdf)

# Ejercicios

[2025-03-27-Note-07-492_annotated.pdf](2025-03-27-Note-07-492_annotated.pdf)

[ejercicio2_annotated.pdf](ejercicio2_annotated.pdf)

[2025-03-27-Note-07-492_annotated.pdf](2025-03-27-Note-07-492_annotated%201.pdf)