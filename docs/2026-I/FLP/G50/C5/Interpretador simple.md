# Intérprete Simple

## Componentes del intérprete simple

1. **Valores expresados**: Son los que se dan como respuesta final (números).
2. **Valores denotados**: Son los que se almacenan en los ambientes (asociaciones variable-valor).

## Especificación léxica del intérprete simple

1. **Comentarios**: Inician con `%` y continúan hasta el final de la línea.
2. **Números**: Un dígito seguido de más dígitos (enteros).
3. **Identificador**: Una letra seguida de letras, números o símbolos especiales (`?`, `$`).

## Gramática del lenguaje

```ebnf
<programa> ::= <expresion>

<expresion> ::= <numero>
                lit-exp(num)
            ::= <identificador>
                var-exp(id)
            ::= <primitiva> "(" <expresion>*(,) ")"
                prim-exp(prim, exps)

<primitiva> ::= "+"
                add-prim()
            ::= "-"
                sub-prim()
            ::= "*"
                mult-prim()
            ::= "/"
                div-prim()
            ::= "add1"
                add1-prim()
            ::= "sub1"
                sub1-prim()
```

## Implementación del evaluador

Tener en cuenta que se debe procesar inicialmente un programa que tiene una expresión:

```scheme
(define evaluar-programa
  (lambda (pgm)
    (cases programa pgm
      (a-program (exp) 
        ; Un programa es una expresión que se evalúa en el ambiente inicial
        (evaluar-expresion exp ambiente-inicial)
      )
    )
  )
)
```

Observe que se hace `cases` de `programa` y se envía a `evaluar-expresion`.

## TAD de ambientes

Como TAD de datos, tenemos a los ambientes y su procedimiento `apply-env`. Tener en cuenta que este TAD es diferente a los TADs generados por la especificación gramatical. Se tiene un ambiente inicial.

## Operaciones aritméticas soportadas

El intérprete soporta operaciones con múltiples operandos:

1. `+(1,2,3)` = 6 (suma todos los operandos)
2. `-(1,2,3)` = -4 porque `-(1,+(2,3))` (el primer operando menos la suma de los restantes)
3. `/(1,2,3,4)` = 1/24 porque `/(1,*(2,3,4))` (el primer operando dividido por el producto de los restantes)

## Filosofía del intérprete

La filosofía del intérprete es siempre abrir los AST para dar una respuesta. Ejemplo:

```scheme
"+(x,x,x,1,2,3)"

; Produce el siguiente AST:
#(struct:a-program
  #(struct:prim-exp
    #(struct:sum-prim)
    (#(struct:var-exp x)
     #(struct:var-exp x)
     #(struct:var-exp x)
     #(struct:lit-exp 1)
     #(struct:lit-exp 2)
     #(struct:lit-exp 3))))
```

## Procesamiento de listas de expresiones

Para trabajar con la lista de expresiones en una operación primitiva:

```scheme
; Evalúa cada expresión en la lista de argumentos y retorna una lista de números
(define lista-numeros 
  (map (lambda (x) (evaluar-expresion x amb)) args))
```

Esto toma la lista de expresiones y nos retorna una lista de números.

## Función principal de evaluación

Tomar en cuenta que `evaluar-expresion` recibe siempre una expresión y un ambiente, y nos retorna un número. Toda expresión debe ser trabajada con esta función, por lo tanto es fundamental entender cómo está estructurado el AST.

## Conceptos teóricos adicionales

- **Valores expresados vs. denotados**: Distinción fundamental en semántica. Los valores expresados son el resultado final de la evaluación, mientras que los valores denotados son las entidades manipuladas durante la evaluación (valores almacenados en ambientes).
- **Ambiente (environment)**: Estructura que mapea identificadores a valores. Puede implementarse como lista de asociaciones, tabla hash, o estructura más compleja con encadenamiento estático/dinámico.
- **Semántica operacional**: El intérprete implementa semántica operacional de paso grande (big-step), donde `evaluar-expresion` reduce una expresión directamente a su valor.
- **AST (Árbol de Sintaxis Abstracta)**: Representación intermedia que elimina detalles sintácticos superficiales, preservando la estructura lógica del programa.
- **Pattern matching con `cases`**: Técnica para descomponer datatypes algebraicos de manera segura y legible.

## Implementación completa del intérprete

```scheme
; ============================================
; DEFINICIÓN DE DATATYPES PARA EL LENGUAJE
; ============================================

; Definición manual de datatypes (alternativa a SLLGEN)
(define-datatype programa programa?
  (a-program
    (expresion expresion?))  ; Un programa es una expresión
)

(define-datatype expresion expresion?
  (lit-exp
    (num number?))           ; Literal numérico
  (var-exp
    (id symbol?))            ; Referencia a variable
  (prim-exp
    (prim primitiva?)        ; Operación primitiva
    (args (list-of expresion?))) ; Lista de argumentos
)

(define-datatype primitiva primitiva?
  (add-prim)                 ; Operador de suma +
  (sub-prim)                 ; Operador de resta -
  (mult-prim)                ; Operador de multiplicación *
  (div-prim)                 ; Operador de división /
  (add1-prim)                ; Incremento en 1
  (sub1-prim)                ; Decremento en 1
)

; ============================================
; TAD AMBIENTE (ENVIRONMENT)
; ============================================

; Definición del TAD ambiente
(define-datatype ambiente ambiente?
  (ambiente-vacio)
  (ambiente-extendido
    (ids (list-of symbol?))   ; Lista de identificadores
    (vals (list-of number?))  ; Lista de valores correspondientes
    (env ambiente?))          ; Ambiente padre (encadenamiento)
)

; Constructor del ambiente inicial
(define ambiente-inicial
  (ambiente-extendido
    '(x y z pi e)            ; Variables predefinidas
    '(10 20 30 3.1416 2.718) ; Valores correspondientes
    (ambiente-vacio)))

; Aplicar ambiente: buscar valor de un identificador
(define apply-env
  (lambda (env id)
    (cases ambiente env
      (ambiente-vacio ()
        (error 'apply-env "Variable no definida:" id))
      (ambiente-extendido (ids vals env-padre)
        (letrec
          ((buscar
             (lambda (ids-locales vals-locales)
               (cond
                 ((null? ids-locales)
                  ; No encontrado localmente, buscar en ambiente padre
                  (apply-env env-padre id))
                 ((eqv? (car ids-locales) id)
                  ; Encontrado, devolver valor correspondiente
                  (car vals-locales))
                 (else
                  ; Continuar buscando
                  (buscar (cdr ids-locales) (cdr vals-locales)))))))
          (buscar ids vals))))))

; ============================================
; EVALUADOR DE EXPRESIONES
; ============================================

; Función principal para evaluar expresiones
(define evaluar-expresion
  (lambda (exp amb)
    (cases expresion exp
      ; Caso 1: Literal numérico
      (lit-exp (num)
        num)  ; Devuelve el número directamente
      
      ; Caso 2: Referencia a variable
      (var-exp (id)
        (apply-env amb id))  ; Busca el valor en el ambiente
      
      ; Caso 3: Operación primitiva
      (prim-exp (prim args)
        ; Primero evalúa todos los argumentos
        (let ((valores-args (map (lambda (arg) (evaluar-expresion arg amb)) args)))
          ; Luego aplica la operación primitiva
          (aplicar-primitiva prim valores-args)))
    )
  )
)

; ============================================
; APLICACIÓN DE PRIMITIVAS
; ============================================

; Aplica una operación primitiva a una lista de valores
(define aplicar-primitiva
  (lambda (prim args)
    (cases primitiva prim
      ; Suma: suma todos los argumentos
      (add-prim ()
        (if (null? args)
            (error 'aplicar-primitiva "Suma requiere al menos un argumento")
            (foldl + 0 args)))  ; foldl acumula sumando desde 0
      
      ; Resta: primer argumento menos la suma de los restantes
      (sub-prim ()
        (cond
          ((null? args)
           (error 'aplicar-primitiva "Resta requiere al menos un argumento"))
          ((null? (cdr args))
           (- 0 (car args)))  ; Caso especial: -(x) = 0-x
          (else
           (- (car args) (foldl + 0 (cdr args))))))  ; a - (b+c+...)
      
      ; Multiplicación: producto de todos los argumentos
      (mult-prim ()
        (if (null? args)
            (error 'aplicar-primitiva "Multiplicación requiere al menos un argumento")
            (foldl * 1 args)))  ; foldl acumula multiplicando desde 1
      
      ; División: primer argumento dividido por el producto de los restantes
      (div-prim ()
        (cond
          ((null? args)
           (error 'aplicar-primitiva "División requiere al menos un argumento"))
          ((null? (cdr args))
           (/ 1 (car args)))  ; Caso especial: /(x) = 1/x
          (else
           (let ((producto-restantes (foldl * 1 (cdr args))))
             (if (zero? producto-restantes)
                 (error 'aplicar-primitiva "División por cero")
                 (/ (car args) producto-restantes))))))  ; a / (b*c*...)
      
      ; Incremento en 1: requiere exactamente un argumento
      (add1-prim ()
        (if (= (length args) 1)
            (+ (car args) 1)
            (error 'aplicar-primitiva "add1 requiere exactamente un argumento")))
      
      ; Decremento en 1: requiere exactamente un argumento
      (sub1-prim ()
        (if (= (length args) 1)
            (- (car args) 1)
            (error 'aplicar-primitiva "sub1 requiere exactamente un argumento")))
    )
  )
)

; ============================================
; EVALUADOR DE PROGRAMAS
; ============================================

; Función principal que evalúa un programa completo
(define evaluar-programa
  (lambda (pgm)
    (cases programa pgm
      (a-program (exp)
        ; Un programa es una expresión que se evalúa en el ambiente inicial
        (evaluar-expresion exp ambiente-inicial)
      )
    )
  )
)

; ============================================
; FUNCIONES AUXILIARES
; ============================================

; Predicado para listas (no estándar en Scheme básico)
(define list-of
  (lambda (pred)
    (lambda (val)
      (or (null? val)
          (and (pair? val)
               (pred (car val))
               ((list-of pred) (cdr val)))))))

; ============================================
; EJEMPLOS DE USO
; ============================================

; Ejemplo 1: Programa simple con literales
(define prog1
  (a-program
    (prim-exp
      (add-prim)
      (list (lit-exp 1) (lit-exp 2) (lit-exp 3)))))

; Resultado: (evaluar-programa prog1) → 6

; Ejemplo 2: Programa con variables
(define prog2
  (a-program
    (prim-exp
      (add-prim)
      (list (var-exp 'x) (var-exp 'y) (lit-exp 5)))))

; Resultado: (evaluar-programa prog2) → 35 (10 + 20 + 5)

; Ejemplo 3: Operación de resta con múltiples operandos
(define prog3
  (a-program
    (prim-exp
      (sub-prim)
      (list (lit-exp 10) (lit-exp 2) (lit-exp 3)))))

; Resultado: (evaluar-programa prog3) → 5 (10 - (2+3))

; Ejemplo 4: Operación de división
(define prog4
  (a-program
    (prim-exp
      (div-prim)
      (list (lit-exp 100) (lit-exp 2) (lit-exp 5)))))

; Resultado: (evaluar-programa prog4) → 10 (100 / (2*5))
```

## Tabla de resumen de conceptos

| Concepto | Descripción | Ejemplo/Nota |
|----------|-------------|--------------|
| **Valores expresados** | Resultado final de la evaluación (números) | `6`, `3.14`, `-42` |
| **Valores denotados** | Valores almacenados en ambientes (asociaciones) | `x → 10`, `y → 20` en el ambiente |
| **Ambiente (environment)** | Estructura que mapea identificadores a valores | Implementado como TAD con `apply-env` |
| **AST (Árbol de Sintaxis Abstracta)** | Representación jerárquica del programa | `prim-exp`, `var-exp`, `lit-exp` |
| **Evaluador de expresiones** | Función que reduce expresiones a valores | `evaluar-expresion` con `cases` |
| **Primitivas aritméticas** | Operaciones básicas del lenguaje | `+`, `-`, `*`, `/`, `add1`, `sub1` |
| **Semántica operacional** | Definición de significado mediante reglas de evaluación | Paso grande (big-step) |
| **Pattern matching** | Técnica para descomponer datatypes | `cases` en Scheme/EOPL |
| **Fold/Reduce** | Patrón para acumular sobre listas | `foldl` para sumas y productos |
| **Recursión estructural** | Recorrer estructuras según su definición | Recursión sobre listas de expresiones |
| **Manejo de errores** | Detección y reporte de condiciones inválidas | Argumentos insuficientes, división por cero |
| **Variables predefinidas** | Identificadores disponibles en ambiente inicial | `x=10`, `y=20`, `pi=3.1416` |
| **Aridad variable** | Operaciones que aceptan cualquier número de argumentos | `+`, `-`, `*`, `/` con N argumentos |
| **Encadenamiento de ambientes** | Búsqueda en ambientes padres cuando no se encuentra localmente | Implementado en `apply-env` |

## Comentarios adicionales

1. **Diseño del lenguaje**:
   - El lenguaje es minimalista pero expresivo
   - Las primitivas con aridad variable simplifican expresiones comunes
   - La semántica de `-` y `/` con múltiples argumentos es consistente: operan sobre el primer argumento y el resultado de combinar los restantes

2. **Extensibilidad**:
   - Para añadir nuevas primitivas, extender el datatype `primitiva` y la función `aplicar-primitiva`
   - Para añadir nuevos tipos de expresiones, extender el datatype `expresion` y `evaluar-expresion`
   - Para soportar nuevos tipos de valores, modificar los valores expresados/denotados

3. **Consideraciones de implementación**:
   - `foldl` y `foldr` son fundamentales para operaciones sobre listas
   - El orden de evaluación de argumentos es de izquierda a derecha (por `map`)
   - Los errores se detectan temprano con chequeos de aridad y tipos

4. **Aplicaciones educativas**:
   - Base para entender evaluadores más complejos
   - Ejemplo concreto de semántica operacional
   - Ilustra la separación entre sintaxis (AST) y semántica (evaluador)

5. **Posibles extensiones**:
   - **Tipos de datos adicionales**: booleanos, strings, listas
   - **Estructuras de control**: condicionales, ciclos
   - **Definición de funciones**: lambdas, recursión
   - **Sistema de tipos**: chequeo estático de tipos
   - **Manejo de estado**: asignación destructiva, efectos secundarios

Este intérprete simple sirve como base fundamental para entender cómo funcionan los lenguajes de programación a nivel de implementación, proporcionando los patrones de diseño esenciales para construir evaluadores más sofisticados.