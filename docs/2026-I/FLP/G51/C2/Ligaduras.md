# Ligaduras

En los lenguajes de programación, el concepto de variable es fundamental dado que son los elementos que nos permiten procesar información. Una **ligadura** (o binding) es la asociación entre un identificador (nombre de variable) y un valor o referencia en memoria.

Cada lenguaje tiene sus propias reglas de ligadura de variables:

1. **Java** le asigna un valor por defecto a las variables no inicializadas
2. **C++** utiliza lo que esté en memoria (comportamiento indefinido)
3. **Racket** falla si se requiere usar una variable sin que esté ligada

Para crear ligaduras en Racket, disponemos de las siguientes formas:

```scheme
(lambda (x y) ....)              ; Ligaduras de parámetros
(let
	(
		(x ...)
		(y ...)
	)
	....x...y....                ; Ligaduras locales
)
```

Ambas formas crean las ligaduras `x` e `y`, asociando identificadores a valores.

## Concepto: Ocurrencia Libre

En los lenguajes de programación es importante determinar si una ligadura o variable tiene un valor asociado. Esto es crucial para realizar la compilación o interpretación del código correctamente. En particular, para el **cálculo lambda** (expresiones lambda), necesitamos identificar qué variables ocurren **libres**, es decir, sin estar ligadas por ningún `lambda` circundante.

Una variable ocurre **libre** en una expresión cuando aparece en la expresión pero no está ligada por ningún operador lambda que la encierre. Por el contrario, una variable ocurre **ligada** cuando está dentro del alcance (scope) de un `lambda` que la declara como parámetro.

### Definición Formal

Consideremos la siguiente gramática BNF para expresiones de cálculo lambda:

```ebnf
<lc-exp> ::= <identifier>
         ::= ("lambda" (<identifier>) <lc-exp>)
         ::= (<lc-exp> <lc-exp>)
```

Una variable `x` ocurre libre en una expresión `exp` si y solo si:

1. **Caso 1 (Variable)**: `exp` es un identificador y es igual a `x`
2. **Caso 2 (Abstracción Lambda)**: `exp` es una expresión de la forma `(lambda (y) exp')`, donde `y` es distinto de `x` y `x` ocurre libre en `exp'`
3. **Caso 3 (Aplicación)**: `exp` es una expresión de la forma `(exp1 exp2)`, donde `x` ocurre libre en `exp1` o en `exp2` (o en ambas)

### Ejemplos de Ocurrencia Libre

- En `(lambda (x) x)`, la variable `x` **no ocurre libre** (está ligada por el `lambda`)
- En `(lambda (x) y)`, la variable `y` **ocurre libre** (no hay `lambda` que la declare)
- En `((lambda (x) y) x)`, la variable `y` **ocurre libre** en la primera subexpresión, pero la segunda `x` también **ocurre libre** (aunque hay un `lambda (x)`, esa ligadura solo afecta al cuerpo del `lambda`)

```scheme
#lang eopl

#|
Gramática BNF para expresiones de cálculo lambda:
<lc-exp> ::= <identifier>
         ::= ("lambda" (<identifier>) <lc-exp>)
         ::= (<lc-exp> <lc-exp>)

Las tres alternativas representan:
1. Identificador: una variable simple
2. Abstracción: una función lambda
3. Aplicación: aplicación de una función a un argumento
|#

; occurs-free?: lc-exp → identificador → booleano
; Determina si una variable ocurre libre en una expresión de cálculo lambda.
;
; Una variable ocurre libre si:
; - Caso 1: Es un identificador y coincide con la variable buscada
; - Caso 2: Está en el cuerpo de un lambda, pero no es el parámetro del lambda
; - Caso 3: Ocurre libre en cualquiera de las dos subexpresiones de una aplicación
;
; Parámetros:
;   exp: la expresión de cálculo lambda a analizar
;   var: el identificador que buscamos que ocurra libre
(define occurs-free?
  (lambda (exp var)
    (cond
      ; Caso 1: exp es un identificador (símbolo)
      ; Ocurre libre si es exactamente la variable buscada
      [(symbol? exp) (equal? exp var)]
      
      ; Caso 2: exp es una abstracción lambda de la forma (lambda (param) body)
      ; Accedemos al parámetro con (caadr exp) y al cuerpo con (caddr exp)
      ; La variable ocurre libre en el cuerpo si:
      ;   - El parámetro lambda es distinto de la variable buscada (no está ligada), Y
      ;   - La variable ocurre libre recursivamente en el cuerpo
      [(equal? (car exp) 'lambda)
       (and
        (not (equal? (caadr exp) var))              ; El parámetro no puede ligar la variable
        (occurs-free? (caddr exp) var))]            ; Verifica ocurrencia en el cuerpo
      
      ; Caso 3: exp es una aplicación de la forma (func arg)
      ; La variable ocurre libre si ocurre libre en la función O en el argumento
      [else
       (or
        (occurs-free? (car exp) var)                ; Verifica función
        (occurs-free? (cadr exp) var))]             ; Verifica argumento
      )
    )
  )

; Pruebas para explorar ocurrencia libre

(newline)
(display "=== Pruebas con variable 'x' ===")
(newline)

; (lambda (x) (lambda (y) x))
; x está ligada por el lambda externo, NO ocurre libre
(display "Test 1: (lambda (x) (lambda (y) x)) busca x: ")
(display (occurs-free? '(lambda (x) (lambda (y) x)) 'x))
(newline)

; ((lambda (z) (lambda (y) x)) x)
; La primera x (en el cuerpo del lambda) está ligada
; La segunda x (argumento) está LIBRE
(display "Test 2: ((lambda (z) (lambda (y) x)) x) busca x: ")
(display (occurs-free? '((lambda (z) (lambda (y) x)) x) 'x))
(newline)

; ((lambda (y) (lambda (y) x)) ((lambda (z) x) x))
; Hay dos x libres: una en (lambda (z) x) y otra como argumento final
(display "Test 3: ((lambda (y) (lambda (y) x)) ((lambda (z) x) x)) busca x: ")
(display (occurs-free? '((lambda (y) (lambda (y) x)) ((lambda (z) x) x)) 'x))
(newline)

(newline)
(display "=== Pruebas con variable 'y' ===")
(newline)

; (lambda (x) (lambda (y) x))
; y está ligada por el lambda interno, NO ocurre libre
(display "Test 4: (lambda (x) (lambda (y) x)) busca y: ")
(display (occurs-free? '(lambda (x) (lambda (y) x)) 'y))
(newline)

; ((lambda (z) (lambda (y) x)) x)
; No hay ninguna y libre (la única y está ligada)
(display "Test 5: ((lambda (z) (lambda (y) x)) x) busca y: ")
(display (occurs-free? '((lambda (z) (lambda (y) x)) x) 'y))
(newline)

; ((lambda (y) (lambda (y) x)) ((lambda (z) x) x))
; Ambos lambda tienen parámetro y, no hay y libre
(display "Test 6: ((lambda (y) (lambda (y) x)) ((lambda (z) x) x)) busca y: ")
(display (occurs-free? '((lambda (y) (lambda (y) x)) ((lambda (z) x) x)) 'y))
(newline)

(newline)
(display "=== Pruebas con variable 'z' ===")
(newline)

; (lambda (x) (lambda (y) x))
; No hay ninguna z
(display "Test 7: (lambda (x) (lambda (y) x)) busca z: ")
(display (occurs-free? '(lambda (x) (lambda (y) x)) 'z))
(newline)

; ((lambda (z) (lambda (y) x)) x)
; z está ligada por el lambda, NO ocurre libre
(display "Test 8: ((lambda (z) (lambda (y) x)) x) busca z: ")
(display (occurs-free? '((lambda (z) (lambda (y) x)) x) 'z))
(newline)

; ((lambda (y) (lambda (y) x)) ((lambda (z) x) x))
; z está ligada por su lambda, NO ocurre libre
(display "Test 9: ((lambda (y) (lambda (y) x)) ((lambda (z) x) x)) busca z: ")
(display (occurs-free? '((lambda (y) (lambda (y) x)) ((lambda (z) x) x)) 'z))
(newline)
```

## Importancia de las Ligaduras en Compilación

Los lenguajes de programación tienen reglas específicas para ligar o declarar variables libres. Esto permite que en **tiempo de compilación** se determine:

- Qué acciones realizar para cada variable
- Si hay variables no declaradas (error)
- Dónde almacenar valores (stack, heap, closure)
- Cómo acceder a variables en diferentes ámbitos (scoping)

---

## Tabla de Resumen

| Concepto | Definición | Características | Ejemplo |
|----------|-----------|-----------------|---------|
| **Ligadura (Binding)** | Asociación entre un identificador y un valor o referencia en memoria | Fundamental para el procesamiento de información en programas | `(lambda (x) ...)` liga `x` |
| **Variable** | Identificador que representa un valor o referencia | Puede estar ligada o libre dependiendo del contexto | `x`, `y`, `z` |
| **Ocurrencia Libre** | Aparición de una variable no ligada por ningún operador lambda circundante | Indica que la variable debe obtenerse de un ámbito externo | `x` en `(lambda (y) x)` |
| **Ocurrencia Ligada** | Aparición de una variable dentro del alcance de un lambda que la declara | La variable tiene un valor definido en ese contexto local | `x` en `(lambda (x) x)` |
| **Alcance (Scope)** | Región del código donde una ligadura es válida y accesible | Determina qué variables son visibles en cada punto del programa | Cuerpo de un `lambda` |
| **Abstracción Lambda** | Expresión de la forma `(lambda (param) body)` que define una función anónima | Crea una nueva ligadura para el parámetro en el cuerpo | `(lambda (x) (+ x 1))` |
| **Aplicación** | Expresión de la forma `(func arg)` que aplica una función a un argumento | Evalúa la función y el argumento, ligando parámetros a argumentos | `((lambda (x) x) 5)` |
| **Identificador** | Nombre de una variable o parámetro | Terminal en la gramática de expresiones lambda | `x`, `y`, `suma` |
| **Cálculo Lambda** | Sistema formal para definir funciones y aplicaciones basado en abstracción | Base teórica de muchos lenguajes de programación funcionales | Expresiones `<lc-exp>` |
| **Sombreamiento (Shadowing)** | Cuando una ligadura interna oculta una ligadura externa del mismo nombre | Puede causar confusiones; el identificador se refiere a la ligadura más interna | `(lambda (x) (lambda (x) x))` |
| **Variable Libre Capturada** | Variable libre que queda dentro del alcance de un lambda creado posteriormente | Importante para closures y captura de ambiente | Variable exterior accedida por una función interna |
| **Análisis de Ocurrencia Libre** | Proceso de identificar qué variables ocurren libres en una expresión | Necesario para compilación, optimización e interpretación correctas | Función `occurs-free?` |

### Comentarios Adicionales

- **Diferencia entre Lenguajes**: La forma en que diferentes lenguajes manejan variables no ligadas refleja sus filosofías de diseño. Lenguajes como Racket priorizan la seguridad al fallar explícitamente, mientras que C++ prioriza el rendimiento permitiendo comportamiento indefinido.

- **Closures**: Un closure es una función que "captura" variables libres de su ambiente. Cuando una función se define en un contexto donde hay variables libres, esas variables quedan ligadas en el closure. Por ejemplo, `(let ((x 5)) (lambda () x))` crea un closure que captura `x`.

- **Sombreamiento (Shadowing)**: El caso `(lambda (x) (lambda (x) x))` es un ejemplo de sombreamiento. La `x` interior oculta la exterior. Al analizar ocurrencia libre, el `x` más interno se refiere al parámetro más cercano.

- **Relación con Semántica**: El análisis de ocurrencia libre es un paso previo fundamental para la interpretación o compilación. Sin saber qué variables son libres, no se puede determinar cómo acceder a sus valores en tiempo de ejecución.

- **Complejidad**: El análisis de ocurrencia libre es lineal en el tamaño de la expresión lambda. Cada subexpresión se visita exactamente una vez.

- **Aplicaciones Prácticas**:
  - **Compiladores**: determinan qué variables necesitan ser capturadas en closures
  - **Intérpretes**: saben dónde buscar el valor de una variable (ámbito local o global)
  - **Análisis Estático**: detectan variables no declaradas o no utilizadas
  - **Optimizaciones**: pueden inlinar funciones sin variables libres sin cambiar el comportamiento

- **Extensión a Ligaduras Múltiples**: El código presentado maneja un parámetro por lambda. En lenguajes reales, a menudo hay múltiples parámetros: `(lambda (x y z) ...)`. El análisis se extiende de forma natural verificando que la variable no esté en la lista de parámetros.