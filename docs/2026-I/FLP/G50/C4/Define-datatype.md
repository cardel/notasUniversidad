
Define-datatype permite
especificar un Arbol de Sintaxis
abstracta a partir una gramática
Es una representación de los
datos pertenecientes a una 
gramática

```scheme
#lang eopl
#|
<lc-exp> ::= <identifier>                            var-exp(id)
         ::= "lambda" "(" <identifier> ")" <lc-exp>  lambda-exp(id,exp)
         ::= "(" <lc-exp> <lc-exp> ")"               app-exp(rator, rand)
|#

(define-datatype lc-exp lc-exp?
  (var-exp (id symbol?))
  (lambda-exp (id symbol?)
              (exp lc-exp?))
  (app-exp (rator lc-exp?)
           (rand lc-exp?))
  )

(define exp1
  (lambda-exp 'x (var-exp 'y)))

;;occurs-free?
;;v ocurre libre
;;si var-exp si es igual al id
;;si lambda-exp diferente del id y ocurre libre en la exp
;;si app-exp occurre libre en uno o en el otro
(define occurs-free?
  (lambda (exp var)
    (cases lc-exp exp
      (var-exp (id) (eqv? var id))
      (lambda-exp (id exp)
        (and
         (not (eqv? var id))
         (occurs-free? exp var)))
      (app-exp (rator rand)
               (or
                (occurs-free? rator var)
                (occurs-free? rand var)
                )
               )
      )
    )
  )



```

Tener en cuenta

1. define-datatype tiene la siguiente estructura
```scheme
(define-datatype <nombre> <nombre-predicado>
   (nombre-variante
       (nombre-campo tipo)
   )
)
tipo: symbol?, <nombre-predicado>, number?, string?, etc (list-of <tipo>)
```

2. Se van a generar los procedimientos constructores (nombre-variantes)
3. El dato se trabaja con cases que hace reconocimiento de patrones
```scheme
   (cases <nombre-tipo> exp
      (nombre-variante (..<campos>...) ..<expresion>..)
      (else ...)
   )
```

## Ejemplo arbol binario

```scheme
#|
<bin-tree> ::= <int>    leaf(number)
           :: <symbol> <bin-tree> <bin-tree>   node(key, left, right)
|#


(define-datatype bin-tree bin-tree?
  (leaf (number number?))
  (node (key symbol?)
        (left bin-tree?)
        (right bin-tree?))
  )

(define tree1
  (node 'k
        (node 'p (leaf 2) (leaf 3))
        (node 'u (leaf 4) (leaf 5))))

;;tree->list of number
;;tree->list: bin-tree -> list of numbers
(define tree->list
  (lambda (tree)
    (cases bin-tree tree
      (leaf (number) (list number))
      (node (key l r)
            (append
             (tree->list l)
             (tree->list r))))))
```

## Ambientes

```scheme

;Ambientes
#|
<environment> ::= '()                                 empty-env()
              ::= <identifier>* <value>* environment  extend-env(lid lval old-env)
|#

(define-datatype enviroment environment?
  (empty-env)
  (extend-env
   (lid (list-of symbol?))
   (lval (list-of value?))
   (old-env environment?)))

;Un tipo generico, cualquier cosa que Racket acepte
(define value?
  (lambda (exp) #t))
```

En este caso usamos list of para representar listas de elementos, por ejemplo

```scheme
(define e
  (extend-env '(x y z) '(1 2 3)
              (extend-env '(a b c) '(4 5 6)
                          (empty-env))))

```

Para este caso ya podemos implementar la función apply-env

```scheme

;;apply-env: enviroment -> value
(define apply-env
  (lambda (env var)
    (cases enviroment env
      (empty-env () (eopl:error "No se encuentra la variable " var))
      (extend-env (lid lval old-env)
                  (letrec
                   (
                    ;;Buscar la var en lid, si esta retorna el valor correspondiente
                    ;;son listas variables, y si la lista esta vacia busca en el ambiente interno
                    (search-value
                     (lambda (lid lval)
                       (cond
                         [(null? lid) (apply-env old-env var)]
                         [(eqv? (car lid) var) (car lval)]
                         [else (search-value (cdr lid) (cdr lval))]
                         )
                       )
                     )
                    )
                   (search-value lid lval)
                   )
                  )
      )
    )
  )

```