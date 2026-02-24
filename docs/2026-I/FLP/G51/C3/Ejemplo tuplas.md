# Ejemplo tuplas

Una lista de tuplas tiene esta gramática:

```ebnf
<lst-tupla> ::= '()             empty-list()
            ::= <tupla> <lst-tupla> 
                non-empty-list(tu, lst)

<tupla> ::= <int> <int>    a-tuple(a,b)
```

**Función suma**: que retorna la suma de todos los elementos de las tuplas en la lista.

## Solución con listas

```scheme
#lang eopl
;; Tuplas

;; Constructor de tuplas
(define a-tuple
  (lambda (a b)
    (list 'a-tuple a b)))  ;; Representa una tupla como lista etiquetada: (a-tuple a b)

;; Observadores para tuplas
(define a-tuple?
  (lambda (t)
    (eqv? 'a-tuple (car t))))  ;; Verifica si es una tupla (primer elemento es 'a-tuple)

(define a-tuple->a
  (lambda (t)
    (cadr t)))  ;; Extrae el primer elemento de la tupla

(define a-tuple->b
  (lambda (t)
    (caddr t)))  ;; Extrae el segundo elemento de la tupla

;; Lista de tuplas - Constructores
(define empty-list
  (lambda ()
    (list 'empty-list)))  ;; Lista vacía etiquetada

(define non-empty-list
  (lambda (t lst)
    (list 'non-empty-list t lst)))  ;; Lista no vacía: etiqueta, tupla, resto

;; Observadores para listas
(define empty-list?
  (lambda (t)
    (equal? 'empty-list (car t))))  ;; Verifica si es lista vacía

(define non-empty-list?
  (lambda (t)
    (equal? 'non-empty-list (car t))))  ;; Verifica si es lista no vacía

(define non-empty-list->t
  (lambda (t)
    (cadr t)))  ;; Extrae la primera tupla de la lista

(define non-empty-list->lst
  (lambda (t)
    (caddr t)))  ;; Extrae el resto de la lista

;;; Área del programador

;; Ejemplo: lista de tuplas [(1,2), (4,5), (9,10)]
(define lst1
  (non-empty-list
   (a-tuple 1 2)
   (non-empty-list
    (a-tuple 4 5)
    (non-empty-list
     (a-tuple 9 10)
     (empty-list)
     )
    )
   )
  )

;; Función para sumar todos los elementos de las tuplas en la lista
(define sumar
  (lambda (lst)
    (cond
      [(empty-list? lst) 0]  ;; Caso base: lista vacía, suma 0
      [(non-empty-list? lst)
       (+
        (a-tuple->a (non-empty-list->t lst))  ;; Primer elemento de la tupla actual
        (a-tuple->b (non-empty-list->t lst))  ;; Segundo elemento de la tupla actual
        (sumar (non-empty-list->lst lst))     ;; Suma recursiva del resto
        )
       ]
      [else (eopl:error "No es una lista de tuplas")]  ;; Error si no es lista válida
      )
    )
  )

;; Prueba: suma = 1+2 + 4+5 + 9+10 = 31
(newline)
(display (sumar lst1))  ;; Resultado: 31
```

## Solución con procedimientos

```scheme
#lang eopl
;; Tuplas

;; Constructor de tuplas usando procedimientos
(define a-tuple
  (lambda (a b)
    (lambda (s)  ;; Procedimiento que representa una tupla
      (cond
        [(= s 0) 'a-tuple]  ;; Selector 0: tipo de dato
        [(= s 1) a]         ;; Selector 1: primer elemento
        [(= s 2) b]         ;; Selector 2: segundo elemento
        [else (eopl:error "Error en a-tuple")]  ;; Selector inválido
        )
      )
    )
  )

;; Observadores para tuplas
(define a-tuple?
  (lambda (t)
    (eqv? 'a-tuple (t 0))))  ;; Llama con selector 0 para obtener tipo

(define a-tuple->a
  (lambda (t)
    (t 1)))  ;; Selector 1 para primer elemento

(define a-tuple->b
  (lambda (t)
    (t 2)))  ;; Selector 2 para segundo elemento

;; Lista de tuplas - Constructores con procedimientos
(define empty-list
  (lambda ()
    (lambda (s)  ;; Procedimiento que representa lista vacía
      (cond
        [(= s 0) 'empty-list]  ;; Selector 0: tipo
        [else (eopl:error "Error en empty-list")]  ;; Selector inválido
        )
      )
    )
  )

(define non-empty-list
  (lambda (t lst)
    (lambda (s)  ;; Procedimiento que representa lista no vacía
      (cond
        [(= s 0) 'non-empty-list]  ;; Selector 0: tipo
        [(= s 1) t]                 ;; Selector 1: primera tupla
        [(= s 2) lst]               ;; Selector 2: resto de la lista
        [else (eopl:error "Error en non-empty-list")]  ;; Selector inválido
        )
      )
    )
  )

;; Observadores para listas
(define empty-list?
  (lambda (t)
    (equal? 'empty-list (t 0))))  ;; Verifica tipo con selector 0

(define non-empty-list?
  (lambda (t)
    (equal? 'non-empty-list (t 0))))  ;; Verifica tipo con selector 0

(define non-empty-list->t
  (lambda (t)
    (t 1)))  ;; Selector 1 para obtener primera tupla

(define non-empty-list->lst
  (lambda (t)
    (t 2)))  ;; Selector 2 para obtener resto

;;; Área del programador

;; Misma lista de ejemplo: [(1,2), (4,5), (9,10)]
(define lst1
  (non-empty-list
   (a-tuple 1 2)
   (non-empty-list
    (a-tuple 4 5)
    (non-empty-list
     (a-tuple 9 10)
     (empty-list)
     )
    )
   )
  )

;; Misma función sumar (idéntica interfaz)
(define sumar
  (lambda (lst)
    (cond
      [(empty-list? lst) 0]  ;; Caso base
      [(non-empty-list? lst)
       (+
        (a-tuple->a (non-empty-list->t lst))  ;; Primer elemento de tupla actual
        (a-tuple->b (non-empty-list->t lst))  ;; Segundo elemento de tupla actual
        (sumar (non-empty-list->lst lst))     ;; Recursión sobre resto
        )
       ]
      [else (eopl:error "No es una lista de tuplas")]  ;; Error
      )
    )
  )

;; Prueba (mismo resultado: 31)
(newline)
(display (sumar lst1))
```

# Tabla de resumen

| Concepto | Descripción | Ejemplo/Implementación |
|----------|-------------|------------------------|
| **Tupla** | Estructura de datos que agrupa un número fijo de elementos, posiblemente de diferentes tipos. | Par ordenado `(a, b)`. |
| **Lista de tuplas** | Secuencia de tuplas, posiblemente vacía. | `[(1,2), (4,5), (9,10)]`. |
| **TAD (Tipo Abstracto de Dato)** | Definición de un tipo mediante su interfaz (operaciones) separada de su implementación. | Tuplas y listas como TADs. |
| **Constructores** | Funciones que crean instancias del TAD. | `a-tuple`, `empty-list`, `non-empty-list`. |
| **Observadores** | Funciones que inspeccionan el TAD sin modificarlo. | Predicados y extractores. |
| **Predicados** | Observadores que verifican el tipo de dato. | `a-tuple?`, `empty-list?`, `non-empty-list?`. |
| **Extractores** | Observadores que obtienen componentes del dato. | `a-tuple->a`, `a-tuple->b`, `non-empty-list->t`, etc. |
| **Representación con listas** | Implementación usando listas de Scheme con etiquetas. | `(list 'a-tuple a b)`. |
| **Representación con procedimientos** | Implementación usando closures (message passing). | `(lambda (s) ...)` con selectores. |
| **Selector** | Parámetro numérico para acceder a componentes en representación procedural. | 0: tipo, 1: primer componente, 2: segundo componente. |
| **Recursión estructural** | Técnica para procesar estructuras recursivas llamándose a sí misma sobre subestructuras. | `sumar` llama a `sumar` sobre el resto de la lista. |
| **Caso base** | Condición de terminación en recursión. | Lista vacía retorna 0. |
| **Caso recursivo** | Paso que reduce el problema y hace llamada recursiva. | Sumar elementos de tupla actual más suma del resto. |
| **Abstracción de datos** | Principio de ocultar detalles de implementación y exponer solo interfaz. | Mismo `sumar` funciona con ambas representaciones. |

# Comentarios adicionales

- Las **tuplas** son estructuras de datos fundamentales en programación funcional, usadas para agrupar valores relacionados. A diferencia de las listas, tienen tamaño fijo y pueden contener elementos de tipos diferentes.
- La **representación con procedimientos** (message passing) es más abstracta y segura que la de listas, ya que encapsula completamente la implementación y previene acceso incorrecto a la estructura interna.
- El **patrón de diseño** mostrado (constructores + observadores) es general y aplicable a cualquier TAD, no solo a tuplas y listas.
- La **recursión estructural** es natural para procesar listas, ya que estas se definen inductivamente: una lista es vacía o es un elemento seguido de otra lista.
- En la práctica, Scheme ya tiene **tuplas nativas** (pares creados con `cons`) y **listas nativas**, pero este ejemplo ilustra cómo se podrían implementar desde cero como TADs.
- La **función `sumar`** demuestra **polimorfismo de implementación**: el mismo código funciona con ambas representaciones porque solo usa la interfaz del TAD.
- Para estructuras más complejas, se pueden anidar TADs: aquí tenemos un TAD para tuplas y otro para listas, y la lista contiene tuplas.
- La **verificación de tipos** en tiempo de ejecución (con `a-tuple?`, `empty-list?`, etc.) es necesaria en Scheme (lenguaje dinámicamente tipado), pero en lenguajes estáticamente tipados esto se verificaría en tiempo de compilación.
- Este enfoque de **TADs** es la base de la **programación orientada a objetos**: los constructores son como constructores de clase, los observadores son como métodos getter, y la representación con procedimientos es similar a objetos que responden a mensajes.
- En aplicaciones reales, las tuplas suelen generalizarse a **registros** o **estructuras** con campos nombrados (no solo posicionales), pero el principio de abstracción es el mismo.