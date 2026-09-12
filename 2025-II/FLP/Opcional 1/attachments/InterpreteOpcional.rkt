#lang eopl
(define especificacion-lexica
  '(
    (espacio-blanco (whitespace) skip)
    (comentario ("%" (arbno (not #\newline))) skip)
    (identificador (letter (arbno (or letter digit "?" "$"))) symbol)
    (numero (digit (arbno digit)) number)
    (numero ("-" digit (arbno digit)) number)
    (numero (digit (arbno digit)"." digit (arbno digit)) number)
    (numero ("-" digit (arbno digit)"." digit (arbno digit)) number)
    )
  )


(define especificacion-gramatical
  '(
    (programa (expresion) a-program)
    (expresion (numero) lit-exp)
    (expresion (identificador) var-exp)
    ;;Agregamos la gramática de los condicionales y las ligaduras
    (expresion ("true") true-exp)
    (expresion ("false") false-exp)
    (expresion ("if" expresion "then" expresion "else" expresion) if-exp)
    ;;Ligaduras locales
    (expresion ("let" (arbno identificador "=" expresion) "in" expresion) let-exp)
    ;;Fin de condicionales y ligaduras
    ;;procedimientos
    (expresion ("proc" "(" (separated-list identificador ",") ")" expresion) proc-exp)
    (expresion ("(" expresion (arbno expresion) ")") app-exp)

    ;;fin procedimientos
    ;;procedimientos recursivos
    (expresion ("letrec" (arbno identificador "(" (separated-list identificador ",") ")" "=" expresion) "in" expresion) letrec-exp) 
    ;;fin de procedimientos recursivos

    ;;Examen opcional
    ;;*********************************
    (expresion ("set" "(" (separated-list expresion ",") ")") set-exp)
    ;;*********************************
    (expresion (primitiva "(" (separated-list expresion ",") ")") prim-exp)
    (primitiva ("+") sum-prim)
    (primitiva ("-") minus-prim)
    (primitiva ("*") mult-prim)
    (primitiva ("/") div-prim)
    (primitiva ("add1") add-prim)
    (primitiva ("sub1") sub-prim)
    ;;primitivas booleanas
    (primitiva (">") mayor-prim)
    (primitiva (">=") mayorigual-prim)
    (primitiva ("<") menor-prim)
    (primitiva ("<=") menorigual-prim)
    (primitiva ("==") igual-prim)
    ;;Primitivas set
    (primitiva ("union") union-prim)
    (primitiva ("contains") contains-prim)
    (primitiva ("intersection") intersection-prim)
    )
  )

;;Creamos los datatypes automaticamente
(sllgen:make-define-datatypes especificacion-lexica especificacion-gramatical)


;;Evaluar programa
(define evaluar-programa
  (lambda (pgm)
    (cases programa pgm
      (a-program (exp) (evaluar-expresion exp ambiente-inicial))
      ))
  )

;;ambientes
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

(define value?
  (lambda (v)
    #true))

(define apply-env
  (lambda (env var)
    (cases ambiente env
      (ambiente-vacio () (eopl:error "No se encuentra la variable " var))
      (ambiente-extendido (lid lval old-env)
                          (letrec
                              (
                               (buscar-variable (lambda (lid lval old-env)
                                                  (cond
                                                    [(null? lid) (apply-env old-env var)]
                                                    [(equal? (car lid) var) (car lval)]
                                                    [else
                                                     (buscar-variable (cdr lid) (cdr lval) old-env)]
                                                    )
                                                  )
                                                )
                               )
                            (buscar-variable lid lval old-env)
                            )
                          
                          )
      (ambiente-extendido-recursivo (procnames lidss cuerpos old-env)
                          (letrec
                              (
                               (buscar-variable (lambda (procnames lidss cuerpos old-env)
                                                  (cond
                                                    [(null? procnames) (apply-env old-env var)]
                                                    [(equal? (car procnames) var)
                                                     (closure
                                                      (car lidss)
                                                      (car cuerpos)
                                                      env)
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
  )

(define ambiente-inicial
  (ambiente-extendido '(x y z) '(4 2 5)
                      (ambiente-extendido '(a b c) '(4 5 6)
                                          (ambiente-vacio))))

;;Evaluar expresion
(define evaluar-expresion
  (lambda (exp amb)
    (cases expresion exp
      (lit-exp (dato) dato)
      (var-exp (id) (apply-env amb id))
      ;;Booleanos
      (true-exp () #true)
      (false-exp () #false)
      ;;Fin booleanos
      (prim-exp (prim args)
                (let
                    (
                     (lista-numeros (map (lambda (x) (evaluar-expresion x amb)) args))
                     )
                  (evaluar-primitiva prim lista-numeros)
                  )
                )
      ;;Condicionales
      (if-exp (condicion hace-verdadero hace-falso)
              (if
               (evaluar-expresion condicion amb) ;;Evaluamos la condición
               (evaluar-expresion hace-verdadero amb) ;;En caso de que sea verdadero
               (evaluar-expresion hace-falso amb) ;;En caso de que sea falso
               )
              )
      ;;Ligaduras locales
      (let-exp (ids rands body)
               (let
                   (
                    (lvalues (map (lambda (x) (evaluar-expresion x amb)) rands))
                    )
                 (evaluar-expresion body (ambiente-extendido ids lvalues amb))
                 )
               )
      ;;procedimientos
      (proc-exp (ids body)
                (closure ids body amb))
      (app-exp (rator rands)
               (let
                   (
                    (lrands (map (lambda (x) (evaluar-expresion x amb)) rands))
                    (procV (evaluar-expresion rator amb))
                    )
                 (if
                  (procval? procV)
                  (cases procval procV
                    (closure (lid body old-env)
                             (if (= (length lid) (length lrands))
                                 (evaluar-expresion body
                                                (ambiente-extendido lid lrands old-env))
                                 (eopl:error "El número de argumentos no es correcto, debe enviar" (length lid)  " y usted ha enviado" (length lrands))
                                 )
                             ))
                  (eopl:error "No puede evaluarse algo que no sea un procedimiento" procV) 
                  )
                 )
               )

      ;;letrec
      (letrec-exp (procnames idss cuerpos cuerpo-letrec)
                  (evaluar-expresion cuerpo-letrec
                                     (ambiente-extendido-recursivo procnames idss cuerpos amb)))
      ;;sets
      (set-exp (rands)
               (insert-sets (empty-set) (map (lambda (x) (evaluar-expresion x amb)) rands)))
      )

    )
  )

;;Manejo de primitivas
(define evaluar-primitiva
  (lambda (prim lval)
    (cases primitiva prim
      (sum-prim () (operacion-prim lval + 0))
      (minus-prim () (- (car lval) (operacion-prim (cdr lval) + 0)))
      (mult-prim () (operacion-prim lval * 1))
      (div-prim () (/ (car lval) (operacion-prim (cdr lval) * 1)))
      (add-prim () (+ (car lval) 1))
      (sub-prim () (- (car lval) 1))
      (mayor-prim () (> (car lval) (cadr lval)))
      (mayorigual-prim () (>= (car lval) (cadr lval)))
      (menor-prim () (< (car lval) (cadr lval)))
      (menorigual-prim () (<= (car lval) (cadr lval)))
      (igual-prim () (= (car lval) (cadr lval)))
      (union-prim () (union->sets lval))
      (contains-prim () (contains? (set->list (car lval)) (cadr lval)))
      (intersection-prim () (insert-sets (empty-set) (intersection->sets lval) ))
      )
    )
  )


(define operacion-prim
  (lambda (lval op term)
    (cond
      [(null? lval) term]
      [else
       (op
        (car lval)
        (operacion-prim (cdr lval) op term))
       ]
      )
    )
  )

;;Definiciones para los procedimientos
(define-datatype procval procval?
  (closure (lid (list-of symbol?))
           (body expresion?)
           (amb-creation ambiente?)))

;;Examen opcional
(define-datatype set set?
  (empty-set)
  (non-empty-set
   (value number?)
   (left set?)
   (right set?)
   ))

;;insert-set: set,number -> set
(define insert-set
  (lambda (s n)
    (cases set s
      (empty-set () (non-empty-set n (empty-set) (empty-set)))
      (non-empty-set (v l r)
                     (cond
                       ;;Si es mayor insertar a la derecha
                       [(> n v) (non-empty-set
                                 v
                                 l
                                 (insert-set r n))]
                       ;;Si es menor insertar a la izquierda
                       [(< n v)(non-empty-set
                                 v
                                 (insert-set l n)
                                 r)]

                       ;;Si es igual no hacer nada
                       [else s]
                       )
                     )
      )
    )
  )

;;insert-sets:  set,list of number -> set
(define insert-sets
  (lambda (s l)
    (cond
      [(null? l) s]
      [else
       (insert-sets (insert-set s (car l)) (cdr l))])))

;; Para trabajar los conjuntos es conveniente convertir a listas
;; Podemos hacerlo con recorrido preorden, inorden o posorden
;; Para conservar estructura usaremos preorden
;; set->list set -> lista de numeros
(define set->list
  (lambda (s)
    (cases set s
      (empty-set () '())
      (non-empty-set (v l r)
                     (append
                      (list v)
                      (set->list l)
                      (set->list r)
                      )
                     )
      )
    )
  )
;;Operaciones primitivas de lista

;;contains: list de numeros -> booleano
(define contains?
  (lambda (l v)
    (cond
      [(null? l) #F]
      [(= (car l) v) #T]
      [else
       (contains? (cdr l) v)])))

;;union->sets > list of set -> set
;; la idea es tomar los sets y transformarlo en listas de numeros
;; cuando se tenga el ultimo set, este se retorna
;; este va ser el set al que se le van a insertar los demas numeros
(define union->sets
  (lambda (lset)
    (cond
      [(null? (cdr lset)) (car lset)]
      [else
       (insert-sets (union->sets (cdr lset)) (set->list (car lset)))])))


;intersection->sets: list of sets -> set
;;Idea transformar a listas los set
;; Transformamos el primer conjunto a lista
;; Transformamos el resto a una lista de lista de numeros
;;Retornar lo que cumplan esa condición
(define intersection->sets
  (lambda (lset)
    (filtro-elementos (set->list (car lset))
                      (map set->list (cdr lset)))))


;;filtro-elementos: list of number, list of list of number -> list of number
(define filtro-elementos
  (lambda (lset llset)
    (cond
      [(null? lset) '()]
      [(is-in-all? (car lset) llset)
       (cons (car lset) (filtro-elementos (cdr lset) llset))]
      [else
       (filtro-elementos (cdr lset) llset)])))

;;is-in-all?: number, list of list number
;;Verifique que un numero esté en todas las listas
(define is-in-all?
  (lambda (n ll)
    (cond
      [(null? ll) #T]
      [(is-in? n (car ll)) (is-in-all? n (cdr ll))]
      [else #F])))

;;is-in? number, list of number
;;Verifica que un numero este en una lista
(define is-in?
  (lambda (n l)
    (cond
      [(null? l) #F]
      [(eqv? n (car l)) #T]
      [else (is-in? n (cdr l))])))


;;Interpretador
(define interpretador
  (sllgen:make-rep-loop "-->" evaluar-programa
                        (sllgen:make-stream-parser
                         especificacion-lexica especificacion-gramatical)))


(interpretador)