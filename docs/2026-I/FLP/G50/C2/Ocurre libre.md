# Ocurrencia Libre en Cálculo Lambda

## Concepto Fundamental

En cálculo lambda, una variable **ocurre libre** en una expresión si aparece sin estar vinculada por ninguna abstracción lambda. Una variable está **vinculada** si se encuentra dentro del cuerpo de una abstracción lambda que la declara como parámetro.

### Definición Formal

Sea $x$ una variable y $e$ una expresión lambda. Decimos que $x$ ocurre libre en $e$ si:

1. **Caso 1**: $e = x$ (la expresión es la variable misma)
2. **Caso 2**: $e = \lambda y. e'$ donde $x \neq y$ y $x$ ocurre libre en $e'$ (la variable no está vinculada por esta abstracción)
3. **Caso 3**: $e = (e_1 \, e_2)$ donde $x$ ocurre libre en $e_1$ o en $e_2$ (la variable aparece en alguno de los operandos)

### Ejemplos Intuitivos

- En $\lambda x. x$: la variable $x$ **no ocurre libre** (está vinculada por $\lambda x$)
- En $\lambda x. (\lambda y. x)$: la variable $x$ **no ocurre libre** en la expresión completa (vinculada por el primer $\lambda$)
- En $\lambda y. x$: la variable $x$ **ocurre libre** (no está vinculada)
- En $(\lambda z. z) \, x$: la variable $x$ **ocurre libre** (aparece en la aplicación)

## Procedimiento

Dada una expresión en cálculo lambda de la forma:

```ebnf
<lc-exp> ::= <identifier>
           ::= ("lambda" (<identifier>) <lc-exp>)
           ::= (<lc-exp> <lc-exp>)
```

El procedimiento para determinar si una variable ocurre libre es:

1. **Si es caso 1** (identificador): la variable ocurre libre solo si es igual al identificador
2. **Si es caso 2** (abstracción lambda): la variable ocurre libre solo si es diferente del parámetro y ocurre libre en el cuerpo
3. **Si es caso 3** (aplicación): la variable ocurre libre si ocurre libre en el operador o en el operando

```scheme
#lang eopl

#|
Gramática para expresiones de cálculo lambda
<lc-exp> ::= <identifier>
           ::= ("lambda" (<identifier>) <lc-exp>)
           ::= (<lc-exp> <lc-exp>)

Análisis de ocurrencia libre de variables:

1. Caso 1 - Identificador: x ocurre libre en x trivialmente
2. Caso 2 - Abstracción lambda: x ocurre libre en (lambda (y) e)
   si y solo si x ≠ y y x ocurre libre en e
   La abstracción vincula la variable y, por lo que si x = y, 
   entonces x no ocurre libre en la expresión
3. Caso 3 - Aplicación: x ocurre libre en (e1 e2)
   si y solo si x ocurre libre en e1 o en e2

Ejemplo:
- (lambda (x) x): x no ocurre libre (está vinculada)
- (lambda (x) y): y ocurre libre (x está vinculada, pero y no)
- ((lambda (x) x) y): y ocurre libre (aparece como argumento)
|#

; occurs-free?: lc-exp variable -> boolean
; Determina si una variable ocurre libre en una expresión lambda
; Implementa recursión estructural siguiendo los tres casos de la gramática
(define occurs-free?
  (lambda (exp var)
    (cond
      [(symbol? exp)                              ; Caso 1: la expresión es un identificador
       (equal? exp var)]                          ; Ocurre libre si es igual a la variable buscada
      
      [(equal? (car exp) 'lambda)                 ; Caso 2: abstracción lambda (lambda (param) body)
       (and
        (not (equal? (caadr exp) var))            ; La variable NO debe ser el parámetro de lambda
        (occurs-free? (caddr exp) var))]          ; Y debe ocurrir libre en el cuerpo de la abstracción
      
      [else                                       ; Caso 3: aplicación (e1 e2)
       (or
        (occurs-free? (car exp) var)              ; Ocurre libre si aparece en el operador
        (occurs-free? (cadr exp) var))])))        ; O en el operando

#|
Regla de oro en programación recursiva sobre cálculo lambda:
Cada vez que se encuentra una <lc-exp> en la gramática,
se realiza una llamada recursiva a la función con esa subexpresión.
Esto garantiza que la recursión sigue la estructura del dato.

Nota sobre la implementación:
Actualmente usamos representación con listas (Scheme).
A medida que avancemos, esta representación será reemplazada
por estructuras de datos más especializadas (definidas con define-datatype
en EOPL) para mayor claridad y seguridad de tipos.
|#

(newline)
(display "Ejemplos de ocurrencia libre")
(newline)

; Expresión 1: (lambda (x) (lambda (y) x))
; Estructura: una abstracción que define x, cuyo cuerpo contiene otra abstracción
; Pregunta: ¿ocurre libre 'x'?
; Respuesta: NO, porque x está vinculada por el primer lambda
(define exp1 '(lambda (x) (lambda (y) x)))
(display "exp1 = (lambda (x) (lambda (y) x))")
(newline)
(display "¿Ocurre libre 'x'? ")
(display (occurs-free? exp1 'x))                  ; #F
(newline)
(display "¿Ocurre libre 'y'? ")
(display (occurs-free? exp1 'y))                  ; #F
(newline)

; Expresión 2: ((lambda (z) (lambda (y) x)) x)
; Estructura: una aplicación donde el operador es una abstracción
; y el operando es la variable x
; Pregunta: ¿ocurre libre 'x'?
; Respuesta: SÍ, porque aparece como argumento en la aplicación
(define exp2 '((lambda (z) (lambda (y) x)) x))
(display "exp2 = ((lambda (z) (lambda (y) x)) x)")
(newline)
(display "¿Ocurre libre 'x'? ")
(display (occurs-free? exp2 'x))                  ; #T
(newline)
(display "¿Ocurre libre 'z'? ")
(display (occurs-free? exp2 'z))                  ; #F
(newline)

; Expresión 3: (lambda (y) (lambda (y) x))
; Estructura: anidamiento de abstracciones con el mismo parámetro
; Pregunta: ¿ocurre libre 'x'?
; Respuesta: SÍ, porque x nunca está vinculada por ningún lambda
(define exp3 '(lambda (y) (lambda (y) x)))
(display "exp3 = (lambda (y) (lambda (y) x))")
(newline)
(display "¿Ocurre libre 'x'? ")
(display (occurs-free? exp3 'x))                  ; #T
(newline)
(display "¿Ocurre libre 'y'? ")
(display (occurs-free? exp3 'y))                  ; #F
(newline)

; Expresión 4: (lambda (x) (lambda (y) (x y)))
; Estructura: dos abstracciones anidadas con aplicación en el cuerpo
; Pregunta: ¿ocurre libre 'x'?
; Respuesta: NO, x está vinculada por el primer lambda
(define exp4 '(lambda (x) (lambda (y) (x y))))
(display "exp4 = (lambda (x) (lambda (y) (x y))))")
(newline)
(display "¿Ocurre libre 'x'? ")
(display (occurs-free? exp4 'x))                  ; #F
(newline)
(display "¿Ocurre libre 'y'? ")
(display (occurs-free? exp4 'y))                  ; #F
(newline)

; Expresión 5: ((lambda (x) (y z)) w)
; Estructura: aplicación donde el operador es una abstracción
; Pregunta: ¿ocurren libres 'y' y 'z'?
; Respuesta: SÍ, ambas aparecen en el cuerpo de lambda sin estar vinculadas
(define exp5 '((lambda (x) (y z)) w))
(display "exp5 = ((lambda (x) (y z)) w)")
(newline)
(display "¿Ocurre libre 'y'? ")
(display (occurs-free? exp5 'y))                  ; #T
(newline)
(display "¿Ocurre libre 'z'? ")
(display (occurs-free? exp5 'z))                  ; #T
(newline)
(display "¿Ocurre libre 'w'? ")
(display (occurs-free? exp5 'w))                  ; #T
(newline)
```

## Conceptos Relacionados

### Variables Vinculadas vs. Libres

- **Variable vinculada**: Aparece dentro del cuerpo de una abstracción lambda que la declara como parámetro
- **Variable libre**: Aparece en una expresión sin estar vinculada por ninguna abstracción lambda

### Scope y Shadowing

El **scope** de una variable en una abstracción $\lambda x. e$ es el cuerpo $e$. Cuando se tienen abstracciones anidadas con el mismo nombre de parámetro, ocurre **shadowing** (ocultamiento): la abstracción más interna oculta la más externa.

```scheme
; Ejemplo de shadowing
; (lambda (x) (lambda (x) x))
; El x interno oculta el x externo
; Por lo tanto, x no ocurre libre en la expresión completa
```

### Sustitución y Captura de Variables

La noción de ocurrencia libre es crucial para operaciones de **sustitución** en cálculo lambda. Al sustituir una variable por una expresión, solo se reemplazan las ocurrencias libres. Si no se tiene cuidado, puede ocurrir **captura de variables** donde variables libres se vuelven vinculadas inadvertidamente.

## Tabla de Resumen

| Concepto | Definición | Ejemplo | Importancia |
|----------|-----------|---------|-------------|
| **Ocurrencia Libre** | Variable que aparece sin estar vinculada por ninguna abstracción lambda | $x$ en $\lambda y. x$ | Fundamental en semántica de cálculo lambda |
| **Variable Vinculada** | Variable que aparece dentro del cuerpo de una abstracción que la declara | $x$ en $\lambda x. x$ | Distingue variables propias vs. externas |
| **Abstracción Lambda** | Expresión de la forma $\lambda x. e$ que define una función anónima | `(lambda (x) (+ x 1))` | Mecanismo de abstracción funcional |
| **Aplicación** | Expresión de la forma $(e_1 \, e_2)$ que aplica una función a un argumento | `((lambda (x) x) 5)` | Mecanismo de evaluación |
| **Parámetro** | Variable declarada en una abstracción lambda | $x$ en $\lambda x. e$ | Vincula todas las ocurrencias libres en el cuerpo |
| **Cuerpo** | Expresión que sigue al parámetro en una abstracción | $e$ en $\lambda x. e$ | Contexto donde el parámetro puede ocurrir vinculado |
| **Scope** | Región de una expresión donde una variable tiene significado | Cuerpo de $\lambda x$ | Define el alcance de una declaración |
| **Shadowing** | Ocultamiento de una variable externa por otra con el mismo nombre | $\lambda x.$ $(\lambda x. x)$ | Puede causar confusión; variable interna oculta la externa |
| **Sustitución** | Reemplazo de variables libres por expresiones | $[x := y]$ en $(x+1)$ | Operación fundamental en evaluación |
| **Captura de Variables** | Error donde una sustitución vincula inadvertidamente variables libres | Sustituir $x$ por $y$ en $\lambda y. x$ | Debe evitarse mediante renombrado |
| **Recursión Estructural** | Seguir la estructura de la gramática en la implementación | `cond` con tres casos | Garantiza cobertura y terminación |
| **Variable Global vs. Local** | Global es libre; local es vinculada | Variable externa vs. parámetro lambda | Concepto análogo a lenguajes imperativos |

## Comentarios Adicionales

- La **noción de ocurrencia libre** es central en cálculo lambda y teoría de lenguajes de programación, siendo la base para entender scoping en cualquier lenguaje de programación
- La **implementación recursiva** refleja exactamente la definición matemática, demostrando la correspondencia entre teoría y práctica
- La **captura de variables** es un error sutil pero grave en compiladores y sistemas de reescritura; muchos lenguajes (como Lisp con Scheme) usan **lexical scoping** para evitarlo
- El **shadowing** es válido en cálculo lambda pero puede ser confuso; algunos lenguajes lo prohíben o lo advierten
- Las **ocurrencias libres** determinan qué variables externas necesita una función para ser evaluada, concepto análogo a las **variables de entorno** (closures)
- La **sustitución segura** requiere: (1) identificar ocurrencias libres, (2) evitar captura mediante renombrado (alpha-conversion), y (3) reemplazar únicamente las ocurrencias libres
- La **composición de funciones** en cálculo lambda solo funciona correctamente cuando se comprenden las ocurrencias libres de cada componente
- La **eta-equivalencia** (que $\lambda x. f \, x$ es equivalente a $f$ si $x$ no ocurre libre en $f$) es una optimización importante basada en este concepto
- Los **verificadores de tipos** en lenguajes funcionales modernos utilizan análisis de ocurrencias libres para inferencia de tipos y detección de errores