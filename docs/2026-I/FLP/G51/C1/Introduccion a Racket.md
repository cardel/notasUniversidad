# Introducción a Racket

```scheme
#lang eopl

;; Declaración de ligaduras (inmutables)
;; En Racket, define vincula nombres a valores de manera inmutable
(define varA 3)
(define varB 'xd)
(define varC "Hola")
(define varE 3.5)

;; Notación prefija (Racket utiliza notación prefija, no infija)
;; La estructura es (operador operando1 operando2 ...)
(+ 5 3)

;; Los operadores se evalúan de adentro hacia afuera (evaluación interna)
;; Cada expresión entre paréntesis se evalúa antes de pasarse como argumento
(* (+ 5 (* 2 3)) (+ 4 (* 8 (+ 2 3))))

;; Definición de funciones usando lambda (funciones anónimas)
;; Lambda crea una función sin nombre que se vincula a un identificador
(define funcion
  (lambda (x y)
    ;; El cuerpo de la función calcula: 2x + 3y
    (+ (* x 2) (* 3 y))))

;; Llamada a la función con argumentos 2 y 3
(funcion 2 3)

;; Estructuras condicionales

;; Función que utiliza if para evaluar una condición
(define adivina
  (lambda (n)
    ;; if tiene tres partes: condición (predicado booleano), rama verdadera, rama falsa
    (if
     (= n 5)
     "Adivinaste"
     "No adivinaste, intenta de nuevo"
     )))

;; El if evalúa el predicado y ejecuta una de las dos ramas según el resultado

;; Función que utiliza cond para múltiples condiciones
(define rango
  (lambda (x)
    ;; cond evalúa condiciones de arriba hacia abajo y ejecuta la rama correspondiente
    (cond
      [(= x 1) "Es igual a 1"]
      [(= x 2) "Es igual a 2"]
      [(> x 2) "Es mayor que 2"]
      ;; and combina múltiples predicados con lógica AND
      [(and (> x 1) (< x 2)) "Es mayor que 1 y menor que 2"]
      ;; else se ejecuta si todas las condiciones anteriores son falsas
      [else "Es menor que 1"]
      )))

;; cond evalúa de arriba hacia abajo y detiene la evaluación cuando encuentra una condición verdadera

;; Estructura recursiva de listas
;; Las listas en Racket se construyen recursivamente con cabeza (car) y cola (cdr)

;; cons construye una lista agregando un elemento al inicio de otra lista
;; empty es la lista vacía (base de la recursión)
(define listaA (cons 1 (cons 2 (cons 3 empty))))

;; list es azúcar sintáctico que simplifica la construcción de listas
(define listaB (list 1 2 3))

;; La notación con comilla simple '(...) crea listas simbólicas (datos literales)
(define listaC '(1 2 3))

;; Definición de función auxiliar para cálculo
(define f (lambda (x) (* x x x)))

;; Construcción de listas aplicando una función a cada elemento
;; En esta lista se aplica f a cada valor
(define listaD (cons (f 1) (cons (f 2) (cons (f 3) empty))))
(define listaE (list (f 1) (f 2) (f 3)))

;; Con notación literal, f NO se evalúa (es un símbolo, no una función)
(define listaF '( (f 1) (f 2) (f 3)))

;; Acceso a elementos de listas
;; car extrae el primer elemento (cabeza)
(car listaA) ;; Retorna 1

;; cdr retorna el resto de la lista sin el primer elemento (cola)
(cdr listaA) ;; Retorna (2 3)

;; Acceso al segundo elemento: extraer cdr y luego car
(car (cdr listaA)) ;; Retorna 2

;; Azúcar sintáctico para acceso frecuente
;; cadr es equivalente a (car (cdr ...))
(cadr listaA) ;; Retorna 2

;; Acceso al tercer elemento
(car (cdr (cdr listaA))) ;; Retorna 3
;; caddr es equivalente a (car (cdr (cdr ...)))
(caddr listaA) ;; Retorna 3

;; Listas anidadas o listas de listas
(define listaCA (list (list 1 2 3) (list 4 5 6)))
(define listaCB '( (1 2 3) (4 5 6)))

#|
 EJEMPLO DE EVALUACIÓN CON LISTAS ANIDADAS:
 
 listaCA
 ((1 2 3) (4 5 6))
 > listaCB
 ((1 2 3) (4 5 6))
 > (car listaCB)
 (1 2 3)
 > (car (car listaCB))
 1
 > (caar listaCB)
 1
 > (cdr listaCB)
 ((4 5 6))
 > (cdr (cdr listaCB))
 ()
 > (car (cdr listaCB))
 (4 5 6)
 > (car (car (cdr listaCB)))
 4
 > (cdr (car (cdr listaCB)))
 (5 6)
 > (car (cdr (car (cdr listaCB))))
 5
 > (cadadr listaCB)
 5
|#

;; Las listas SIEMPRE se procesan con funciones recursivas
;; Esta función suma todos los números en una lista, incluso si hay listas anidadas

(define sumar-lista
  (lambda (lst)
    ;; Caso base: si la lista está vacía, retorna 0
    (cond
      [(null? lst) 0]
      ;; Si el primer elemento es una lista, sumar recursivamente esa lista
      ;; y sumar el resultado con la suma del resto
      [(list? (car lst))
       (+ (sumar-lista (car lst))
          (sumar-lista (cdr lst)))]
      ;; Si el primer elemento es un número, agregarlo a la suma del resto
      [else (+ (car lst) (sumar-lista (cdr lst)))]
      )
    )
  )

;; Función de alto orden: map
;; map aplica una función a cada elemento de una lista y retorna una nueva lista
;; Esta es una función de orden superior que recibe una función como parámetro
(map (lambda (x) (+ x 2)) (list 1 2 3)) ;; Retorna (3 4 5)

;; Recursión de cola (tail recursion)
;; En Racket, la optimización de llamadas de cola es automática
;; La recursión de cola permite que funciones recursivas no causen desbordamiento de pila
;; Una función es de cola si la llamada recursiva es la última operación

(define sumar-lista-tail-rec
  (lambda (lst [acc 0])
    ;; acc es un acumulador que almacena el resultado parcial
    ;; El parámetro [acc 0] indica un valor por defecto
    (cond
      ;; Caso base: si la lista está vacía, retorna el acumulador
      [(null? lst) acc]
      ;; Si el primer elemento es una lista, sumar esa lista y agregar el resultado al acumulador
      [(list? (car lst))
       (sumar-lista-tail-rec (cdr lst)
                             ;; Se actualiza el acumulador con la suma de la sublista
                             (+ acc (sumar-lista-tail-rec (car lst))))]
      ;; Si es un número, agregarlo al acumulador y continuar con el resto
      [else (sumar-lista-tail-rec (cdr lst) (+ acc (car lst)))]
      )
    )
  )
```

## Tabla de Resumen

| Concepto | Descripción | Ejemplo en el código |
|----------|-------------|----------------------|
| Ligaduras inmutables | Vinculación de nombres a valores que no pueden cambiar | `(define varA 3)` |
| Notación prefija | Operador al inicio seguido de operandos | `(+ 5 3)` retorna 8 |
| Lambda (funciones anónimas) | Función sin nombre que se puede asignar a un identificador | `(lambda (x y) (+ (* x 2) (* 3 y)))` |
| Predicados booleanos | Funciones que retornan verdadero o falso | `(= n 5)`, `(> x 2)`, `(null? lst)` |
| if (condicional simple) | Estructura de control con tres partes: condición, rama verdadera, rama falsa | `(if (= n 5) "Sí" "No")` |
| cond (condicional múltiple) | Estructura de control que evalúa múltiples condiciones secuencialmente | Función `rango` con múltiples casos |
| cons (constructor de lista) | Construye una lista agregando un elemento al inicio | `(cons 1 (cons 2 empty))` |
| car (extractor de cabeza) | Extrae el primer elemento de una lista | `(car listaA)` retorna 1 |
| cdr (extractor de cola) | Extrae el resto de la lista sin el primer elemento | `(cdr listaA)` retorna (2 3) |
| Recursión estructural | Procesamiento de listas mediante recursión | Función `sumar-lista` |
| Funciones de alto orden | Funciones que reciben otras funciones como parámetros | `map` aplica una función a cada elemento |
| Recursión de cola | Recursión donde la llamada recursiva es la última operación | Función `sumar-lista-tail-rec` |
| Acumulador | Parámetro que almacena resultados parciales en recursión de cola | Parámetro `acc` en `sumar-lista-tail-rec` |
| Listas anidadas | Listas que contienen otras listas como elementos | `(list (list 1 2 3) (list 4 5 6))` |
| Azúcar sintáctico | Notación simplificada para operaciones comunes | `cadr`, `caddr` son equivalentes a `(car (cdr ...))` |

## Comentarios Adicionales

- **Evaluación interna**: En Racket, la evaluación de expresiones anidadas ocurre de adentro hacia afuera. Esto es fundamental para entender cómo se procesan expresiones complejas como `(* (+ 5 (* 2 3)) (+ 4 (* 8 (+ 2 3))))`.

- **Diferencia entre list y quote**: `(list 1 2 3)` evalúa los elementos, mientras que `'(1 2 3)` los trata como datos literales sin evaluar. Esto es crítico cuando se trabaja con funciones dentro de listas.

- **Optimización automática de cola**: A diferencia de algunos lenguajes funcionales, Racket optimiza automáticamente las llamadas de cola sin requiere anotaciones especiales. Esto hace que la recursión de cola sea segura para listas de cualquier tamaño.

- **null? vs empty**: `null?` es un predicado que verifica si una lista está vacía. `empty` es el constructor de la lista vacía. Ambos son esenciales para definir casos base en recursión.

- **Composición de funciones**: Las funciones `car` y `cdr` pueden componerse para acceder a elementos específicos. El azúcar sintáctico (`cadr`, `caddr`, `caar`, etc.) simplifica esta composición pero puede resultar confuso con muchos niveles de anidación.

- **Procesamiento de listas anidadas**: La función `sumar-lista` demuestra un patrón importante: comprobar si un elemento es una lista antes de procesarlo, permitiendo manejar estructuras jerárquicas.

- **map y funciones de alto orden**: Las funciones de alto orden como `map`, `filter` y `fold` son fundamentales en programación funcional y permiten expresar transformaciones de listas de manera declarativa.