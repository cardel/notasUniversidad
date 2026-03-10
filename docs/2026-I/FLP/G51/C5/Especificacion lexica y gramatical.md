# Especificación Léxica y Gramatical

## Especificación Léxica

La especificación léxica le indica al **frontend** (analizador frontal) cuáles son las unidades significativas del lenguaje (tokens) y qué hacer con ellas. Se define como una lista de reglas.

**Formato general:**
```scheme
'(
   (nombre-token (expresion-regular) accion)
)
;; expresion-regular: letter, whitespace, digit, arbno, or, etc.
;; accion: skip | symbol | number | string
```

### Ejemplo

```scheme
(define especificacion-lexica
  '(
    (espacio-blanco (whitespace) skip)                ; Ignora espacios, tabs, saltos de línea
    (comentario ("%" (arbno (not #\newline))) skip)   ; Ignora comentarios que empiezan con '%'
    (identificador (letter (arbno (or letter digit "?" "$"))) symbol) ; Identificadores: letra seguida de letras, dígitos, ? o $
    (numero (digit (arbno digit)) number)             ; Números enteros positivos
    (numero ("-" digit (arbno digit)) number)         ; Números enteros negativos
    (numero (digit (arbno digit) "." digit (arbno digit)) number) ; Números decimales positivos
    (numero ("-" digit (arbno digit) "." digit (arbno digit)) number) ; Números decimales negativos
    )
  )
```

**Salidas del escáner con esta especificación:**

```scheme
> (escaner "     ")
() ; Se ignoran todos los espacios en blanco

> (escaner "% soy un comentario")
() ; Se ignora el comentario completo

> (escaner "x + y")
((identificador x 1) (literal-string "+" 1) (identificador y 1)) ; Identifica tokens con sus clases

> (escaner "x -28.3")
((identificador x 1) (numero -28.3 1)) ; Identifica identificador y número decimal negativo
```

## Especificación Gramatical

La especificación gramatical define la **sintaxis** del lenguaje: cómo se combinan los tokens para formar construcciones válidas del programa. Además, permite generar automáticamente los **tipos de datos algebraicos** (datatypes) que representarán el Árbol de Sintaxis Abstracta (AST).

**Formato general:**
```scheme
'(
  (no-terminal (produccion) nombre-variante)
)
;; nombre-variante debe ser único para cada variante del datatype
```

### Ejemplo

```scheme
(define especificacion-gramatical
  '(
    (declaracion ("{" declaracion ";" declaracion "}") decl-1) ; Bloque: { decl1 ; decl2 }
    (declaracion ("while" expresion "do" declaracion) decl-2)  ; Bucle while
    (declaracion (identificador ":=" expresion) decl-3)        ; Asignación
    (expresion (identificador) exp-1)                          ; Expresión variable
    (expresion (numero) exp-2)                                 ; Expresión literal numérica
    (expresion ("(" expresion "+" expresion ")") exp-3)        ; Expresión de suma
    )
  )
```

**Salida del parser con esta gramática:**

```scheme
(parser "while 4 do x := y")
#(struct:decl-2 #(struct:exp-2 4) #(struct:decl-3 x #(struct:exp-1 y)))
;; Estructura: (decl-2 (exp-2 4) (decl-3 x (exp-1 y)))
;; Representa: while 4 do x := y
```

## Funciones del Intérprete/Compilador

### 1. Construcción de los Datatypes
Genera automáticamente las definiciones de tipos de datos (structs) para representar el AST según las especificaciones léxica y gramatical.
```scheme
(sllgen:make-define-datatypes especificacion-lexica especificacion-gramatical)
```
**Nota:** Si dos producciones gramaticales comienzan con el mismo token (conflicto por la izquierda), esta construcción puede fallar.

### 2. Construcción del Escáner y Parser
Crea funciones específicas para analizar cadenas de texto.

```scheme
;; Construir escáner
(define escaner
  (sllgen:make-string-scanner especificacion-lexica especificacion-gramatical))

;; Construir parser
(define parser
  (sllgen:make-string-parser especificacion-lexica especificacion-gramatical))
```

### 3. Creación del Intérprete Interactivo
Crea un bucle de lectura-evaluación-impresión (REPL) para el lenguaje.

```scheme
(define interpretador
  (sllgen:make-rep-loop "--primer lenguaje-->" evaluar-programa
                        (sllgen:make-stream-parser
                         especificacion-lexica especificacion-gramatical)))
```

## Evaluación de Programas

El intérprete toma como **punto de entrada** (start symbol) el primer no-terminal definido en la especificación gramatical. En nuestro ejemplo, espera una `declaracion`.

**Función de evaluación de ejemplo:**
```scheme
(define evaluar-programa
  (lambda (prog)
    (cases declaracion prog  ; 'cases' espera una estructura del tipo 'declaracion'
      (decl-1 (d1 d2) (list d1 d2))    ; Para bloques: retorna lista de las dos declaraciones
      (decl-2 (exp d1) (list exp d1))  ; Para while: retorna expresión y declaración
      (decl-3 (id exp) (list id exp))) ; Para asignación: retorna identificador y expresión
    ))
```

**Importante:** Si el parser produce una `expresion` en lugar de una `declaracion`, esta función `evaluar-programa` fallará, ya que `cases` está configurado para manejar solo variantes del tipo `declaracion`.