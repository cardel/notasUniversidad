# Scanner, Parser e Intérprete

## Scanner

El scanner produce unidades significativas llamadas **tokens**. Este proceso depende de la **especificación léxica**.

La especificación léxica nos dice qué elementos son importantes o válidos, tales como identificadores, números, etc. Nos permite ignorar elementos irrelevantes como espacios en blanco o comentarios.

## Parser

Recibe una lista de tokens y produce un **AST (Árbol de Sintaxis Abstracta)**.

## Funciones para implementar un intérprete

### 1. Especificación léxica
```scheme
'(
   (nombre (exp-regular) salida)
)
; nombre: identificador libre para la categoría léxica
; expresión regular: letter, digit, arbno, etc.
; salida: skip | symbol | number | string
```

### 2. Especificación gramatical
```scheme
'(
   (nombre-datatype (expresion-regular) nombre-variante)
)

;; Corresponde a:
;; (define-datatype nombre-datatype nombre-datatype?
;;    (nombre-variante
;;               (campo1 t1?)
;;               (campon tn?)
```

### 3. Construcción de los datatypes
```scheme
(sllgen:make-define-datatypes especificacion-lexica especificacion-gramatical)
```

### 4. Herramientas de prueba: scanner y parser (opcionales)
```scheme
;; Construir escáner
(define escaner
  (sllgen:make-string-scanner especificacion-lexica especificacion-gramatical))

;; Construir el parser
(define parser
  (sllgen:make-string-parser especificacion-lexica especificacion-gramatical))
```

### 5. Implementación del intérprete
```scheme
(define interpretador
  (sllgen:make-rep-loop "--primer lenguaje-->" evaluar-programa
                        (sllgen:make-stream-parser
                         especificacion-lexica especificacion-gramatical)))
                         
;; La función evaluar-programa va a recibir un AST
;; El datatype que genera siempre es el primero que encuentra, por lo tanto
;; debo comenzar por una declaración
```

## Conceptos teóricos adicionales

- **SLLGEN (Scanner and LL(1) Parser Generator)**: Biblioteca de Scheme que automatiza la creación de scanners y parsers a partir de especificaciones léxicas y gramaticales.
- **LL(1) Parser**: Tipo de parser predictivo descendente que lee la entrada de izquierda a derecha (Left-to-right) y construye una derivación por la izquierda (Leftmost derivation), mirando solo un token de anticipación (1 lookahead).
- **Especificación léxica**: Define las categorías de tokens usando expresiones regulares. Cada regla tiene: nombre de categoría, patrón regex, y acción (skip para ignorar, o tipo de dato para producir).
- **Especificación gramatical**: Define la estructura sintáctica usando una gramática libre de contexto. Cada producción genera una variante en el datatype correspondiente.
- **Read-Eval-Print Loop (REPL)**: Ciclo interactivo que lee expresiones, las evalúa e imprime resultados. `sllgen:make-rep-loop` crea un REPL para el lenguaje definido.

## Ejemplo completo de intérprete

```scheme
; ============================================
; ESPECIFICACIÓN LÉXICA
; ============================================
(define especificacion-lexica
  '(
    (espacio-blanco (whitespace) skip)          ; Ignorar espacios, tabs, newlines
    (comentario ("%" (arbno (not #\newline))) skip) ; Comentarios de una línea que empiezan con %
    (identificador (letter (arbno (or letter digit "?" "$"))) symbol) ; Identificadores: letra seguida de letras/dígitos/"?/$"
    (numero (digit (arbno digit)) number)       ; Números enteros positivos
    (numero ("-" digit (arbno digit)) number)   ; Números enteros negativos
    (numero (digit (arbno digit)"." digit (arbno digit)) number) ; Números decimales positivos
    (numero ("-" digit (arbno digit)"." digit (arbno digit)) number) ; Números decimales negativos
    )
  )

; ============================================
; ESPECIFICACIÓN GRAMATICAL
; ============================================
(define especificacion-gramatical
  '(
    ; Declaraciones del lenguaje
    (declaracion ("{" declaracion ";" declaracion "}") decl-1) ; Bloque secuencial
    (declaracion ("while" expresion "do" declaracion) decl-2)  ; Ciclo while
    (declaracion (identificador ":=" expresion) decl-3)        ; Asignación
    
    ; Expresiones del lenguaje
    (expresion (identificador) exp-1)                          ; Referencia a variable
    (expresion (numero) exp-2)                                 ; Literal numérico
    (expresion ("(" expresion "+" expresion ")") exp-3)        ; Suma binaria
    )
  )

; ============================================
; CONSTRUCCIÓN AUTOMÁTICA DE DATATYPES
; ============================================
;; Crea automáticamente los datatypes para declaracion y expresion
;; basados en las especificaciones léxica y gramatical
(sllgen:make-define-datatypes especificacion-lexica especificacion-gramatical)

; ============================================
; INSPECCIÓN DE LOS DATATYPES GENERADOS
; ============================================
;; Muestra la definición de datatypes generada por SLLGEN
(define listaDatatypes
  (sllgen:list-define-datatypes especificacion-lexica especificacion-gramatical)
  )

; ============================================
; CONSTRUCCIÓN DE HERRAMIENTAS (OPCIONAL)
; ============================================
;; Construir escáner (opcional - para pruebas)
(define escaner
  (sllgen:make-string-scanner especificacion-lexica especificacion-gramatical))

;; Construir el parser (opcional - para pruebas)
(define parser
  (sllgen:make-string-parser especificacion-lexica especificacion-gramatical)
  )

; ============================================
; EVALUADOR DEL PROGRAMA
; ============================================
;; Función que procesa el AST generado por el parser
;; Recibe un programa (AST) y devuelve su evaluación
(define evaluar-programa
  (lambda (prog)
    (cases declaracion prog
      (decl-1 (d1 d2) 
        (list 'bloque d1 d2))                    ; Bloque secuencial
      (decl-2 (exp d1) 
        (list 'while exp d1))                    ; Ciclo while
      (decl-3 (id exp) 
        (list 'asignacion id exp)))              ; Asignación
    ))

; ============================================
; INTERPRETADOR INTERACTIVO (REPL)
; ============================================
;; Crea un REPL (Read-Eval-Print Loop) interactivo
;; - Muestra el prompt "--primer lenguaje-->"
;; - Usa evaluar-programa para procesar cada entrada
;; - sllgen:make-stream-parser crea un parser para flujos de entrada
(define interpretador
  (sllgen:make-rep-loop "--primer lenguaje-->" evaluar-programa
                        (sllgen:make-stream-parser
                         especificacion-lexica especificacion-gramatical)))

; ============================================
; INICIAR EL INTERPRETADOR
; ============================================
(interpretador)
```

## Tabla de resumen de conceptos

| Concepto | Descripción | Ejemplo/Nota |
|----------|-------------|--------------|
| **Scanner** | Convierte texto en tokens según especificación léxica | `"x := 5"` → `[identificador(x), :=, numero(5)]` |
| **Parser** | Convierte tokens en AST según especificación gramatical | Tokens → `(decl-3 'x (exp-2 5))` |
| **Especificación léxica** | Define patrones regex para categorías de tokens | `(identificador (letter (arbno letter)) symbol)` |
| **Especificación gramatical** | Define estructura sintáctica con gramática libre de contexto | `(declaracion (identificador ":=" expresion) decl-3)` |
| **SLLGEN** | Biblioteca que genera scanners y parsers LL(1) automáticamente | `sllgen:make-define-datatypes` |
| **LL(1) Parser** | Parser predictivo con un token de lookahead | Adecuado para gramáticas no ambiguas |
| **Datatype** | Tipo de dato algebraico generado automáticamente | `declaracion` con variantes `decl-1`, `decl-2`, `decl-3` |
| **REPL** | Ciclo interactivo Read-Eval-Print Loop | `sllgen:make-rep-loop` |
| **Token** | Unidad léxica con tipo y valor | `(identificador 'x)`, `(numero 42)` |
| **AST** | Árbol de Sintaxis Abstracta representando estructura del programa | Jerarquía de nodos según gramática |
| **Expresión regular** | Patrón para reconocer cadenas de caracteres | `digit (arbno digit)` para números |
| **arbno** | Cuantificador "cero o más repeticiones" en SLLGEN | Similar a `*` en regex tradicional |
| **skip** | Acción para ignorar tokens (espacios, comentarios) | `(whitespace) skip` |
| **symbol/number** | Acciones para convertir tokens a tipos Scheme | `symbol` para identificadores, `number` para números |
| **cases** | Forma de pattern matching para datatypes en Scheme | `(cases declaracion prog ...)` |

## Comentarios adicionales

1. **Ventajas de SLLGEN**:
   - Automatiza la creación de scanners y parsers
   - Genera datatypes type-safe para el AST
   - Proporciona mensajes de error informativos
   - Facilita la prototipación rápida de lenguajes

2. **Limitaciones de LL(1)**:
   - No todas las gramáticas son LL(1)
   - Puede requerir transformación de gramática (eliminación de recursión izquierda, factorización)
   - Lookahead limitado a un token

3. **Flujo de procesamiento**:
   ```
   Texto → Scanner → Tokens → Parser → AST → Evaluador → Resultado
   ```

4. **Extensibilidad del lenguaje**:
   - Para añadir nuevas construcciones, modificar las especificaciones léxica y gramatical
   - SLLGEN regenerará automáticamente los datatypes y herramientas
   - El evaluador debe extenderse para manejar las nuevas variantes

5. **Aplicaciones prácticas**:
   - **Lenguajes de dominio específico (DSL)**: Crear lenguajes especializados
   - **Lenguajes de scripting**: Intérpretes para automatización
   - **Lenguajes de enseñanza**: Implementar subconjuntos de lenguajes existentes
   - **Procesadores de configuración**: Lenguajes para archivos de configuración

6. **Consideraciones de diseño**:
   - La especificación léxica debe ordenarse de más específica a más general
   - Los conflictos léxicos se resuelven por el primer patrón que coincide
   - La gramática debe ser LL(1) para funcionar con SLLGEN
   - El evaluador debe manejar todos los casos del datatype

Este enfoque con SLLGEN permite implementar rápidamente intérpretes para lenguajes simples, proporcionando una base sólida para explorar conceptos de diseño de lenguajes de programación.