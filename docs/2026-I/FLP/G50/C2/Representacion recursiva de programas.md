# Representación Recursiva de Programas

## Principio Fundamental del Diseño

Al desarrollar un programa que utiliza una estructura de datos recursiva, su diseño debe seguir exactamente la definición de esa estructura. Este enfoque se denomina **recursión estructural** y garantiza que el programa termine y cubra todos los casos posibles.

```ebnf
<lst> ::= '() | <int> <lst>
```

De acuerdo a esto podemos definir, por ejemplo, la función $f(x)$ que obtiene el tamaño de la lista.

```scheme
#lang eopl

#|
Definición de lista según gramática BNF
<lst> ::= '() | <int> <lst>

Estructura recursiva:
- Caso base: '() es una lista válida
- Caso recursivo: si l es lista e n es número, entonces (n . l) es lista
|#

; list-length: lst -> number
; Calcula la cantidad de elementos en una lista
; Utiliza acumulador para optimizar la recursión (tail recursion)
; El acumulador evita crear marcos de pila profundos
(define list-length
  (lambda (l [acc 0])
    (if
     (null? l)                        ; Caso base: lista vacía tiene longitud 0
     acc                              ; Retorna el acumulador
     (list-length (cdr l) (+ 1 acc))  ; Recursión: avanza en lista e incrementa acumulador
     )
    )
  )

(newline)
(display "Longitud de lista")
(newline)
(display (list-length '(1 2 3)))      ; 3
(newline)
(display (list-length '()))           ; 0
```

## Transformación de Estructuras: Map

Para aplicar una función a cada elemento de una lista, implementamos el patrón map, el cual recibe:
- Una lista de números
- Una función que transforma un número en otro número
- Retorna una lista de números con la función aplicada

```scheme
; map: lst function -> lst
; Aplica una función a cada elemento de una lista
; Utiliza acumulador y append para construir la lista resultado
; Mantiene el orden original de los elementos
(define map
  (lambda (l f [acc '()])
    (if
     (null? l)                                      ; Caso base: lista vacía
     acc                                            ; Retorna acumulador con resultado
     (map (cdr l) f (append acc (list (f (car l))))))) ; Aplica f al primer elemento
    )
  )

(newline)
(display "Map: elevar al cuadrado")
(newline)
(display (map '(1 2 3) (lambda (x) (* x x ))))       ; (1 4 9)
(newline)
(display "Map: multiplicar por 3")
(newline)
(display (map '(2 4 6 8 10) (lambda (x) (* x 3))))   ; (6 12 18 24 30)
```

En general, vemos que el diseño de datos recursivos sigue la estructura inductiva de los datos.

## Procesamiento de Árboles

```scheme
#|
Definición de árbol binario según gramática BNF
<b-tree> ::= <int>
           ::= <symbol> <b-tree> <b-tree>

Estructura jerárquica:
- Caso base: un número es un árbol (hoja)
- Caso recursivo: un símbolo con dos subárboles es un árbol (nodo interno)
|#

; arbol->lst: b-tree -> list
; Convierte un árbol binario a una lista mediante recorrido en preorden
; Preorden: procesa el nodo antes que sus subárboles
; Orden: raíz -> subárbol izquierdo -> subárbol derecho
(define arbol->lst
  (lambda (arb)
    (if
     (number? arb)                                   ; Caso base: hoja es número
     (cons arb empty)                                ; Retorna lista con el número
     (append
      (list (car arb))                               ; Procesa etiqueta del nodo
      (arbol->lst (cadr arb))                        ; Procesa subárbol izquierdo
      (arbol->lst (caddr arb)))                      ; Procesa subárbol derecho
     )
    )
  )

#|
Ejemplo de uso:
Árbol: (f (k 2 3) 4)
Estructura:
    f
   / \
  k   4
 / \
2   3

Recorrido preorden: (f k 2 3 4)
|#
```

## Recorridos de Árboles

### Tipos de Recorrido

1. **Preorden** ($V \to I \to D$): Procesa el nodo, luego izquierda, luego derecha
2. **Inorden** ($I \to V \to D$): Procesa izquierda, luego nodo, luego derecha (útil en árboles de búsqueda)
3. **Postorden** ($I \to D \to V$): Procesa izquierda, luego derecha, luego nodo (útil para cálculos)

```scheme
; arbol->lst-inorden: b-tree -> list
; Recorrido inorden: subárbol izquierdo -> nodo -> subárbol derecho
; Produce una lista ordenada de elementos si el árbol es árbol de búsqueda binario
(define arbol->lst-inorden
  (lambda (arb)
    (if
     (number? arb)                                   ; Caso base
     (cons arb empty)
     (append
      (arbol->lst-inorden (cadr arb))                ; Subárbol izquierdo primero
      (list (car arb))                               ; Luego el nodo
      (arbol->lst-inorden (caddr arb)))              ; Finalmente subárbol derecho
     )
    )
  )

; arbol->lst-postorden: b-tree -> list
; Recorrido postorden: subárbol izquierdo -> subárbol derecho -> nodo
; Útil para operaciones que requieren procesar hijos antes que padres
(define arbol->lst-postorden
  (lambda (arb)
    (if
     (number? arb)                                   ; Caso base
     (cons arb empty)
     (append
      (arbol->lst-postorden (cadr arb))              ; Subárbol izquierdo
      (arbol->lst-postorden (caddr arb))             ; Subárbol derecho
      (list (car arb)))                              ; Nodo al final
     )
    )
  )
```

## Optimización: Recursión de Cola (Tail Recursion)

La recursión de cola es una optimización donde la última operación es una llamada recursiva. Muchos compiladores convierten esto en iteración, evitando crecimiento del stack.

```scheme
; list-length-optimizado: lst -> number
; Versión optimizada con acumulador
; La última operación es la llamada recursiva (tail call)
; El compilador puede optimizar esto a iteración
(define list-length-optimizado
  (lambda (l [acc 0])
    (if
     (null? l)
     acc
     (list-length-optimizado (cdr l) (+ 1 acc))     ; Tail call: se optimiza
     )
    )
  )

; suma-lista: lst -> number
; Suma todos los elementos de una lista
; Utiliza acumulador para tail recursion
(define suma-lista
  (lambda (l [acc 0])
    (if
     (null? l)
     acc
     (suma-lista (cdr l) (+ acc (car l))))))          ; Tail call optimizado

(newline)
(display "Suma de lista")
(newline)
(display (suma-lista '(1 2 3 4 5)))                  ; 15
```

## Patrón General de Diseño

El diseño de funciones recursivas que operan sobre datos recursivos sigue este patrón:

### 1. Evaluar el Caso Base como Verdadero

El caso base debe coincidir exactamente con la definición gramatical (usualmente la lista vacía, un número, etc.).

### 2. Usar la Regla para Devolverse hacia el Caso Base

En el caso recursivo, se descompone el dato en partes más pequeñas que se acercan al caso base.

### 3. Garantizar Convergencia al Caso Base

Todo dato recursivo debe permitir volver al caso base mediante sucesivas aplicaciones de la descomposición. Sin esto, la función entra en infinito.

```scheme
; filtrar-pares: lst -> lst
; Retorna una lista conteniendo solo los números pares
; Demuestra el patrón: caso base + descomposición + recursión
(define filtrar-pares
  (lambda (l [acc '()])
    (cond
      [(null? l) acc]                               ; Caso base: lista vacía
      [(even? (car l))                              ; Verifica si el primer elemento es par
       (filtrar-pares (cdr l) (append acc (list (car l))))] ; Añade a resultado
      [else                                         ; Elemento es impar
       (filtrar-pares (cdr l) acc)])))              ; Lo descarta

(newline)
(display "Filtrar pares")
(newline)
(display (filtrar-pares '(1 2 3 4 5 6 7 8 9 10)))   ; (2 4 6 8 10)

; profundidad-arbol: b-tree -> number
; Calcula la altura máxima del árbol
; Demuestra recursión estructural en árboles
(define profundidad-arbol
  (lambda (arb)
    (if
     (number? arb)                                  ; Caso base: hoja tiene profundidad 0
     0
     (+ 1 (max                                      ; 1 + máximo de profundidades
           (profundidad-arbol (cadr arb))           ; Profundidad subárbol izquierdo
           (profundidad-arbol (caddr arb)))))))     ; Profundidad subárbol derecho

(newline)
(display "Profundidad de árbol")
(newline)
(display (profundidad-arbol 5))                     ; 0
(newline)
(display (profundidad-arbol '(f (k 2 3) 4)))        ; 2
```

## Tabla de Resumen

| Concepto | Definición | Ejemplo | Utilidad |
|----------|-----------|---------|----------|
| **Recursión Estructural** | Diseño que sigue la estructura del dato recursivo | Función sobre lista sigue estructura `'() \|\| n :: l` | Garantiza terminación y cobertura |
| **Caso Base** | Patrón que no requiere recursión; coincide con terminal en BNF | `(null? l)` en función sobre listas | Punto de parada de la recursión |
| **Caso Recursivo** | Patrón que descompone el dato y hace llamada recursiva | `(f (cdr l))` en función sobre listas | Avanza hacia el caso base |
| **Acumulador** | Parámetro que acumula resultados parciales | `[acc 0]` en `list-length` | Permite tail recursion; optimización |
| **Tail Recursion** | Llamada recursiva como última operación | `(f (cdr l) (+ acc 1))` | Compilador optimiza a iteración |
| **Map** | Función de orden superior que aplica función a cada elemento | `(map '(1 2 3) (lambda (x) (* x 2)))` | Transformación de estructuras |
| **Recorrido Preorden** | $V \to I \to D$: nodo, izquierda, derecha | `(f k 2 3 4)` de árbol `(f (k 2 3) 4)` | Orden natural de procesamiento |
| **Recorrido Inorden** | $I \to V \to D$: izquierda, nodo, derecha | `(2 k 3 f 4)` del mismo árbol | Útil en árboles de búsqueda binarios |
| **Recorrido Postorden** | $I \to D \to V$: izquierda, derecha, nodo | `(2 3 k 4 f)` del mismo árbol | Cálculos bottom-up; liberación de memoria |
| **Descomposición** | Dividir el dato en partes más pequeñas | `(car l)` y `(cdr l)` en lista | Acerca recursión al caso base |
| **Convergencia** | Garantía matemática de alcanzar el caso base | Lista disminuye con `cdr` en cada iteración | Evita infinito |
| **Función de Orden Superior** | Función que recibe otra función como parámetro | `map` con `lambda` como argumento | Flexibilidad y reutilización de código |

## Comentarios Adicionales

- La **recursión estructural** es el enfoque canónico en programación funcional: el código refleja la estructura de los datos
- La **tail recursion** permite que lenguajes funcionales implementen iteraciones eficientes sin usar loops explícitos
- Los **acumuladores** transforman recursión lineal en tail recursion, mejorando significativamente la eficiencia espacial
- Los **tres tipos de recorrido** de árboles responden a necesidades diferentes: preorden es intuitivo, inorden ordena en árboles binarios de búsqueda, postorden facilita cálculos agregados
- La **composición de funciones** (map, filter, fold) permite manipular estructuras recursivas sin escribir recursión explícita
- El **patrón de diseño** (caso base + descomposición + convergencia) es obligatorio para garantizar correctitud
- Las **funciones de orden superior** (map, filter, reduce/fold) son fundamentales en programación funcional moderna
- La **memoización** puede mejorar funciones recursivas que calculan los mismos subproblemas múltiples veces
- El **análisis de complejidad** de funciones recursivas requiere considerar tanto la profundidad de recursión como las operaciones en cada nivel