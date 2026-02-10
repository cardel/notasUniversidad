# Enunciado

1) Desarrollar un programa que proporcione los números múltiplos de 2 o 3 en un rango entre n y m (donde n < m) en una lista de enteros, utilizando recursión de cola.

2) Desarrollar un programa que genere los números palíndromos entre m y n. Utilizar funciones de alto orden.

## Ejercicio 1

```scheme
#lang eopl

;; Función principal que filtra números múltiplos de 2 o 3
;; Utiliza composición de funciones: generador crea el rango, filtro aplica el predicado
(define multiplos2o3
  (lambda (n m)
    ;; filtro aplica un predicado a cada elemento generado
    ;; El predicado comprueba si x es divisible por 2 (residuo 0) o por 3
    (filtro (lambda (x) (or (= (modulo x 2) 0)
                            (= (modulo x 3) 0)))
            ;; generador crea una lista con todos los números entre n y m
            (generador n m)
            )
    )
  )

;; Función que genera una lista con todos los números entre n y m (inclusivo)
;; Utiliza recursión de cola con acumulador para garantizar eficiencia
(define generador
  (lambda (n m [acc empty])
    ;; Caso base: cuando n supera m, retorna el acumulador invertido
    ;; La inversión es necesaria porque construimos la lista hacia atrás
    (if
     (> n m)
     ;; reverse invierte la lista para obtener el orden correcto (ascendente)
     (reverse acc)
     ;; Caso recursivo: agrega el número actual al acumulador y avanza
     ;; cons agrega n al inicio del acumulador, luego se invierte al final
     (generador (+ 1 n) m (cons n acc)))))

;; Función de alto orden que filtra una lista según un predicado (función)
;; Recibe: f (función predicado), lst (lista), acc (acumulador, parámetro con valor por defecto)
(define filtro
  (lambda (f lst [acc empty])
    ;; Caso base: lista vacía, retorna el acumulador invertido
    (cond
      [(null? lst) (reverse acc)]
      ;; Si el predicado f retorna verdadero para el primer elemento,
      ;; agrégalo al acumulador y continúa recursivamente
      [(f (car lst))
       (filtro f (cdr lst) (cons (car lst) acc))]
      ;; Si el predicado retorna falso, omite el elemento y continúa
      [else
       (filtro f (cdr lst) acc)])))
```

## Ejercicio 2

```scheme
#lang eopl

;; Función principal que encuentra números palíndromos entre n y m
;; Un palíndromo es un número que se lee igual de izquierda a derecha
;; que de derecha a izquierda
(define numerospalindromos
  (lambda (n m)
    ;; Filtra números que cumplen la condición de ser palíndromos
    ;; El predicado compara el número como string con su reverso
    (filtro
     (lambda (x)
       ;; equal? compara dos strings para determinar si son iguales
       ;; (number->string x) convierte el número a su representación en texto
       ;; (convertidor x) reversa el string del número
       (equal? (number->string x)
               (convertidor x)))
       ;; generador produce la lista de números entre n y m
       (generador n m))))

;; Función que genera una lista con todos los números entre n y m (inclusivo)
;; Utiliza recursión de cola con acumulador para eficiencia
(define generador
  (lambda (n m [acc empty])
    ;; Caso base: cuando n supera m, retorna el acumulador invertido
    (if
     (> n m)
     ;; reverse invierte la lista para obtener el orden correcto (ascendente)
     (reverse acc)
     ;; Caso recursivo: agrega el número actual al acumulador y avanza
     ;; cons agrega n al inicio del acumulador, luego se invierte al final
     (generador (+ 1 n) m (cons n acc)))))

;; Función de alto orden que filtra una lista según un predicado (función)
;; Recibe: f (función predicado), lst (lista), acc (acumulador, parámetro con valor por defecto)
(define filtro
  (lambda (f lst [acc empty])
    ;; Caso base: lista vacía, retorna el acumulador invertido
    (cond
      [(null? lst) (reverse acc)]
      ;; Si el predicado f retorna verdadero para el primer elemento,
      ;; agrégalo al acumulador y continúa recursivamente
      [(f (car lst))
       (filtro f (cdr lst) (cons (car lst) acc))]
      ;; Si el predicado retorna falso, omite el elemento y continúa
      [else
       (filtro f (cdr lst) acc)])))

;; Función auxiliar que reversa la representación en string de un número
;; Convierte el número a string, luego invierte el orden de caracteres
(define convertidor
  (lambda (n)
    ;; (number->string n) convierte el número a string
    ;; (string->list ...) convierte el string en una lista de caracteres
    ;; (reverse ...) invierte el orden de caracteres
    ;; (list->string ...) convierte la lista de caracteres nuevamente a string
    (list->string (reverse (string->list (number->string n))))
    )
  )
```

## Tabla de Resumen

| Concepto | Descripción | Aplicación en los ejercicios |
|----------|-------------|------------------------------|
| Recursión de cola | Recursión donde la llamada recursiva es la última operación; permite optimización automática | Funciones `generador` y `filtro` en ambos ejercicios |
| Acumulador | Parámetro que almacena resultados parciales para evitar reconstruir estructuras completas | Parámetro `acc` en `generador` y `filtro` |
| Función de alto orden | Función que recibe otras funciones como parámetros | `filtro` recibe un predicado como parámetro `f` |
| Predicado booleano | Función que retorna verdadero o falso | Lambdas que verifican múltiplos y palíndromos |
| Composición de funciones | Combinar múltiples funciones para resolver un problema complejo | `multiplos2o3` utiliza `generador` y `filtro` |
| modulo (operación aritmética) | Retorna el residuo de una división | `(modulo x 2)` y `(modulo x 3)` para verificar divisibilidad |
| Conversión de tipos | Transformar datos entre diferentes tipos | `number->string`, `string->list`, `list->string` |
| Inversión de lista (reverse) | Invierte el orden de elementos en una lista | Necesaria porque `cons` construye listas hacia atrás |
| Predicado null? | Verifica si una lista está vacía | Caso base en `generador` y `filtro` |
| equal? | Compara dos valores para determinar si son iguales | Compara strings para identificar palíndromos |
| cons (constructor) | Agrega un elemento al inicio de una lista | Construcción de acumulador en recursión |
| car (extractor de cabeza) | Obtiene el primer elemento de una lista | Acceso al elemento actual en `filtro` |
| cdr (extractor de cola) | Obtiene el resto de la lista | Procesamiento recursivo del resto de elementos |

## Comentarios Adicionales

- **Diferencia entre los ejercicios**: El ejercicio 1 utiliza un predicado simple basado en operaciones aritméticas (modulo), mientras que el ejercicio 2 requiere conversión de tipos y manipulación de strings para realizar la comparación de palíndromos.

- **Reutilización de código**: Tanto `generador` como `filtro` son funciones genéricas que se reutilizan en ambos ejercicios, demostrando el principio de separación de responsabilidades en programación funcional.

- **Parámetros con valor por defecto**: La sintaxis `[acc empty]` define parámetros opcionales con valores por defecto. Cuando se llama `(generador n m)` sin el tercer parámetro, `acc` automáticamente toma el valor `empty`.

- **Construcción invertida de listas**: Las funciones `generador` y `filtro` construyen listas de atrás hacia adelante usando `cons`, agregando elementos al inicio del acumulador. Por esta razón, es necesario invertir la lista final con `reverse`. Este patrón es eficiente porque `cons` es una operación O(1), mientras que agregar al final sería O(n).

- **Cadena de transformación (Ejercicio 2)**: El número se transforma: número → string → lista de caracteres → lista invertida → string invertido. Esta cadena de conversiones permite comparar de manera elegante si un número es palíndromo.

- **Evaluación perezosa vs. entusiasta**: Aunque Racket utiliza evaluación entusiasta, la estructura de estos programas (generar primero, filtrar después) es conceptualmente similar a un pipeline funcional donde cada función procesa completamente su entrada antes de pasar al siguiente paso.

- **Eficiencia de la recursión de cola**: Ambas funciones `generador` y `filtro` son recursiones de cola, lo que significa que pueden procesar listas de cualquier tamaño sin riesgo de desbordamiento de pila, ya que Racket optimiza automáticamente estas llamadas.

- **Predicados como valores**: Las expresiones lambda utilizadas como predicados demuestran que en lenguajes funcionales, las funciones son valores de primera clase que pueden crearse, pasarse y utilizarse dinámicamente.


# Diferencia entre equal?, eq? y eqv?

## Comparación General

| Aspecto | eq? | eqv? | equal? |
|--------|-----|------|--------|
| **Nivel de comparación** | Identidad (misma ubicación en memoria) | Valor y tipo | Estructura y contenido |
| **Números** | Impredecible | Sí (mismo valor y tipo) | Sí (mismo valor) |
| **Strings** | Generalmente falso | Falso | Sí (mismo contenido) |
| **Listas** | Falso (diferentes referencias) | Falso | Sí (mismo contenido) |
| **Símbolos** | Sí (compartidos) | Sí | Sí |
| **Complejidad** | O(1) | O(1) | O(n) |

## eq? - Identidad (Igualdad de referencia)

Verifica si dos valores ocupan la **misma ubicación en memoria**. Es la comparación más estricta.

```scheme
#lang eopl

;; Ejemplos con números
(eq? 5 5)                    ;; Depende de implementación, generalmente #t para pequeños enteros
(eq? 10000 10000)            ;; Probablemente #f (diferentes ubicaciones)

;; Ejemplos con símbolos
(eq? 'hello 'hello)          ;; #t (los símbolos se internalizan, misma referencia)
(eq? 'a 'a)                  ;; #t

;; Ejemplos con strings
(eq? "hola" "hola")          ;; #f (dos strings diferentes en memoria)
(define str1 "hola")
(define str2 str1)
(eq? str1 str2)              ;; #t (misma referencia)

;; Ejemplos con listas
(define lista1 (list 1 2 3))
(define lista2 (list 1 2 3))
(eq? lista1 lista2)          ;; #f (listas diferentes en memoria)
(define lista3 lista1)
(eq? lista1 lista3)          ;; #t (misma referencia)

;; Ejemplo con cons
(eq? (cons 1 empty) (cons 1 empty))  ;; #f (diferentes estructuras)
```

**Conclusión**: `eq?` es útil cuando necesitas verificar si dos variables apuntan al **mismo objeto en memoria**, no si tienen el mismo valor.

## eqv? - Equivalencia (Igualdad de valor y tipo)

Verifica si dos valores tienen el **mismo valor y tipo primitivo**. Es una comparación de nivel intermedio.

```scheme
#lang eopl

;; Ejemplos con números
(eqv? 5 5)                   ;; #t (mismo número)
(eqv? 5.0 5)                 ;; #f (diferentes tipos: float vs entero)
(eqv? 5 5.0)                 ;; #f (diferentes tipos)

;; Ejemplos con símbolos
(eqv? 'hello 'hello)         ;; #t (mismo símbolo)
(eqv? 'a 'b)                 ;; #f (símbolos diferentes)

;; Ejemplos con strings
(eqv? "hola" "hola")         ;; #f (el comportamiento con strings es impredecible según estándar)
(eqv? "hola" "mundo")        ;; #f

;; Ejemplos con booleanos
(eqv? #t #t)                 ;; #t
(eqv? #f #f)                 ;; #t
(eqv? #t #f)                 ;; #f

;; Ejemplos con listas
(eqv? (list 1 2 3) (list 1 2 3))  ;; #f (diferentes estructuras)

;; Ejemplos con caracteres
(eqv? #\a #\a)               ;; #t (mismo carácter)
(eqv? #\a #\b)               ;; #f (caracteres diferentes)
```

**Conclusión**: `eqv?` es apropiado para comparar **valores primitivos** como números (del mismo tipo), símbolos, caracteres y booleanos, pero NO para estructuras compuestas.

## equal? - Igualdad estructural (Igualdad de contenido)

Verifica si dos valores tienen la **misma estructura y contenido**, sin importar la ubicación en memoria. Es la comparación más flexible.

```scheme
#lang eopl

;; Ejemplos con números
(equal? 5 5)                 ;; #t (mismo valor)
(equal? 5.0 5)               ;; #t (mismo valor numérico, ignora tipo)
(equal? 5 5.0)               ;; #t

;; Ejemplos con símbolos
(equal? 'hello 'hello)       ;; #t (mismo símbolo)
(equal? 'a 'b)               ;; #f (símbolos diferentes)

;; Ejemplos con strings
(equal? "hola" "hola")       ;; #t (mismo contenido)
(equal? "hola" "mundo")      ;; #f (contenido diferente)

;; Ejemplos con listas
(equal? (list 1 2 3) (list 1 2 3))  ;; #t (mismo contenido)
(define lista1 (list 1 2 3))
(define lista2 (list 1 2 3))
(equal? lista1 lista2)       ;; #t (mismo contenido, aunque diferentes referencias)

;; Ejemplos con listas anidadas
(equal? (list (list 1 2) (list 3 4))
        (list (list 1 2) (list 3 4)))  ;; #t (estructura idéntica)

;; Ejemplos con vectores
(equal? (vector 1 2 3) (vector 1 2 3))  ;; #t (mismo contenido)

;; Ejemplos mixtos
(equal? (list 1 "hola" 'a)
        (list 1 "hola" 'a))  ;; #t (estructura y contenido iguales)
```

**Conclusión**: `equal?` es la comparación más general y útil para la mayoría de casos, especialmente cuando trabajas con **estructuras de datos complejas** como listas, strings y colecciones anidadas.

## Tabla Comparativa Detallada

| Caso | eq? | eqv? | equal? |
|-----|-----|------|--------|
| `(eq? 3 3)` | Depende* | #t | #t |
| `(eq? 3.0 3.0)` | #f | #f | #t |
| `(eq? "a" "a")` | #f | #f | #t |
| `(eq? 'a 'a)` | #t | #t | #t |
| `(eq? (list 1 2) (list 1 2))` | #f | #f | #t |
| `(eqv? 5 5)` | - | #t | #t |
| `(eqv? 5.0 5)` | - | #f | #t |
| `(eqv? "a" "a")` | - | #f | #t |
| `(equal? (list 1 "a" 'x) (list 1 "a" 'x))` | - | - | #t |

*Para pequeños enteros, Racket optimiza y mantiene la misma referencia, haciendo que `eq?` retorne #t. Para números grandes, retorna #f.

## Ejemplo Práctico Completo

```scheme
#lang eopl

;; Función que demuestra las diferencias
(define pruebas-comparacion
  (lambda ()
    (let ((str1 "hola")
          (str2 "hola")
          (lista1 (list 1 2 3))
          (lista2 (list 1 2 3)))
      
      ;; Comparación de strings
      (display "=== STRINGS ===\n")
      (display "eq?:    ")
      (display (eq? str1 str2))       ;; #f (diferentes referencias)
      (newline)
      (display "eqv?:   ")
      (display (eqv? str1 str2))      ;; #f (no son valores primitivos)
      (newline)
      (display "equal?: ")
      (display (equal? str1 str2))    ;; #t (mismo contenido)
      (newline)
      (newline)
      
      ;; Comparación de listas
      (display "=== LISTAS ===\n")
      (display "eq?:    ")
      (display (eq? lista1 lista2))   ;; #f (diferentes referencias)
      (newline)
      (display "eqv?:   ")
      (display (eqv? lista1 lista2))  ;; #f (no son valores primitivos)
      (newline)
      (display "equal?: ")
      (display (equal? lista1 lista2)) ;; #t (mismo contenido)
      (newline)
      (newline)
      
      ;; Comparación de números
      (display "=== NÚMEROS ===\n")
      (display "5 vs 5.0\n")
      (display "eq?:    ")
      (display (eq? 5 5.0))           ;; #f (tipos diferentes)
      (newline)
      (display "eqv?:   ")
      (display (eqv? 5 5.0))          ;; #f (tipos diferentes)
      (newline)
      (display "equal?: ")
      (display (equal? 5 5.0))        ;; #t (mismo valor numérico)
      (newline)
      (newline)
      
      ;; Comparación de símbolos
      (display "=== SÍMBOLOS ===\n")
      (display "eq?:    ")
      (display (eq? 'x 'x))           ;; #t (símbolos internalizados)
      (newline)
      (display "eqv?:   ")
      (display (eqv? 'x 'x))          ;; #t
      (newline)
      (display "equal?: ")
      (display (equal? 'x 'x))        ;; #t
      (newline)
      )))

(pruebas-comparacion)
```

## Recomendaciones de Uso

- **Usa `eq?`** solamente cuando necesites verificar si dos variables apuntan al **exactamente mismo objeto en memoria** (casos avanzados, manejo de memoria explícito).

- **Usa `eqv?`** cuando compares **valores primitivos** (números del mismo tipo, símbolos, caracteres, booleanos) y necesites precisión sobre el tipo.

- **Usa `equal?`** en la mayoría de casos, especialmente con **estructuras de datos complejas** (listas, strings, vectores anidados). Es la opción más intuitiva y segura.

En el contexto del Ejercicio 2 (números palíndromos), `equal?` es la opción correcta porque se comparan **strings** (contenido textual), no referencias o valores primitivos simples.