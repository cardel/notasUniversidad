Hasta el momento hemos implementado un interpretador bajo el paradigma funcional, que toda computación tiene un valor y el programa se ejecuta a partir de las relaciones entre funciones.

Ahora vamos introducir el concepto en que una operación  puede introducir un efecto en la computación el cual es potencialmente global.

Para esto, vamos trabajar un unico efecto, asignación que permite gestionar ubicaciones en memoria.

- Ligadura: Es una acción local
```scheme
let
	x = 3
	y = 8
	in +(x,y)
```
- Ligadura crea una nueva asociación con un nombre mientras que la asignación cambia el valor de una ligudura existente
- La ligadura asocia nombres con valores, ambientes
```scheme
(define-datatype environment enviroment?
	(empty-env)
	(extend-env
		(lid (list-of symbol?)) ;;Nombres
		(lval (lisf-of value?)) ;;Valores
		(old-env environment?)
	)
)
```

Ahora vamos a introducir la capacidad de cambiar esos valores

1. Va a introducir una operación de efecto que es cambiar un ligadura, esta operación **no retorna un valor**
2. Dado que vamos a tener cambios de las variables, ahora el programa es gobernado por la **secuenciación** por el orden en que se realizan las operaciones

# Interprete

- Valores expresados: Numero + Booleanos + ProcVal
- Valores denorado : Ref(valor expresado)

```
<expression> ::= set <identifier> "="
<expression>  (set-exp)
			 ::= begin <expresion> (";" <expression>) "end" (begin-exp)
```

Esto nos va a permitir tener los dos elementos que requerimos.

# Begin

El begin evalua una serie de expresiones y nos retorna el último valor generado.

## Cambios en la gramática

```scheme
    (expression ("begin" expression (arbno ";" expression) "end") begin-exp)
```

Esto es una cerradura positiva, el begin siempre va a tener al menos una expresión.

```scheme
(define eval-expression
	;...
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
	;...
)
```

Este evalua las expresiones en el orden que tiene el begin, primero la expresion y luego ordenamente la lista, se asegura de retornar una última expresion

De acuerdo a esto podemos hacer expresiones como

```scheme
-->begin 1 end
1
-->begin 1;2;3;4 end
4
```

