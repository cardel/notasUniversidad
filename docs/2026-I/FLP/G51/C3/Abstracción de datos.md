# Introducción

Un TAD (Tipo Abstracto de Dato) permite representar en el computador elementos que pertenecen a un conjunto, por ejemplo, los números enteros, los números pares, listas, etc.

Un TAD consta de:

1. **Interfaz**: Es lo que el TAD provee y lo que el programador utiliza para trabajar con él.
2. **Implementación**: Es cómo el lenguaje maneja internamente el dato.
    - **Python**: Objetos. Podemos representar un número de tamaño arbitrario, pero tiene un costo en rendimiento.
    - **C++/Java**: Representación en memoria (int de 32 bits, long de 64 bits). Aquí tenemos limitaciones con respecto al espacio (overflow).

# Representación de números

## Representación recursiva

1. **Zero**: $\lceil 0 \rceil$
2. **is-Zero(n)**: Si $n = 0$ entonces `true`, si no `false`.
3. **succ**: $\texttt{succ(}\lceil n \rceil \texttt{)} = \lceil n+1 \rceil$
4. **pred**: $\texttt{pred(}\lceil n \rceil \texttt{)} = \lceil n-1 \rceil$

```scheme
#lang eopl
#|
zero = 0

isZero(n) n == 0

succ(n) = n+1
pred(n) = n-1
|#

;; Implementación e interfaz
(define zero 0)  ;; Representación del cero como el número 0

(define isZero?
  (lambda (n)
    (equal? n zero)))  ;; Compara si n es igual a cero

(define succ
  (lambda (n)
    (+ n 1)))  ;; Incrementa n en 1

(define pred
  (lambda (n)
    (cond
      [(isZero? n) (eopl:error "No se puede obtener el predecesor de 0")]  ;; Error si n es cero
      [else (- n 1)])))  ;; Decrementa n en 1

;; Área del programador

(define tres (succ (succ (succ zero))))  ;; Construye el número 3
(define cinco (succ (succ (succ (succ (succ zero))))))  ;; Construye el número 5

;; tres + cinco = ocho
(define suma
  (lambda (a b)
    (cond
      [(isZero? b) a]  ;; Caso base: si b es cero, retorna a
      [else
       (suma (succ a) (pred b))]  ;; Llamada recursiva: incrementa a y decrementa b
      )
    )
  )
```

Observe que para implementar la suma usamos `isZero?`, `zero`, `succ` y `pred`, que es lo que proporciona la interfaz del tipo de dato.

# Representación con listas

Para la representación con listas tenemos:

1. **zero** es `'()`
2. **isZero?(n)** = `null?(n)`
3. **succ(n)** = `(cons #t n)`
4. **pred(n)** = `(cdr n)`

```scheme
#lang eopl
#|
zero = '()

isZero(n) n == null

succ(n) = (cons #t n)
pred(n) = (cdr n)
|#

;; Implementación e interfaz
(define zero '())  ;; Representación del cero como lista vacía

(define isZero?
  (lambda (n)
    (equal? n zero)))  ;; Compara si n es igual a la lista vacía

(define succ
  (lambda (n)
    (cons #t n)))  ;; Agrega #t al inicio de la lista (incrementa)

(define pred
  (lambda (n)
    (cond
      [(isZero? n) (eopl:error "No se puede obtener el predecesor de 0")]  ;; Error si n es cero
      [else (cdr n)])))  ;; Elimina el primer elemento (decrementa)

;; Área del programador

(define tres (succ (succ (succ zero))))  ;; Construye el número 3 como lista (#t #t #t)
(define cinco (succ (succ (succ (succ (succ zero))))))  ;; Construye el número 5

;; tres + cinco = ocho
(define suma
  (lambda (a b)
    (cond
      [(isZero? b) a]  ;; Caso base: si b es cero, retorna a
      [else
       (suma (succ a) (pred b))]  ;; Llamada recursiva
      )
    )
  )
```

# Representación bignum

Usa una base y una representación basada en listas, donde el elemento de menor peso está primero y el de mayor peso está al final.

```scheme
#lang eopl
#|
Bignum
zero = '()

isZero(n) n == null

succ(n) = (cons n q) --> n = (a0,a1,...) a0+1 si no hay acarreo, si no 0 a1+1
pred(n) = (cons n q) --> n = (a0,a1,...) a0-1 si no hay acarreo, si no N-1, a1-1
|#

;; Implementación e interfaz
(define base 8)  ;; Base numérica para la representación (ej. octal)

(define zero '())  ;; Representación del cero como lista vacía

(define isZero?
  (lambda (n)
    (equal? n zero)))  ;; Compara si n es igual a la lista vacía

(define succ
  (lambda (n)
    (cond
      [(isZero? n) '(1)]  ;; Si n es cero, retorna (1)
      [(equal? (+ (car n) 1) base)  ;; Si el dígito menos significativo +1 iguala la base
       (cons 0 (succ (cdr n)))]  ;; Pone 0 y propaga el acarreo al siguiente dígito
      [else
       (cons (+ (car n) 1) (cdr n))])))  ;; Incrementa el dígito menos significativo

(define pred
  (lambda (n)
    (cond
      [(isZero? n) (eopl:error "No se puede obtener el predecesor de 0")]  ;; Error si n es cero
      [(equal? n (succ zero)) '()]  ;; Si n es 1, retorna cero (lista vacía)
      [(= (car n) 0)  ;; Si el dígito menos significativo es 0
       (cons (- base 1) (pred (cdr n)))]  ;; Pone base-1 y propaga el préstamo
      [else
       (cons
        (- (car n) 1)  ;; Decrementa el dígito menos significativo
        (cdr n))])))

;; Área del programador

(define tres (succ (succ (succ zero))))  ;; Construye el número 3 en base 8: (3)
(define cinco (succ (succ (succ (succ (succ zero))))))  ;; Construye el número 5: (5)

;; tres + cinco = ocho
(define suma
  (lambda (a b)
    (cond
      [(isZero? b) a]  ;; Caso base
      [else
       (suma (succ a) (pred b))]  ;; Llamada recursiva
      )
    )
  )
```

# Tabla de resumen

| Concepto | Descripción | Ejemplo/Implementación |
|----------|-------------|------------------------|
| **TAD (Tipo Abstracto de Dato)** | Estructura que define un conjunto de valores y operaciones sobre ellos, separando interfaz de implementación. | Números enteros, listas. |
| **Interfaz** | Conjunto de operaciones visibles al programador para manipular el TAD. | `zero`, `isZero?`, `succ`, `pred`. |
| **Implementación** | Representación concreta en memoria y algoritmos internos. | Números nativos, listas, bignum. |
| **Representación recursiva** | Define números naturales a partir de cero y la función sucesor. | `zero = 0`, `succ(n) = n+1`. |
| **Representación con listas** | Usa listas para representar números, donde cada elemento simboliza una unidad. | `zero = '()`, `succ(n) = (cons #t n)`. |
| **Representación bignum** | Representación en base $B$ usando listas de dígitos, permitiendo números grandes. | Base 8, dígitos como lista: `(d0 d1 ...)`. |
| **succ (sucesor)** | Operación que incrementa un número en uno. | `succ(n) = n+1` (recursivo), `(cons #t n)` (listas). |
| **pred (predecesor)** | Operación que decrementa un número en uno (no definida para cero). | `pred(n) = n-1` (recursivo), `(cdr n)` (listas). |
| **isZero?** | Predicado que verifica si un número es cero. | `equal? n zero`. |
| **Suma recursiva** | Algoritmo que usa `succ` y `pred` para sumar, basado en la definición inductiva. | `suma(a,b) = a` si `b=0`, sino `suma(succ(a), pred(b))`. |

# Comentarios adicionales

- La **abstracción de datos** es fundamental en programación, ya que permite ocultar detalles de implementación y exponer solo operaciones esenciales, facilitando el mantenimiento y la modificación del código.
- Las **representaciones alternativas** (como listas o bignum) ilustran cómo un mismo TAD puede implementarse de múltiples formas, cada una con ventajas y desventajas (rendimiento, espacio, flexibilidad).
- La **representación bignum** es especialmente útil en lenguajes que no soportan números arbitrariamente grandes de forma nativa, ya que permite operar con enteros de precisión arbitraria.
- En la práctica, los lenguajes modernos ya incluyen TADs complejos (como enteros de gran tamaño) en sus bibliotecas estándar, pero entender su implementación subyacente es valioso para problemas de bajo nivel o optimización.
- La **recursión** es una técnica central en la definición de operaciones sobre TADs inductivos (como los números naturales), reflejando su estructura matemática.
- La **separación entre interfaz e implementación** garantiza que el código del programador no dependa de detalles internos, permitiendo cambiar la representación sin afectar la funcionalidad.