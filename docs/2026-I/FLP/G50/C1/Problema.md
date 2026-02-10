# Problema

1. Desarrollar un programa que, dado un `n`, retorne la lista desde `0!` hasta `n!`. Usar recursión de cola.
2. Desarrollar un programa que reciba `n`, `m` y retorne los números primos en ese rango (donde `n < m`).

```scheme
#lang eopl
#|
Desarrollar un programa que dado un n, me retorne la
lista desde 0! hasta n!. Recursión de cola.
|#

(define lista-factoriales
  (lambda (n [acc empty]) ; Parámetro opcional 'acc' (acumulador) inicializado como lista vacía
    (cond
      [(= n 0) (cons 1 acc)] ; Caso base: n=0, agrega 0! = 1 a la lista acumulada
      [else
       (lista-factoriales (- n 1) ; Caso recursivo: decrementa n
                          (cons (factorial n) acc))]))) ; Calcula n! y lo agrega al inicio de la lista

(define factorial
  (lambda (n [acc 1]) ; Parámetro opcional 'acc' inicializado en 1
    (cond
      [(= n 0) acc] ; Caso base: retorna el acumulador
      [else (factorial
             (- n 1) ; Decrementa n
             (* n acc))]))) ; Multiplica n por el acumulador y continúa

; 2. Desarrollar un programa que reciba n,m y me retorne
; los números primos en ese rango (n < m)

; Generar una lista con los números entre n y m (inclusive)
(define generador
  (lambda (n m)
    (if
     (>= n m) ; Condición de parada: cuando n alcanza o supera a m
     (list m) ; Caso base: lista con el último número
     (cons n (generador (+ n 1) m))))) ; Caso recursivo: agrega n y continúa con n+1

; Verificar si un número es primo
(define es-primo?
  (lambda (n)
     (reduce-and ; Reduce la lista de booleanos con operador AND
      (map ; Aplica la función a cada posible divisor
       (lambda (x) (if
                    (= n 2) ; Caso especial: 2 es primo
                    #t
                    (not (= (modulo n x) 0)) ; Verifica que n no sea divisible por x
                    )
         )
       (generador 2 (ceiling (sqrt n)))) ; Genera divisores desde 2 hasta √n
      )
    )
  )

; Función que reduce una lista de booleanos con operador AND
(define reduce-and
  (lambda (lst)
    (cond
      [(null? lst) #t] ; Caso base: lista vacía retorna verdadero (elemento neutro de AND)
      [else
       (and (car lst) ; Aplica AND al primer elemento
            (reduce-and (cdr lst)))]))) ; Y recursivamente al resto

; Función principal que retorna la lista de primos entre n y m
(define lista-primos
  (lambda (n m)
    (filter ; Filtra la lista generada
     (lambda (x) (es-primo? x)) ; Predicado: verifica si x es primo
     (generador n m) ; Lista de números en el rango [n, m]
     )
    )
  )

; Implementación propia de filter (filtrado de lista)
(define filter
  (lambda (f lst)
    (cond
      [(null? lst) empty] ; Caso base: lista vacía
      [(f (car lst)) ; Si el primer elemento cumple el predicado
       (cons (car lst) ; Lo conserva
             (filter f (cdr lst)))] ; Y filtra el resto
      [else ; Si no cumple el predicado
       (filter f (cdr lst))] ; Solo filtra el resto
      )))
```

## Conceptos teóricos adicionales

- **Recursión de cola en Scheme**: Al igual que en Scala, Scheme optimiza la recursión de cola para evitar crecimiento de la pila. Una llamada recursiva es de cola cuando es la última expresión evaluada en la función.
- **Funciones de orden superior en Scheme**: `map`, `filter`, `reduce` (aunque `reduce` no es estándar en Scheme, se implementa como `fold` o manualmente).
- **Evaluación de parámetros opcionales**: En Scheme (específicamente en Racket con `#lang eopl`), se pueden definir parámetros opcionales con valores por defecto usando la sintaxis `[param valor-default]`.
- **Números primos y optimización**: Para verificar si un número es primo, solo es necesario probar divisores hasta su raíz cuadrada, lo que reduce significativamente el número de operaciones.
- **Funciones `map` y `filter`**: Son funciones fundamentales en programación funcional que transforman y filtran listas respectivamente.

## Tabla de resumen

| Concepto | Descripción | Ejemplo en Scheme |
|----------|-------------|-------------------|
| **Recursión de cola** | Recursión donde la llamada recursiva es la última operación. | `(factorial n [acc 1])` |
| **Parámetros opcionales** | Parámetros con valores por defecto. | `(lambda (n [acc empty]) ...)` |
| **Generación de rangos** | Crear secuencias de números. | `(generador n m)` |
| **Verificación de primos** | Algoritmo para identificar números primos. | `(es-primo? n)` |
| **Función `map`** | Aplica una función a cada elemento de una lista. | `(map f lista)` |
| **Función `filter`** | Filtra elementos de una lista según un predicado. | `(filter f lista)` |
| **Reducción (`reduce`)** | Combina elementos de una lista usando una operación. | `(reduce-and lista)` |
| **Operador `modulo`** | Calcula el resto de una división. | `(modulo n x)` |
| **Función `ceiling`** | Redondea hacia arriba al entero más cercano. | `(ceiling (sqrt n))` |
| **Predicados booleanos** | Funciones que retornan `#t` o `#f`. | `(es-primo? x)` |

## Comentarios adicionales

- En Scheme, la **recursión** es el principal mecanismo de iteración debido a la inmutabilidad de las listas y la falta de estructuras de control imperativas como `for` o `while`.
- La implementación de `filter` mostrada es una versión educativa; en la práctica, Scheme/Racket ya incluye una función `filter` en su biblioteca estándar.
- Para mejorar la eficiencia de `es-primo?`, se podría agregar una verificación temprana para números pares mayores que 2.
- El uso de `(generador 2 (ceiling (sqrt n)))` es una optimización clave: solo se prueban divisores hasta la raíz cuadrada del número.
- En programación funcional, es común **componer funciones** (como `map` seguido de `reduce-and`) para crear pipelines de procesamiento de datos.
- La función `reduce-and` implementa el patrón de **folding** (plegado) que es fundamental en programación funcional para reducir listas a un solo valor.
- En Scheme, las **listas** son la estructura de datos fundamental, y muchas operaciones se definen recursivamente sobre ellas.
- Para depurar programas en Scheme, se puede usar `(display ...)` o `(write ...)` para inspeccionar valores intermedios.