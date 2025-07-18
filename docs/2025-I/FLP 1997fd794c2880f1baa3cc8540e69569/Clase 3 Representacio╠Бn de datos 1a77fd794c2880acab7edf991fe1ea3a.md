# Clase 3: Representación de datos

[Notas1_annotated.pdf](Clase%203%20Representacio%CC%81n%20de%20datos%201a77fd794c2880acab7edf991fe1ea3a/Notas1_annotated.pdf)

# Ejemplos de representación

[ejemplo.cpp](Clase%203%20Representacio%CC%81n%20de%20datos%201a77fd794c2880acab7edf991fe1ea3a/ejemplo.cpp)

[ejemplo.py](Clase%203%20Representacio%CC%81n%20de%20datos%201a77fd794c2880acab7edf991fe1ea3a/ejemplo.py)

# Ejemplos de TAD en Racket

## Basado en listas

```racket
#lang eopl
#|
<arbol> ::=   '()
            arbol-vacio()
        ::= <int> <arbol> <arbol>
            arbol-int(k, hiz, hder)
        ::= <symbol> <arbol> <arbol>
            arbol-symbol(k, hizq, hder)
|#

;;Procedimientos constructores
(define arbol-vacio (lambda () (list 'arbol-vacio)))
(define arbol-int (lambda (k hiz hder) (list 'arbol-int k hiz hder)))
(define arbol-symbol (lambda (k hiz hder) (list 'arbol-symbol k hiz hder)))

;;Observadores
;;Predicados
(define arbol-vacio? (lambda (arb) (eqv? (car arb) 'arbol-vacio)))
(define arbol-int? (lambda (arb) (eqv? (car arb) 'arbol-int)))
(define arbol-symbol? (lambda (arb) (eqv? (car arb) 'arbol-symbol)))

;;Extractores
(define arbol-int->k (lambda (arb) (cadr arb)))
(define arbol-int->hizq (lambda (arb) (caddr arb)))
(define arbol-int->hder (lambda (arb) (cadddr arb)))
(define arbol-symbol->k (lambda (arb) (cadr arb)))
(define arbol-symbol->hizq (lambda (arb) (caddr arb)))
(define arbol-symbol->hder (lambda (arb) (cadddr arb)))

;;Area del programador
(define arbol1
  (arbol-int 5
             (arbol-symbol 'k
                           (arbol-int 8 (arbol-vacio) (arbol-vacio))
                           (arbol-int 9
                                      (arbol-symbol 's (arbol-vacio) (arbol-vacio))
                                      (arbol-vacio)
                                      )
                           )
             (arbol-int 6
                        (arbol-symbol 'p (arbol-vacio) (arbol-vacio))
                        (arbol-symbol 's (arbol-vacio) (arbol-vacio))
                        )
             )
  )

;;Sume los valores de un arbol
;;arbol->valor: arbol -> numero
(define arbol->valor
  (lambda (arb)
    (cond
      [(arbol-vacio? arb) 0]
      [(arbol-int? arb)
       (+
        (arbol-int->k arb)
        (arbol->valor (arbol-int->hizq arb))
        (arbol->valor (arbol-int->hder arb)))]
      [(arbol-symbol? arb)
       (+
        (arbol->valor (arbol-int->hizq arb))
        (arbol->valor (arbol-int->hder arb)))]
      [else (eopl:error "Tipo de dato no es un árbol")])))

(display (arbol->valor arbol1))

```

## Basado en procedimientos

```racket
#lang eopl
#|
<arbol> ::=   '()
            arbol-vacio()
        ::= <int> <arbol> <arbol>
            arbol-int(k, hiz, hder)
        ::= <symbol> <arbol> <arbol>
            arbol-symbol(k, hizq, hder)
|#

;;Procedimientos constructores
(define arbol-vacio (lambda ()
                      (lambda (s)
                        (cond
                          [(= s 1) 'arbol-vacio]
                          [else (eopl:error "Operacion no válida con arbol-vacio")]))))
(define arbol-int (lambda (k hiz hder)
                    (lambda (s)
                      (cond
                        [(= s 1) 'arbol-int]
                        [(= s 2) k]
                        [(= s 3) hiz]
                        [(= s 4) hder]))))
(define arbol-symbol (lambda (k hiz hder)
                       (lambda (s)
                         (cond
                           [(= s 1) 'arbol-symbol]
                           [(= s 2) k]
                           [(= s 3) hiz]
                           [(= s 4) hder]))))

;;Observadores
;;Predicados
(define arbol-vacio? (lambda (arb) (eqv? (arb 1) 'arbol-vacio)))
(define arbol-int? (lambda (arb) (eqv? (arb 1) 'arbol-int)))
(define arbol-symbol? (lambda (arb) (eqv? (arb 1) 'arbol-symbol)))

;;Extractores
(define arbol-int->k (lambda (arb) (arb 2)))
(define arbol-int->hizq (lambda (arb) (arb 3)))
(define arbol-int->hder (lambda (arb) (arb 4)))
(define arbol-symbol->k (lambda (arb) (arb 2)))
(define arbol-symbol->hizq (lambda (arb) (arb 3)))
(define arbol-symbol->hder (lambda (arb) (arb 4)))

;;Area del programador
(define arbol1
  (arbol-int 5
             (arbol-symbol 'k
                           (arbol-int 8 (arbol-vacio) (arbol-vacio))
                           (arbol-int 9
                                      (arbol-symbol 's (arbol-vacio) (arbol-vacio))
                                      (arbol-vacio)
                                      )
                           )
             (arbol-int 6
                        (arbol-symbol 'p (arbol-vacio) (arbol-vacio))
                        (arbol-symbol 's (arbol-vacio) (arbol-vacio))
                        )
             )
  )

;;Sume los valores de un arbol
;;arbol->valor: arbol -> numero
(define arbol->valor
  (lambda (arb)
    (cond
      [(arbol-vacio? arb) 0]
      [(arbol-int? arb)
       (+
        (arbol-int->k arb)
        (arbol->valor (arbol-int->hizq arb))
        (arbol->valor (arbol-int->hder arb)))]
      [(arbol-symbol? arb)
       (+
        (arbol->valor (arbol-int->hizq arb))
        (arbol->valor (arbol-int->hder arb)))]
      [else (eopl:error "Tipo de dato no es un árbol")])))

(display (arbol->valor arbol1))

```

## Ejemplo de ambientes

¿Que es un ambiente?

- Es una estructura para almacenar ligaduras y sus valores
- Nos sirve para buscar los valores de las ligaduras

```racket
#lang eopl
#|
<env> ::= <empty-env>
          empty-env()
      :: <extend-env>
          extend-env(li,lv,old-env)
|#

;;Contructores
(define empty-env (lambda () (list 'empty-env)))
(define extend-env (lambda (li lv old-env)
                     (list 'extend-env li lv old-env)))

;;Predicados
(define empty-env? (lambda (env) (eqv? (car env) 'empty-env)))
(define extend-env? (lambda (env) (eqv? (car env) 'extend-env)))

;;Extractores
(define extend-env->li
  (lambda (env) (cadr env)))

(define extend-env->lv
  (lambda (env) (caddr env)))

(define extend-env->old-env
  (lambda (env) (cadddr env)))

;;Area del programador
(define e
  (extend-env
   '(x y z)
   '(1 2 3)
   (extend-env
    '(a b c)
    '(4 5 6)
    (empty-env))))

(define apply-env-aux
  (lambda (li lv x)
    (cond
      [(null? li) #F]
      [(eqv? (car li) x) (car lv)]
      [else (apply-env-aux (cdr li) (cdr lv) x)])))

(define apply-env
  (lambda (env x)
    (cond
      [(empty-env? env) (eopl:error "No se encuentra" x)]
      [(extend-env? env)
       (let
           (
            (li (extend-env->li env))
            (lv (extend-env->lv env))
            (old-env (extend-env->old-env env))
            )
         (if
          (not (number? (apply-env-aux li lv x)))
          (apply-env old-env x) ;;Siga buscando
          (apply-env-aux li lv x) ;;Devuelva el valor
          ))])))
          
```

```racket
#lang eopl

#|
<env> ::= <empty-env>
          empty-env()
      :: <extend-env>
          extend-env(li,lv,old-env)
|#

;;Contructores
(define empty-env (lambda ()
                    (lambda (s)
                      (cond
                        [(= s 1) 'empty-env]
                        [else (eopl:error "Señal no valida en empty-env")]))))
(define extend-env (lambda (li lv old-env)
                     (lambda (s)
                       (cond
                         [(= s 1) 'extend-env]
                         [(= s 2) li]
                         [(= s 3) lv]
                         [(= s 4) old-env]
                         [else (eopl:error "Señal no valida en extend-env")]
                         ))))

;;Predicados
(define empty-env? (lambda (env) (eqv? (env 1) 'empty-env)))
(define extend-env? (lambda (env) (eqv? (env 1) 'extend-env)))

;;Extractores
(define extend-env->li
  (lambda (env) (env 2)))

(define extend-env->lv
  (lambda (env) (env 3)))

(define extend-env->old-env
  (lambda (env) (env 4)))

;;Area del programador
(define e
  (extend-env
   '(x y z)
   '(1 2 3)
   (extend-env
    '(a b c)
    '(4 5 6)
    (empty-env))))

(define apply-env-aux
  (lambda (li lv x)
    (cond
      [(null? li) #F]
      [(eqv? (car li) x) (car lv)]
      [else (apply-env-aux (cdr li) (cdr lv) x)])))

(define apply-env
  (lambda (env x)
    (cond
      [(empty-env? env) e(eopl:error "No se encuentra" x)]
      [(extend-env? env)
       (let
           (
            (li (extend-env->li env))
            (lv (extend-env->lv env))
            (old-env (extend-env->old-env env))
            )
         (if
          (not (number? (apply-env-aux li lv x)))
          (apply-env old-env x) ;;Siga buscando
          (apply-env-aux li lv x) ;;Devuelva el valor
          ))])))
          
```

# Ejercicios

[Ejercicios_annotated.pdf](Clase%203%20Representacio%CC%81n%20de%20datos%201a77fd794c2880acab7edf991fe1ea3a/Ejercicios_annotated.pdf)

```racket
#lang eopl
#|
Ejercicio 1

<registro> ::= '()
               empty-reg()
           ::= <symbol> <dato>
               non-empty-reg(key, d)

<dato> ::= <int>
          dato-int(d)
       ::= <symbol>
          dato-symbol(d)
       ::= <dato> <symbol>
          dato-rec(d, s)
|#

;;Contructores
(define empty-reg
  (lambda () (list 'empty-reg)))

(define non-empty-reg
  (lambda (k d) (list 'non-empty-reg k d)))

(define dato-int
  (lambda (d) (list 'dato-int d)))

(define dato-symbol
  (lambda (s) (list 'dato-symbol s)))

(define dato-rec
  (lambda (d s) (list 'dato-rec d s)))

;;Predicados
(define empty-reg?
  (lambda (reg) (eqv? (car reg) 'empty-reg)))

(define non-empty-reg?
  (lambda (reg) (eqv? (car reg) 'non-empty-reg)))

(define dato-int?
  (lambda (dat) (eqv? (car dat) 'dato-int)))

(define dato-symbol?
  (lambda (dat) (eqv? (car dat) 'dato-symbol)))

(define dato-rec?
  (lambda (dat) (eqv? (car dat) 'dato-rec)))

;;Extractores

(define non-empty-reg->k
  (lambda (reg) (cadr reg)))

(define non-empty-reg->d
  (lambda (reg) (caddr reg)))

(define dato-int->d
  (lambda (dat) (cadr dat)))

(define dato-symbol->s
  (lambda (dat) (cadr dat)))

(define dato-rec->d
  (lambda (dat) (cadr dat)))

(define dato-rec->s
  (lambda (dat) (caddr dat)))

;;Area programador
(define reg1
  (non-empty-reg 'k
                 (dato-rec (dato-rec (dato-int 5) 'p) 'k)))

;;reg->number: registro -> numero
(define reg->number
  (lambda (reg)
    (cond
      [(empty-reg? reg) 0]
      [(non-empty-reg? reg)
       (dato->number (non-empty-reg->d reg))]
      [else
       (eopl:error "Estructura no es un registro")])))

;;dato->number: dato -> number
(define dato->number
  (lambda (d)
    (cond
      [(dato-int? d) (dato-int->d d)]
      [(dato-symbol? d) 0]
      [(dato-rec? d)
       (dato->number (dato-rec->d d))]
      [else (eopl:error "La estructura no es un tipo dato")])))

;;register->symbol: registro -> list of symbol
(define register->symbol
  (lambda (reg)
    (cond
      [(empty-reg? reg) '()]
      [(non-empty-reg? reg)
       (append
        (list (non-empty-reg->k reg))
        (dato->symbol (non-empty-reg->d reg)))])))

;;dato->symbol: dato -> list of symbol
(define dato->symbol
  (lambda (d)
    (cond
      [(dato-int? d) '()]
      [(dato-symbol? d) (list (dato-symbol->s d))]
      [(dato-rec? d)
       (append
        (list (dato-rec->s d))
        (dato->symbol (dato-rec->d d)))]
      [else (eopl:error "La estructura no es un tipo dato")])))

```

```racket
#lang eopl
#|
Ejercicio 1

<registro> ::= '()
               empty-reg()
           ::= <symbol> <dato>
               non-empty-reg(key, d)

<dato> ::= <int>
          dato-int(d)
       ::= <symbol>
          dato-symbol(d)
       ::= <dato> <symbol>
          dato-rec(d, s)
|#

;;Contructores
(define empty-reg
  (lambda ()
    (lambda (s)
      (cond
        [(= s 1)'empty-reg]
        [else (eopl:error "Error en empty-reg")]))))

(define non-empty-reg
  (lambda (k d)
    (lambda (s)
      (cond
        [(= s 1)'non-empty-reg]
        [(= s 2) k]
        [(= s 3) d]
        [else (eopl:error "Error en non-empty-reg")]
        ))))

(define dato-int
  (lambda (d)
    (lambda (s)
      (cond
        [(= s 1)'dato-int]
        [(= s 2) d]
        [else (eopl:error "Error en dato-int")]))))

(define dato-symbol
  (lambda (s)
    (lambda (sgn)
      (cond
        [(= 1 sgn) 'dato-symbol]
        [(= 2 sgn) s]
        [else (eopl:error "Error en dato-symbol")]
        ))))

(define dato-rec
  (lambda (d s)
    (lambda (sgn)
      (cond
        [(= sgn 1) 'dato-rec]
        [(= sgn 2) d]
        [(= sgn 3) s]
        [else (eopl:error "Error en dato-rec")]
        ))))

;;Predicados
(define empty-reg?
  (lambda (reg) (eqv? (reg 1) 'empty-reg)))

(define non-empty-reg?
  (lambda (reg) (eqv? (reg 1) 'non-empty-reg)))

(define dato-int?
  (lambda (dat) (eqv? (dat 1) 'dato-int)))

(define dato-symbol?
  (lambda (dat) (eqv? (dat 1) 'dato-symbol)))

(define dato-rec?
  (lambda (dat) (eqv? (dat 1) 'dato-rec)))

;;Extractores

(define non-empty-reg->k
  (lambda (reg) (reg 2)))

(define non-empty-reg->d
  (lambda (reg) (reg 3)))

(define dato-int->d
  (lambda (dat) (dat 2)))

(define dato-symbol->s
  (lambda (dat) (dat 2)))

(define dato-rec->d
  (lambda (dat) (dat 2)))

(define dato-rec->s
  (lambda (dat) (dat 3)))

;;Area programador
(define reg1
  (non-empty-reg 'k
                 (dato-rec (dato-rec (dato-int 5) 'p) 'k)))

;;reg->number: registro -> numero
(define reg->number
  (lambda (reg)
    (cond
      [(empty-reg? reg) 0]
      [(non-empty-reg? reg)
       (dato->number (non-empty-reg->d reg))]
      [else
       (eopl:error "Estructura no es un registro")])))

;;dato->number: dato -> number
(define dato->number
  (lambda (d)
    (cond
      [(dato-int? d) (dato-int->d d)]
      [(dato-symbol? d) 0]
      [(dato-rec? d)
       (dato->number (dato-rec->d d))]
      [else (eopl:error "La estructura no es un tipo dato")])))

;;register->symbol: registro -> list of symbol
(define register->symbol
  (lambda (reg)
    (cond
      [(empty-reg? reg) '()]
      [(non-empty-reg? reg)
       (append
        (list (non-empty-reg->k reg))
        (dato->symbol (non-empty-reg->d reg)))])))

;;dato->symbol: dato -> list of symbol
(define dato->symbol
  (lambda (d)
    (cond
      [(dato-int? d) '()]
      [(dato-symbol? d) (list (dato-symbol->s d))]
      [(dato-rec? d)
       (append
        (list (dato-rec->s d))
        (dato->symbol (dato-rec->d d)))]
      [else (eopl:error "La estructura no es un tipo dato")])))

```

```racket
#lang eopl
#|
<arbol-c> ::= <int>
              arbol-c-int(d)
          ::= <symbol>
              arbol-c-symbol(s)
          ::= <int> <arbol-c> <arbol-c> <arbol-c>
              arbol-c-nodo(k, h1, h2, h3)

1. Interfaz
2. Sume los valores numericos
3. Lista de simbolos
4. Lista de números
|#

(define arbol-c-int
  (lambda (d) (list 'arbol-c-int d)))

(define arbol-c-symbol
  (lambda (s) (list 'arbol-c-symbol s)))

(define arbol-c-nodo
  (lambda (k h1 h2 h3)
    (list 'arbol-c-nodo k h1 h2 h3)))

;;Observadores

;;Predicados

(define arbol-c-int?
  (lambda (arb) (eqv? 'arbol-c-int (car arb))))

(define arbol-c-symbol?
  (lambda (arb) (eqv? 'arbol-c-symbol (car arb))))

(define arbol-c-nodo?
  (lambda (arb)
    (eqv? 'arbol-c-nodo (car arb))))

;;Extractores
(define arbol-c-int->d
  (lambda (arb) (cadr arb)))

(define arbol-c-symbol->s
  (lambda (arb) (cadr arb)))

(define arbol-c-nodo->k
  (lambda (arb)
    (cadr arb)))

(define arbol-c-nodo->h1
  (lambda (arb)
    (caddr arb)))

(define arbol-c-nodo->h2
  (lambda (arb)
    (cadddr arb)))

(define arbol-c-nodo->h3
  (lambda (arb)
    (car (cddddr arb))))

;;Area del programador
;;arb->number: arbol-c => number
(define arb->number
  (lambda (arb)
    (cond
      [(arbol-c-int? arb) (arbol-c-int->d arb)]
      [(arbol-c-symbol? arb) 0]
      [(arbol-c-nodo? arb)
       (+
        (arbol-c-nodo->k arb)
        (arb->number (arbol-c-nodo->h1 arb))
        (arb->number (arbol-c-nodo->h2 arb))
        (arb->number (arbol-c-nodo->h3 arb)))])))

(define arbolmortal
  (arbol-c-nodo
   5
   (arbol-c-nodo
    7
    (arbol-c-int 8)
    (arbol-c-symbol 'p)
    (arbol-c-symbol 'k))
   (arbol-c-nodo
    5
    (arbol-c-symbol 'p)
    (arbol-c-int 5)
    (arbol-c-int 6))
   (arbol-c-int 10)))

;;arb->lsymbol: arbol-c => list of symbol
(define arb->lsymbol
  (lambda (arb)
    (cond
      [(arbol-c-int? arb) '()]
      [(arbol-c-symbol? arb) (list (arbol-c-symbol->s arb))]
      [(arbol-c-nodo? arb)
       (append
        (arb->lsymbol (arbol-c-nodo->h1 arb))
        (arb->lsymbol (arbol-c-nodo->h2 arb))
        (arb->lsymbol (arbol-c-nodo->h3 arb)))])))

;;arb->lsymbol: arbol-c => list of symbol
(define arb->lnumber
  (lambda (arb)
    (cond
      [(arbol-c-int? arb) (list (arbol-c-int->d arb))]
      [(arbol-c-symbol? arb) '()]
      [(arbol-c-nodo? arb)
       (append
        (list (arbol-c-nodo->k arb))
        (arb->lnumber (arbol-c-nodo->h1 arb))
        (arb->lnumber (arbol-c-nodo->h2 arb))
        (arb->lnumber (arbol-c-nodo->h3 arb)))])))

(display (arb->number arbolmortal))
(display "\n")
(display (arb->lsymbol arbolmortal))
(display "\n")
(display (arb->lnumber arbolmortal))
```

```racket
#lang eopl
#|
<arbol-c> ::= <int>
              arbol-c-int(d)
          ::= <symbol>
              arbol-c-symbol(s)
          ::= <int> <arbol-c> <arbol-c> <arbol-c>
              arbol-c-nodo(k, h1, h2, h3)

1. Interfaz
2. Sume los valores numericos
3. Lista de simbolos
4. Lista de números
|#

(define arbol-c-int
  (lambda (d) (lambda (s)
                (cond
                  [(= s 1) 'arbol-c-int]
                  [(= s 2) d]
                  [else (eopl:error "Error en arbol-c-int")]
                  ))))

(define arbol-c-symbol
  (lambda (s)
    (lambda (sgn)
      (cond
        [(= sgn 1) 'arbol-c-symbol]
        [(= sgn 2) s]
        [else (eopl:error "Error en arbol-c-symbol")]
        ))))

(define arbol-c-nodo
  (lambda (k h1 h2 h3)
    (lambda (s)
      (cond
        [(= s 1) 'arbol-c-nodo]
        [(= s 2) k]
        [(= s 3) h1]
        [(= s 4) h2]
        [(= s 5) h3]
        [else (eopl:error "Error en arbol-c-nodo")]
        ))))

;;Observadores

;;Predicados

(define arbol-c-int?
  (lambda (arb) (eqv? 'arbol-c-int (arb 1))))

(define arbol-c-symbol?
  (lambda (arb) (eqv? 'arbol-c-symbol (arb 1))))

(define arbol-c-nodo?
  (lambda (arb)
    (eqv? 'arbol-c-nodo (arb 1))))

;;Extractores
(define arbol-c-int->d
  (lambda (arb) (arb 2)))

(define arbol-c-symbol->s
  (lambda (arb) (arb 2)))

(define arbol-c-nodo->k
  (lambda (arb)
    (arb 2)))

(define arbol-c-nodo->h1
  (lambda (arb)
    (arb 3)))

(define arbol-c-nodo->h2
  (lambda (arb)
    (arb 4)))

(define arbol-c-nodo->h3
  (lambda (arb)
    (arb 5)))

;;Area del programador
;;arb->number: arbol-c => number
(define arb->number
  (lambda (arb)
    (cond
      [(arbol-c-int? arb) (arbol-c-int->d arb)]
      [(arbol-c-symbol? arb) 0]
      [(arbol-c-nodo? arb)
       (+
        (arbol-c-nodo->k arb)
        (arb->number (arbol-c-nodo->h1 arb))
        (arb->number (arbol-c-nodo->h2 arb))
        (arb->number (arbol-c-nodo->h3 arb)))])))

(define arbolmortal
  (arbol-c-nodo
   5
   (arbol-c-nodo
    7
    (arbol-c-int 8)
    (arbol-c-symbol 'p)
    (arbol-c-symbol 'k))
   (arbol-c-nodo
    5
    (arbol-c-symbol 'p)
    (arbol-c-int 5)
    (arbol-c-int 6))
   (arbol-c-int 10)))

;;arb->lsymbol: arbol-c => list of symbol
(define arb->lsymbol
  (lambda (arb)
    (cond
      [(arbol-c-int? arb) '()]
      [(arbol-c-symbol? arb) (list (arbol-c-symbol->s arb))]
      [(arbol-c-nodo? arb)
       (append
        (arb->lsymbol (arbol-c-nodo->h1 arb))
        (arb->lsymbol (arbol-c-nodo->h2 arb))
        (arb->lsymbol (arbol-c-nodo->h3 arb)))])))

;;arb->lsymbol: arbol-c => list of symbol
(define arb->lnumber
  (lambda (arb)
    (cond
      [(arbol-c-int? arb) (list (arbol-c-int->d arb))]
      [(arbol-c-symbol? arb) '()]
      [(arbol-c-nodo? arb)
       (append
        (list (arbol-c-nodo->k arb))
        (arb->lnumber (arbol-c-nodo->h1 arb))
        (arb->lnumber (arbol-c-nodo->h2 arb))
        (arb->lnumber (arbol-c-nodo->h3 arb)))])))

(display (arb->number arbolmortal))
(display "\n")
(display (arb->lsymbol arbolmortal))
(display "\n")
(display (arb->lnumber arbolmortal))

```