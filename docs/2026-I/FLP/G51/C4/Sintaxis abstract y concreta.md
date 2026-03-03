# Sintaxis Abstracta y Concreta

## Introducción

En el diseño e implementación de lenguajes de programación, es fundamental distinguir entre dos representaciones diferentes de los programas: la **sintaxis concreta** y la **sintaxis abstracta**. Esta distinción es esencial para construir procesadores de lenguaje como compiladores e intérpretes.

## Definiciones

### Sintaxis Concreta
La sintaxis concreta es la forma textual en que los programadores escriben los programas. Usualmente se representa como cadenas de texto (strings) que siguen reglas gramaticales específicas. En este ejemplo, por simplicidad, representaremos la sintaxis concreta como listas de Scheme.

### Sintaxis Abstracta
La sintaxis abstracta es una representación interna, estructurada, que captura la esencia del programa eliminando detalles superficiales de notación. Se implementa típicamente como un Árbol de Sintaxis Abstracta (AST - Abstract Syntax Tree).

## Ejemplo: Árbol Binario

### Especificación Gramatical

```ebnf
<arbol-b> ::= '()    
              leaf-empty()
          ::= <int>  
              leaf-num(num)
          ::= <symbol> <arbol-b> <arbol-b>
              node(key, left, right)
```

### Implementación del AST (Sintaxis Abstracta)

```scheme
#lang eopl
#|
<arbol-b> ::= '()    
              leaf-empty()
          ::= <int>  
              leaf-num(num)
          ::= <symbol> <arbol-b> <arbol-b>
              node(key, left, right)
|#

;; Definición del tipo de dato para la sintaxis abstracta
;; Representa el Árbol de Sintaxis Abstracta (AST) de árboles binarios
(define-datatype arbol-b arbol-b?
  (leaf-empty)                    ; Variante: hoja vacía
  (leaf-num                       ; Variante: hoja con número
   (num number?))                ; Campo: valor numérico
  (node                          ; Variante: nodo interno
   (key symbol?)                ; Campo: clave (símbolo)
   (left arbol-b?)              ; Campo: subárbol izquierdo
   (right arbol-b?)))           ; Campo: subárbol derecho

;; Ejemplo de AST (sintaxis abstracta)
;; Representación interna estructurada
(define arb1
  (node
   'x                            ; Nodo raíz con clave 'x
   (node 'y                      ; Subárbol izquierdo: nodo con clave 'y
         (leaf-num 3)            ;   Hoja izquierda con valor 3
         (leaf-empty))           ;   Hoja derecha vacía
   (node 'x                      ; Subárbol derecho: nodo con clave 'x
         (leaf-num 10)           ;   Hoja izquierda con valor 10
         (node 'p                ;   Subárbol derecho: nodo con clave 'p
               (leaf-empty)      ;     Hoja izquierda vacía
               (leaf-num 18)))))) ;     Hoja derecha con valor 18
```

### Representación de Sintaxis Concreta

```scheme
;; Ejemplo de sintaxis concreta representada como lista
;; Esta es la forma "textual" que un programador podría escribir
(define arbl
  '(node                         ; Forma concreta del constructor node
   x                             ; Clave como símbolo literal
   (node y                       ; Subárbol izquierdo en forma concreta
         (leaf-num 3)            ;   Hoja con número
         (leaf-empty))           ;   Hoja vacía
   (node x                       ; Subárbol derecho en forma concreta
         (leaf-num 10)           ;   Hoja con número
         (node p                 ;   Subárbol anidado
               (leaf-empty)      ;     Hoja vacía
               (leaf-num 18)))))) ;     Hoja con número
```

## Procesamiento: Parser y Unparser

### Parser: De Sintaxis Concreta a Abstracta

```scheme
;; parser: lista → arbol-b
;; Convierte sintaxis concreta (representada como lista) en sintaxis abstracta (AST)
(define parser
  (lambda (exp)
    (cond
      [(equal? (car exp) 'leaf-empty)   ; Si es una hoja vacía
       (leaf-empty)]                    ; Crea el AST correspondiente
      [(equal? (car exp) 'leaf-num)     ; Si es una hoja con número
       (leaf-num (cadr exp))]           ; Extrae el número y crea el AST
      [else                             ; Si es un nodo (asumimos 'node)
       (node                            ; Crea nodo en AST
        (cadr exp)                      ; Extrae la clave (símbolo)
        (parser (caddr exp))            ; Parsea recursivamente el subárbol izquierdo
        (parser (cadddr exp)))]         ; Parsea recursivamente el subárbol derecho
      )))
```

### Unparser: De Sintaxis Abstracta a Concreta

```scheme
;; unparser: arbol-b → lista
;; Convierte sintaxis abstracta (AST) en sintaxis concreta (representada como lista)
(define unparser
  (lambda (exp)
    (cases arbol-b exp                 ; Analiza el AST
      (leaf-empty ()                   ; Caso hoja vacía
       (list 'leaf-empty))             ; Devuelve representación concreta
      (leaf-num (num)                  ; Caso hoja con número
       (list 'leaf-num num))           ; Devuelve representación concreta
      (node (key left right)           ; Caso nodo: extrae clave y subárboles
            (list 'node                ; Reconstruye la forma concreta
                  key                  ; Incluye la clave
                  (unparser left)      ; Convierte recursivamente subárbol izquierdo
                  (unparser right)     ; Convierte recursivamente subárbol derecho
                  )))))
```

## Conceptos Teóricos

### Árbol de Sintaxis Abstracta (AST)
Un AST es una representación en forma de árbol que:
1. **Elimina detalles sintácticos** como paréntesis, puntos y comas, y espacios
2. **Captura la estructura esencial** del programa
3. **Facilita el análisis semántico** y la generación de código
4. **Es independiente** de la notación concreta del lenguaje

### Fases del Procesamiento de Lenguaje
1. **Análisis léxico**: Convierte texto en tokens
2. **Análisis sintáctico (parsing)**: Convierte tokens en AST (parser)
3. **Análisis semántico**: Verifica tipos y significado sobre el AST
4. **Generación de código**: Convierte AST en código objetivo (unparser inverso)

### Ventajas de la Separación
- **Abstracción**: El procesamiento semántico opera sobre el AST, independiente de la sintaxis concreta
- **Flexibilidad**: Se pueden cambiar la sintaxis concreta sin afectar el procesamiento semántico
- **Reutilización**: El mismo AST puede ser generado por diferentes sintaxis concretas

## Tabla de Resumen

| Concepto | Descripción | Ejemplo en la Implementación |
|----------|-------------|------------------------------|
| **Sintaxis Concreta** | Representación textual del programa | `'(node x (leaf-num 3) (leaf-empty))` |
| **Sintaxis Abstracta** | Representación estructural interna (AST) | `(node 'x (leaf-num 3) (leaf-empty))` |
| **AST (Abstract Syntax Tree)** | Árbol que representa la estructura del programa | Tipo `arbol-b` con variantes `leaf-empty`, `leaf-num`, `node` |
| **Parser** | Función que convierte sintaxis concreta en abstracta | `parser`: lista → `arbol-b` |
| **Unparser** | Función que convierte sintaxis abstracta en concreta | `unparser`: `arbol-b` → lista |
| **Token** | Unidad léxica básica (en este ejemplo: símbolos como `'node`) | `'leaf-empty`, `'leaf-num`, `'node` |
| **Análisis Sintáctico** | Proceso de construir AST a partir de texto | Implementado en función `parser` |
| **Recorrido de AST** | Procesamiento de la estructura del árbol | Uso de `cases` en `unparser` para recorrer el AST |
| **Representación intermedia** | Forma canónica entre diferentes representaciones | El AST sirve como representación intermedia |

## Comentarios Adicionales

### Limitaciones del Ejemplo Actual
1. **Representación simplificada**: Usamos listas en lugar de strings reales para la sintaxis concreta
2. **Parser minimalista**: No maneja errores sintácticos ni verifica estructura completa
3. **Tokens implícitos**: Los tokens son símbolos de Scheme en lugar de strings procesadas

### Enfoque Real en EOPL
El libro EOPL (Essentials of Programming Languages) proporciona:
- **Sistema de parsing integrado**: Con herramientas para definir gramáticas y generar parsers automáticamente
- **Procesamiento de strings reales**: No solo listas preconstruidas
- **Manejo de errores**: Con mensajes informativos sobre errores sintácticos

### Aplicaciones Prácticas

#### 1. **Compiladores e Intérpretes**
- **Front-end**: Parser convierte código fuente en AST
- **Middle-end**: Transformaciones y optimizaciones sobre el AST
- **Back-end**: Unparser (o generador de código) convierte AST en código objetivo

#### 2. **Herramientas de Desarrollo**
- **Linters**: Analizan AST para detectar patrones problemáticos
- **Formateadores**: Regeneran código desde AST con estilo consistente
- **Herramientas de refactorización**: Modifican AST y regeneran código

#### 3. **Procesamiento de DSLs**
- **Lenguajes específicos de dominio**: Definición de sintaxis concreta personalizada
- **Conversión entre formatos**: Parser de un formato, unparser a otro formato

### Mejoras a la Implementación

#### Parser más Robusto:
```scheme
(define parser-mejorado
  (lambda (exp)
    (cond
      [(not (list? exp)) (eopl:error "Parser: entrada debe ser lista")]
      [(null? exp) (eopl:error "Parser: expresión vacía")]
      [(equal? (car exp) 'leaf-empty)
       (if (= (length exp) 1)
           (leaf-empty)
           (eopl:error "Parser: leaf-empty no debe tener argumentos"))]
      [(equal? (car exp) 'leaf-num)
       (if (and (= (length exp) 2) (number? (cadr exp)))
           (leaf-num (cadr exp))
           (eopl:error "Parser: leaf-num requiere exactamente un número"))]
      [(equal? (car exp) 'node)
       (if (and (= (length exp) 4) (symbol? (cadr exp)))
           (node (cadr exp)
                 (parser-mejorado (caddr exp))
                 (parser-mejorado (cadddr exp)))
           (eopl:error "Parser: node requiere símbolo y dos subárboles"))]
      [else (eopl:error "Parser: forma desconocida:" (car exp))])))
```

#### Consideraciones de Diseño

1. **Idempotencia**: Idealmente, `(unparser (parser x))` debería ser igual a `x` (salvo por detalles de formato)
2. **Completitud**: El parser debe manejar todas las formas sintácticas válidas
3. **Manejo de errores**: Proporcionar mensajes informativos para entrada mal formada
4. **Eficiencia**: Considerar el costo del parsing para programas grandes

### Ejercicios de Extensión

1. **Agregar más formas sintácticas**: Extender la gramática con nuevas construcciones
2. **Implementar pretty-printer**: Unparser que genere texto formateado legiblemente
3. **Agregar comentarios**: Extender el AST para preservar comentarios del código fuente
4. **Implementar transformaciones**: Funciones que modifiquen el AST (optimizaciones, etc.)

La comprensión de la distinción entre sintaxis abstracta y concreta es fundamental para cualquiera que desee implementar procesadores de lenguaje, ya que establece la base para la arquitectura de compiladores, intérpretes y otras herramientas de procesamiento de código.