# Alcance de Variables

## Concepto Fundamental

El alcance (scope) de una variable indica cómo están referenciadas las variables en el código. Define la región del programa donde una variable es accesible y puede ser utilizada. El alcance es determinado por las ligaduras (bindings) establecidas mediante abstracciones lambda y formas especiales como `let`, `let*` y `letrec`.

### Scoping Léxico vs. Dinámico

En Scheme se utiliza **scoping léxico** (lexical scoping), donde el alcance está determinado por la estructura textual del código. Una variable es accesible en la región definida por su ligadura y todos sus subexpresos anidados, excepto donde sea ocultada por otra ligadura con el mismo nombre.

```scheme
; Ejemplo de alcance léxico
(lambda (x)                          ; x1 se introduce aquí
  (+ (lambda (x)                     ; x2 se introduce aquí (oculta x1)
       (+ x 3))                      ; referencia a x2
     x))                             ; referencia a x1
```

En este ejemplo, la primera referencia a `x` dentro de la abstracción interna se refiere a `x2`, mientras que la segunda referencia se refiere a `x1` porque está fuera del alcance de la abstracción interna.

---

## Let: Ligaduras Locales No Anidadas

La forma especial `let` permite definir múltiples ligaduras (bindings) locales en un único bloque. Todas las ligaduras comienzan a existir simultáneamente después de la evaluación de las expresiones de inicialización y están disponibles en el cuerpo de la expresión `let`.

### Sintaxis

```scheme
(let
  (
    ; Área de definiciones: lista de pares (identificador valor)
    (<identificador1> <expresión1>)
    (<identificador2> <expresión2>)
    ...
  )
  <expresión-cuerpo>  ; Las variables están disponibles aquí
)
```

### Semántica

El `let` es equivalente a:

```scheme
((lambda (<identificador1> <identificador2> ...)
   <expresión-cuerpo>)
 <expresión1>
 <expresión2>
 ...)
```

Las expresiones de inicialización se evalúan en el entorno **anterior** a la creación de las ligaduras, por lo que las variables no se conocen entre ellas.

### Ejemplo Básico

```scheme
#lang eopl

; Uso simple de let
; Las variables x e y se crean con valores 10 y 20 respectivamente
; y están disponibles en el cuerpo (+ x y)
(let
  (
    (x 10)                           ; Crea variable x con valor 10
    (y 20)                           ; Crea variable y con valor 20
  )
  (+ x y))                           ; Retorna 30

(newline)
(display "Resultado let simple: ")
(display (let ((x 10) (y 20)) (+ x y)))
(newline)
```

### Limitación: Variables No Se Conocen Entre Sí

Una característica importante de `let` es que **las variables no son visibles entre ellas durante su inicialización**. Las expresiones de inicialización se evalúan en el entorno externo, no en el entorno donde se están creando las nuevas ligaduras.

```scheme
; Error: x no existe al evaluar y
; Intenta evaluar (y x) pero x aún no está ligada
(let
  (
    (x 10)                           ; x se define
    (y x)                            ; ERROR: x no existe en este contexto
  )
  (+ x y))

(newline)
(display "Intento con variable indefinida en let")
(newline)

; Alternativa correcta: usar el valor directamente
(let
  (
    (x 10)
    (y 20)                           ; Usa valor directo, no referencia a x
  )
  (+ x y))                           ; Retorna 30
```

---

## Let*: Ligaduras Locales Anidadas Secuenciales

La forma especial `let*` permite que cada ligadura sea visible en las inicializaciones de las ligaduras siguientes. Esto emula el comportamiento **secuencial** de los lenguajes imperativos, donde las variables se crean una por una y cada nueva variable puede referenciar a las anteriores.

### Sintaxis

```scheme
(let*
  (
    (<identificador1> <expresión1>)
    (<identificador2> <expresión2>)  ; Puede referenciar a identificador1
    (<identificador3> <expresión3>)  ; Puede referenciar a identificador1 e identificador2
    ...
  )
  <expresión-cuerpo>                  ; Todas las variables están disponibles
)
```

### Semántica

El `let*` es equivalente a `let` anidados:

```scheme
(let ((x1 e1))
  (let ((x2 e2))
    (let ((x3 e3))
      ...)))
```

### Ejemplo Comparativo

```scheme
; Comparación entre let y let*
(let
  (
    (x 10)
    (y 20)
    (z 30)
  )
  ; Dentro de este let, x=10, y=20, z=30
  (let*
    (
      (x z)                          ; x toma el valor de z del entorno externo = 30
      (y x)                          ; y toma el valor de x (recién asignado) = 30
      (z y)                          ; z toma el valor de y (recién asignado) = 30
    )
    (+ x y z))                       ; Retorna 90 (30 + 30 + 30)
  )
)

(newline)
(display "let* con secuencialidad: ")
(display
  (let
    (
      (x 10)
      (y 20)
      (z 30)
    )
    (let*
      (
        (x z)                        ; x := 30 (valor de z del entorno externo)
        (y x)                        ; y := 30 (nuevo valor de x)
        (z y)                        ; z := 30 (nuevo valor de y)
      )
      (+ x y z))))                   ; 30 + 30 + 30 = 90

(newline)

; Ejemplo que muestra la diferencia clara entre let y let*
(display "Diferencia let vs let*")
(newline)

; Con let: y no puede ver x
; (let ((x 5) (y x)) ...) -> ERROR

; Con let*: y puede ver x
(display "Con let*: ")
(display (let* ((x 5) (y (+ x 10))) (+ x y)))  ; 5 + 15 = 20
(newline)
```

### Casos de Uso

`let*` es útil cuando necesitas:
- Calcular valores que dependan de variables previamente definidas
- Emular el flujo secuencial típico de lenguajes imperativos
- Evitar anidar múltiples abstracciones lambda para legibilidad

---

## Letrec: Ligaduras Recursivas

La forma especial `letrec` permite que las ligaduras se **referencien entre sí**, incluyendo referencias circulares. Esto es esencial para definir funciones mutuamente recursivas dentro de un bloque local.

### Sintaxis

```scheme
(letrec
  (
    (<identificador1> <expresión1>)
    (<identificador2> <expresión2>)
    ...
  )
  <expresión-cuerpo>                  ; Todas las variables se conocen entre sí
)
```

### Semántica

`letrec` implementa un **fixed-point combinator** implícitamente. Las ligaduras se crean como variables "no inicializadas" primero, luego se evalúan las expresiones en un entorno que ya contiene todas las ligaduras. Esto permite recursión y referencias mutuas.

### Ejemplo: Recursión Simple

```scheme
; Función que calcula la suma de enteros desde n hasta 0
; Esta función se llama a sí misma (recursión directa)
(letrec
  (
    (suma-hasta
      (lambda (n)
        (if (<= n 0)
          0                          ; Caso base: suma de 0 es 0
          (+ n (suma-hasta (- n 1))) ; Caso recursivo: n + suma(n-1)
        )
      )
    )
  )
  (suma-hasta 10))                   ; Calcula 10+9+8+...+1 = 55

(newline)
(display "Suma recursiva desde 10 hasta 0: ")
(display
  (letrec
    (
      (suma-hasta
        (lambda (n)
          (if (<= n 0)
            0
            (+ n (suma-hasta (- n 1)))
          )
        )
      )
    )
    (suma-hasta 10)))                ; Resultado: 55

(newline)
```

### Ejemplo: Recursión Mutua

```scheme
; Dos funciones que se llaman mutuamente
; par?: verifica si n es par (0 es par)
; impar?: verifica si n es impar (0 no es impar)
(letrec
  (
    (es-par?
      (lambda (n)
        (if (= n 0)
          #T                         ; Base: 0 es par
          (es-impar? (- n 1))        ; Llama a es-impar? con n-1
        )
      )
    )
    (es-impar?
      (lambda (n)
        (if (= n 0)
          #F                         ; Base: 0 no es impar
          (es-par? (- n 1))          ; Llama a es-par? con n-1
        )
      )
    )
  )
  (es-par? 5))                       ; Verifica si 5 es par (retorna #F)

(newline)
(display "¿Es 5 par? ")
(display
  (letrec
    (
      (es-par?
        (lambda (n)
          (if (= n 0) #T (es-impar? (- n 1)))))
      (es-impar?
        (lambda (n)
          (if (= n 0) #F (es-par? (- n 1)))))
    )
    (es-par? 5)))                    ; #F
(newline)

(display "¿Es 6 par? ")
(display
  (letrec
    (
      (es-par?
        (lambda (n)
          (if (= n 0) #T (es-impar? (- n 1)))))
      (es-impar?
        (lambda (n)
          (if (= n 0) #F (es-par? (- n 1)))))
    )
    (es-par? 6)))                    ; #T
(newline)
```

### Advertencia: Abrazo Mortal (Deadlock)

Cuando se usan `letrec` con valores (no funciones), puede ocurrir un **abrazo mortal** (circular dependency): si dos o más ligaduras se referencian mutuamente sin poder converger a un valor base, la evaluación nunca termina o genera un error.

```scheme
; PELIGRO: Abrazo mortal
; x intenta referenciar y, pero y no está inicializado
; y intenta referenciar x, pero x no está inicializado
; Esto causa un error o loop infinito

#|
(letrec
  (
    (x y)                            ; x espera que y exista
    (y x)                            ; y espera que x exista
  )
  (+ x y))                           ; NUNCA se alcanza
|#

; Esto produciría un error: variables sin valor definido
```

**Norma**: Use `letrec` solo cuando las ligaduras sean **funciones** o cuando pueda garantizar que la evaluación convergerá a un valor base. Evite referencias circulares entre valores.

---

## Tabla de Resumen

| Concepto | Sintaxis | Visibilidad Entre Variables | Caso de Uso | Equivalencia |
|----------|----------|----------------------------|------------|-------------|
| **Let** | `(let ((var val) ...) body)` | No se conocen en inicialización | Ligaduras simples e independientes | Lambda anidado simple |
| **Let*** | `(let* ((var val) ...) body)` | Cada variable ve las anteriores | Cálculos secuenciales dependientes | Lambdas anidadas múltiples |
| **Letrec** | `(letrec ((var val) ...) body)` | Todas se conocen mutuamente | Recursión directa y mutua | Fixed-point combinador implícito |
| **Scoping Léxico** | Estructura textual determina alcance | Variables accesibles en subexpresos anidados | Determinación estática de referencias | Análogo a scoping en C/Java |
| **Variable Libre** | Variable no ligada en contexto local | Referencia al entorno externo | Closures y captura de variables | Parámetro de lambda |
| **Variable Ligada** | Variable declarada en let/lambda | Accesible en cuerpo de declaración | Almacenamiento de valores locales | Variable local |
| **Shadowing** | Nombre igual en scopes anidados | Variable interna oculta la externa | Reasignación controlada | Nuevo binding más específico |
| **Recursión Directa** | Función llama a sí misma | Requiere letrec para referencia circular | Cálculos iterativos funcionales | Factorial, suma, fibonacci |
| **Recursión Mutua** | Múltiples funciones se llaman entre sí | Requiere letrec para referencias mutuas | Autómatas, parsing, semántica | Funciones es-par?/es-impar? |
| **Abrazo Mortal** | Referencias circulares sin base | Ciclo sin punto de parada | Debe evitarse en valores | Infinite loop o error |

---

## Comentarios Adicionales

- **Scoping léxico vs. dinámico**: Scheme usa scoping léxico (como la mayoría de lenguajes modernos). El scoping dinámico (usado en Lisp antiguo y bash) resuelve variables en tiempo de ejecución según la pila de llamadas, lo cual es más confuso y propenso a errores

- **Closures**: Una función es una **closure** cuando captura variables libres de su entorno circundante. Scheme crea closures automáticamente, permitiendo implementar patrones avanzados como memoización y factory functions

- **Equivalencia de formas**: 
  - `let` se expande a `(lambda ...)` simple
  - `let*` se expande a `let` anidados
  - `letrec` utiliza un mecanismo especial de fixed-point, imposible de implementar con lambda simple en Scheme puro

- **Diferencia conceptual clave**: `let` es **paralelo** (todas las inicializaciones son independientes), `let*` es **secuencial** (cada inicialización depende de las anteriores), `letrec` es **circular** (permite referencias mutuas)

- **Eficiencia**: `let` es potencialmente más eficiente que `let*` porque el compilador sabe que no hay dependencias entre ligaduras y puede optimizar mejor

- **Orden de evaluación**: En `let`, el orden de evaluación de las expresiones de inicialización no está garantizado (aunque en EOPL es de izquierda a derecha). En `let*`, el orden está garantizado secuencialmente de izquierda a derecha

- **Mutabilidad y letrec**: `letrec` es especialmente útil con funciones porque las funciones son valores que no cambian. Con variables mutables (`set!`), la semántica puede ser más compleja

- **Análisis estático**: Los compiladores pueden determinar el scope de todas las variables en tiempo de compilación (análisis estático) gracias al scoping léxico, permitiendo optimizaciones y detección de errores temprana

- **Comparación con lenguajes imperativos**: `let` es como declarar variables locales en un bloque; `let*` emula la semántica de asignación secuencial; `letrec` emula funciones mutuamente recursivas (como en C con declaraciones forward)