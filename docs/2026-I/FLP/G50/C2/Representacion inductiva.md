# Representación Inductiva

La representación inductiva nos permite especificar tipos de datos mediante reglas de construcción. Para esto utilizamos la noción de que un valor pertenece a un conjunto y posteriormente armamos los demás de acuerdo a las reglas establecidas.

## Concepto Fundamental

La representación inductiva se basa en dos componentes:
1. **Casos base**: valores que pertenecen al conjunto de forma inicial
2. **Reglas inductivas**: permiten construir nuevos elementos a partir de los existentes

Esta estructura garantiza que todo dato recursivo debe permitir volver al caso base mediante la aplicación sucesiva de las reglas inversas.

## Ejemplo: Números Pares

$$
\begin{align}
2 \in S \\
n \in S \therefore n+2 \in S
\end{align}
$$

## Ejemplo: Listas de Números Pares

$$
\begin{align}
'() \in LP \\
l \in LP \wedge n \in S \therefore n :: l \in LP
\end{align}
$$

De esta manera podemos construir los datos a partir de las reglas y podemos verificar si un dato pertenece a ese conjunto.

```scheme
#lang eopl

#|
Números pares
Caso base: 2 ∈ S
Regla inductiva: n ∈ S → n+2 ∈ S
|#

; in-S?: number -> boolean
; Verifica si un número pertenece al conjunto de números pares
; Utiliza recursión: restamos 2 hasta alcanzar el caso base (2) o determinar que no pertenece
(define in-S?
  (lambda (n)
    (cond
      [(= n 2) #T]                    ; Caso base: 2 es par
      [(< n 2) #F]                    ; Si es menor a 2, no es par positivo
      [else (in-S? (- n 2))]          ; Recursión: resta 2 y verifica nuevamente
      )))

(display "Números pares")
(newline)
(display (in-S? 10))  ; #T - 10 es par
(newline)
(display (in-S? 21))  ; #F - 21 es impar

; Lista de números pares
; in-L?: lista -> boolean
; Verifica si todos los elementos de una lista pertenecen al conjunto de pares
; Utiliza la función in-S? para validar cada elemento
(define in-L?
  (lambda (l)
    (cond
      [(null? l) #T]                  ; Caso base: lista vacía es válida
      [(pair? l)
       (and
        (in-S? (car l))               ; Verifica que el primer elemento sea par
        (in-L? (cdr l)))              ; Recursión: verifica el resto de la lista
       ]
      [else #F]                       ; Si no es lista, retorna falso
      )
    )
  )

(newline)
(display "Listas de números pares")
(newline)
(display (in-L? '(2 4 6 10 2 4 10)))  ; #T - todos son pares
(newline)
(display (in-L? '(2 4 6 1 10 12 14))) ; #F - contiene 1 que es impar
```

## Ejercicio: Listas de Tuplas con Restricciones

Indicar la regla para las listas de tuplas, cuyo primer elemento es par y el segundo es múltiplo de 3.

### Números Pares

$$
\begin{align}
2 \in P \\
n \in P \therefore n+2 \in P
\end{align}
$$

### Múltiplos de 3

$$
\begin{align}
3 \in T \\
n \in T \therefore n+3 \in T
\end{align}
$$

### Tuplas (a,b)

Donde $a$ es un número par y $b$ es múltiplo de 3:

$$
a \in P \wedge b \in T \implies (a,b) \in T_u
$$

### Lista de Tuplas

$$
\begin{align}
'() \in L \\
t \in T_u \wedge l \in L \therefore t :: l \in L
\end{align}
$$

## Funciones de Pertenencia

```scheme
#lang eopl

#|
Números pares
Caso base: 2 ∈ P
Regla inductiva: n ∈ P → n+2 ∈ P
|#

; in-P?: number -> boolean
; Verifica si un número pertenece al conjunto de números pares
; Estrategia recursiva: restar 2 hasta alcanzar el caso base
(define in-P?
  (lambda (n)
    (cond
      [(= n 2) #T]                    ; Caso base
      [(< n 2) #F]                    ; Números menores a 2 no son pares en este conjunto
      [else (in-P? (- n 2))]          ; Recursión: verifica n-2
      )))

#|
Múltiplos de 3
Caso base: 3 ∈ T
Regla inductiva: n ∈ T → n+3 ∈ T
|#

; in-T?: number -> boolean
; Verifica si un número pertenece al conjunto de múltiplos de 3
; Estrategia recursiva: restar 3 hasta alcanzar el caso base
(define in-T?
  (lambda (n)
    (cond
      [(= n 3) #T]                    ; Caso base
      [(< n 3) #F]                    ; Números menores a 3 no son múltiplos de 3 en este conjunto
      [else (in-T? (- n 3))]          ; Recursión: verifica n-3
      )))

#|
Tuplas
Verifica que el primer elemento (car) sea un número par
y que el segundo elemento (cadr) sea múltiplo de 3
|#

; in-Tu?: tupla -> boolean
; Verifica si una tupla (a,b) cumple: a ∈ P y b ∈ T
; Utiliza conjunción (and) para validar ambas condiciones
(define in-Tu?
  (lambda (t)
    (and
     (in-P? (car t))                  ; Verifica que el primer elemento sea par
     (in-T? (cadr t))                 ; Verifica que el segundo elemento sea múltiplo de 3
     )))

#|
Lista de tuplas válidas (a,b)
Caso base: '() ∈ L (lista vacía)
Regla inductiva: t ∈ Tu ∧ l ∈ L → t :: l ∈ L
|#

; in-L?: lista -> boolean
; Verifica si todas las tuplas en la lista cumplen las restricciones
; Procesa recursivamente cada tupla validándola con in-Tu?
(define in-L?
  (lambda (l)
    (cond
      [(null? l) #T]                  ; Caso base: lista vacía es válida
      [(pair? l)
       (and
        (in-Tu? (car l))              ; Verifica que la primera tupla sea válida
        (in-L? (cdr l)))              ; Recursión: verifica el resto de la lista
       ]
      [else #F]                       ; Si no es lista, retorna falso
      )
    )
  )

(newline)
(display "Lista de tuplas válidas: (2,3) (4,9) (100,81) (8,27)")
(newline)
(display (in-L? '((2 3) (4 9) (100 81) (8 27))))  ; #T - todas cumplen
(newline)
(display "Lista de tuplas con error: (2,3) (4,9) (100,81) (8,28)")
(newline)
(display (in-L? '((2 3) (4 9) (100 81) (8 28))))  ; #F - 28 no es múltiplo de 3
```

## Principios Clave de la Representación Inductiva

1. **Evalúan el caso base como verdadero**: Es el punto de parada de la recursión
2. **Usan la regla para devolverse hacia el caso base**: Mediante operaciones inversas se alcanza la base
3. **Todo dato recursivo debe permitir volver al caso base**: De lo contrario, la estructura no es válida inductivamente

![](attachments/Pasted%20image%2020260217090541.png)

## Tabla de Resumen

| Concepto | Definición | Ejemplo | Aplicación |
|----------|-----------|---------|-----------|
| **Caso Base** | Valor inicial que pertenece al conjunto sin necesidad de reglas | $2 \in P$, $'() \in L$ | Punto de parada de la recursión |
| **Regla Inductiva** | Regla que construye nuevos elementos a partir de los existentes | $n \in P \therefore n+2 \in P$ | Estructura de construcción recursiva |
| **Función de Pertenencia** | Función que verifica si un dato pertenece a un conjunto definido inductivamente | `in-P?`, `in-T?` | Validación de datos |
| **Predicado Compuesto** | Combinación de predicados con operadores lógicos | `in-Tu?` usa `and` | Validación de múltiples restricciones |
| **Recursión Estructural** | Recursión que sigue la estructura del dato | `in-L?` procesa listas | Procesar estructuras de datos complejas |
| **Conjunción Lógica** | Operador `and` que requiere que todas las condiciones sean verdaderas | Validar ambos elementos de tupla | Aplicar múltiples restricciones simultáneamente |

## Comentarios Adicionales

- La representación inductiva es fundamental en lenguajes funcionales y teoría de tipos, permitiendo definir tipos de datos algebraicos de forma rigurosa
- El esquema de recursión estructural garantiza terminación cuando sigue exactamente la estructura inductiva del dato
- Las funciones de pertenencia actúan como **reconocedores** del lenguaje definido por las reglas inductivas
- La eficiencia puede mejorarse usando técnicas como memoización o cálculo directo (por ejemplo, verificar paridad con módulo en lugar de resta iterativa)
- La representación inductiva es la base teórica de la validación de sintaxis en compiladores y procesamiento de estructuras de datos recursivas