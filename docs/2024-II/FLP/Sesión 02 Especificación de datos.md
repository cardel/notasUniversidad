# Sesión 02: Especificación de Datos y alcance

## Especificación datos

¿Porque especificamos datos?

1. Necesitamos una herramienta para comprobar que un tipo de dato es CORRECTO.
2. Para esto usamos las especificaciones RECURSIVAS
    1. Caso base
    2. Caso de construcción recursiva
3. Todo tipo de datos
    1. Podemos generar con la regla recursiva
    2. Y podemos verificarlo con la regla recursiva

---

## Especificación inductiva

¿Como trabaja?

1. Caso base que pertenece al conjunto por definicion
2. Implicación que nos permite construir los otros datos

$$
 2 \in S \\ n \in S \rightarrow n+2
$$

$$
'() \in S \\ n \in \mathbb{N} \wedge l \in S \rightarrow (n \ l) \in S
$$

$$
'() \in S \\\\ '() \in P \\ n \in \mathbb{N} \wedge p \in P \rightarrow (n p) \in P \\ s \in S \wedge p \in P \rightarrow (p s)
$$

S es una lista de listas de números y P es una lista de números

---

Ventajas y desventajas

### Ventajas

- Permite especificar datos usando reglas de implicación y pertenencia
- Es facil verificar que los datos son correctos
- Es fácil verificarlos

### Desventajas

- Es dificil definir datos con muchos casos base o muchos casos recursivos

---

## Especificación BNF

¿Como se realiza?

- Debe existir uno o más casos base, que son SIMBOLOS TERMINALES
- Se puede especificar los casos recursivos mediante reglas recursivas
- Podemos hacer relaciones entre diferentes reglas

```racket
<list-ss> ::= '()
					::= <list-s> <list-ss>
					
<list-s>  ::= <symbol>
					::= <symbol> <list-s>
					
'(a (a b c) a)
				
```

---

Ventajas y desventajas

- Mayor facilidad en representación de los datos recursivos
- No sirve para datos que no son RECURSIVOS
- Se pueden tener varios casos base, varias reglas recursivas más facilmente

---

## Alcance de variables

¿A que se refiere?

A como puedo alcanzar (acceder) a los valores que están en las variables

---

let ← Ligadura local funcional

```racket
(let
   (
    .... variables
   )
   ... expresion
 )
```

```racket
(let
  (
    (a 1) (b 2) (c 3) (d 4)
   )
   (let
      (
        (a a) (b b) (c c) (d d)
       )
       (+ a b c d)
    )
  )
```

```racket
(let
  (
    (a 1) (b 2) (c 3) (d 4)
   )
   (let
      (
        (a d) (b a) (c b) (d a)
       )
       (+ (* 2 a) (* 3 b)  (* 4 c) (* 5 d))
    )
  )
```

---

let* ligadura local imperativa

- Reconoce los valores creados inmediatemente antes

```racket
(let
  (
    (a 1) (b 2) (c 3) (d 4)
   )
   (let*
      (
        (a d) (b a) (c b) (d a)
       )
       (+ (* 2 a) (* 3 b)  (* 4 c) (* 5 d))
    )
  )
```

---

letrec

```racket
(letrec
	(
	 (x (lambda (a b) (if (> a 0) (+ b (x (- a 1) b))
	                      b)
	     )
	  )
	 )
	 (x 10 2)
)
```

---

## Ligadura de variables

## Expresion en calculo $\lambda$

```racket
<expression> ::= <identificador>        ;;(var-exp)
             ::= "lambda" "(" <identificador> ")" <expression>   ;;(lambda-exp)
             :: "(" <expression> <expression>   ")"    ;;(app-exp)
```

## Reglas de ligadura

1. Si e es una expresión tipo <var-exp>, si es e igual a x entonces x ocurre LIBRE
2. Si e es una expresión tipo <lambda-exp>  si x es diferente del <identificador> y ocurre libre en la expresion interna, entonces es libre
3. Si e a una expresión tipo <app-exp> (e1 e2) de ocurrir libre en e1 O en e2

¿x ocurre libre?

1. x  —> Si ocurre libre
2. lambda (a) (x y)  —> Ocurre libre
3. lambda (x) (x y) —> Ocurre ligado / no ocurre libre
4. (x lambda (x) (x y)) → Ocurre libre
5. (lambda (x) x  lambda (x) (x y)) —> No ocurre libre
6. lambda (a) (lambda (x) a) x) —> Ocurre libre
7. (lambda (x) (lambda (a) x)  x))