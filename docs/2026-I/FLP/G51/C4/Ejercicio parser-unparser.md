# Ejercicio: Parser y Unparser para Mapas y Valores

## Introducción

Este ejercicio implementa un sistema completo de parsing y unparsing para dos tipos de datos relacionados: mapas (diccionarios) y valores. Demuestra cómo procesar estructuras de datos anidadas y recursivas, un patrón común en implementaciones de lenguajes de programación.

## Especificación Gramatical

```ebnf
<map> ::= '()                         
          empty-map
       ::= <symbol> <value> <map>
          non-empty-map(k v m)

<value> ::= <int>
            value-int(n)
         ::= <symbol>
            value-sym(s)
         ::= <int> <value>
            value-lint(n, l)
         ::= <symbol> <value>
            value-lsym(s,l)
```

## Implementación de los Tipos de Datos Abstractos

### Definición del Tipo `map`

```scheme
#lang eopl
#|
<map> ::= '()                         
          empty-map
       ::= <symbol> <value> <map>
          non-empty-map(k v m)
<value> ::= <int>
            value-int(n)
         ::= <symbol>
            value-sym(s)
         ::= <int> <value>
            value-lint(n, l)
         ::= <symbol> <value>
            value-lsym(s,l)
|#

;; Definición del tipo de dato map (diccionario/ambiente)
;; Representa una asociación de claves (símbolos) a valores
(define-datatype map map?
  (empty-map)                     ; Mapa vacío: no contiene asociaciones
  (non-empty-map                  ; Mapa no vacío: contiene una asociación y un resto
   (k symbol?)                   ; Campo: clave (símbolo)
   (v value?)                    ; Campo: valor (de tipo value)
   (m map?)                      ; Campo: resto del mapa (recursivo)
   )
  )

;; Definición del tipo de dato value
;; Representa valores que pueden ser asociados a claves en el mapa
(define-datatype value value?
  (value-int (n number?))        ; Variante: valor entero simple
  (value-sym (s symbol?))        ; Variante: valor simbólico simple
  (value-lint                    ; Variante: lista de enteros (representada recursivamente)
   (n number?)                  ; Campo: primer elemento (entero)
   (l value?))                  ; Campo: resto de la lista (valor recursivo)
  (value-lsym                   ; Variante: lista de símbolos (representada recursivamente)
   (s symbol?)                  ; Campo: primer elemento (símbolo)
   (l value?))                  ; Campo: resto de la lista (valor recursivo)
  )
```

## Ejemplos de Instancias

### Sintaxis Abstracta (AST)

```scheme
;; Ejemplo de mapa en sintaxis abstracta (AST)
;; Representa: {k: [1, 2, 3], p: [a, b, c], s: 1, t: u}
(define map1
  (non-empty-map 'k                           ; Clave 'k
                 (value-lint 1                ; Valor: lista que empieza con 1
                            (value-lint 2     ; Segundo elemento: 2
                                       (value-int 3))) ; Tercer elemento: 3 (caso base)
                 (non-empty-map 'p            ; Siguiente clave 'p
                                (value-lsym 'a        ; Valor: lista que empieza con 'a
                                           (value-lsym 'b      ; Segundo elemento: 'b
                                                      (value-sym 'c))) ; Tercer elemento: 'c
                                (non-empty-map 's     ; Siguiente clave 's
                                               (value-int 1)   ; Valor entero 1
                                               (non-empty-map 't ; Siguiente clave 't
                                                              (value-sym 'u) ; Valor símbolo 'u
                                                              (empty-map)))))) ; Mapa vacío final
```

### Sintaxis Concreta (Representación como Lista)

```scheme
;; Mismo mapa representado en sintaxis concreta (como lista)
;; Esta es la forma "textual" que se procesaría en un parser real
(define mapl
  '(non-empty-map k (value-lint 1 (value-lint 2 (value-int 3)))
                 (non-empty-map p (value-lsym a (value-lsym b (value-sym c)))
                                (non-empty-map s (value-int 1)
                                               (non-empty-map t (value-sym u) (empty-map))))))
```

## Implementación del Parser

### Parser para Mapas

```scheme
;; parser-map: lista → map
;; Convierte sintaxis concreta (lista) en sintaxis abstracta (AST de tipo map)
(define parser-map
  (lambda (m)
    (if
     (equal? (car m) 'empty-map)          ; Si es un mapa vacío
     (empty-map)                          ; Retorna el AST correspondiente
     (non-empty-map                       ; Si es un mapa no vacío
      (cadr m)                           ; Extrae la clave (símbolo)
      (parser-value (caddr m))           ; Parsea recursivamente el valor
      (parser-map (cadddr m)))           ; Parsea recursivamente el resto del mapa
     )
    )
  )
```

### Parser para Valores

```scheme
;; parser-value: lista → value
;; Convierte sintaxis concreta (lista) en sintaxis abstracta (AST de tipo value)
(define parser-value
  (lambda (v)
    (cond
      [(equal? (car v) 'value-int)        ; Si es un valor entero simple
       (value-int (cadr v))]              ; Crea AST con el número extraído
      [(equal? (car v) 'value-sym)        ; Si es un valor simbólico simple
       (value-sym (cadr v))]              ; Crea AST con el símbolo extraído
      [(equal? (car v) 'value-lint)       ; Si es una lista de enteros
       (value-lint (cadr v)               ; Primer elemento (entero)
                   (parser-value (caddr v)))] ; Parsea recursivamente el resto
      [else                               ; Por descarte, debe ser value-lsym
       (value-lsym (cadr v)               ; Primer elemento (símbolo)
                   (parser-value (caddr v)))] ; Parsea recursivamente el resto
      )
    )
  )
```

## Implementación del Unparser

### Unparser para Mapas

```scheme
;; unparser-map: map → lista
;; Convierte sintaxis abstracta (AST de tipo map) en sintaxis concreta (lista)
(define unparser-map
  (lambda (exp)
    (cases map exp                         ; Analiza el AST del mapa
      (empty-map () (list 'empty-map))     ; Caso mapa vacío
      (non-empty-map (k v m)               ; Caso mapa no vacío: extrae clave, valor y resto
                     (list                 ; Reconstruye la forma concreta
                      'non-empty-map      ; Constructor
                      k                   ; Clave
                      (unparser-value v)  ; Convierte el valor a forma concreta
                      (unparser-map m)))))) ; Convierte recursivamente el resto
```

### Unparser para Valores

```scheme
;; unparser-value: value → lista
;; Convierte sintaxis abstracta (AST de tipo value) en sintaxis concreta (lista)
(define unparser-value
  (lambda (v)
    (cases value v                         ; Analiza el AST del valor
      (value-int (n)                       ; Caso valor entero simple
       (list 'value-int n))                ; Reconstruye forma concreta
      (value-sym (s)                       ; Caso valor simbólico simple
       (list 'value-sym s))                ; Reconstruye forma concreta
      (value-lint (n l)                    ; Caso lista de enteros: extrae cabeza y cola
       (list 'value-lint                   ; Reconstruye forma concreta
             n                            ; Primer elemento
             (unparser-value l)))          ; Convierte recursivamente la cola
      (value-lsym (s l)                    ; Caso lista de símbolos: extrae cabeza y cola
       (list 'value-lsym                   ; Reconstruye forma concreta
             s                            ; Primer elemento
             (unparser-value l))))))       ; Convierte recursivamente la cola
```

## Conceptos Teóricos

### Estructuras de Datos Anidadas y Recursivas

Este ejemplo ilustra varios patrones importantes:

1. **Recursión mutua**: Los tipos `map` y `value` se referencian mutuamente
2. **Estructuras anidadas**: Los valores dentro del mapa pueden ser estructuras complejas
3. **Listas representadas recursivamente**: Las listas se implementan como pares cabeza-cola

### Diseño de Parsers para Gramáticas Recursivas

1. **Separación de responsabilidades**:
   - `parser-map` maneja la estructura del mapa
   - `parser-value` maneja la estructura de valores
   - Cada función se especializa en un tipo específico

2. **Recursión estructural**:
   - Las funciones siguen la estructura de los tipos de datos
   - Cada caso recursivo llama a la función apropiada para el subtipo

3. **Correspondencia uno-a-uno**:
   - Cada variante en la sintaxis abstracta tiene una representación concreta correspondiente
   - El parser y unparser son esencialmente inversos

### Representación de Listas

Las listas se representan de manera no convencional:
- **En lugar de `(list 1 2 3)`**: `(value-lint 1 (value-lint 2 (value-int 3)))`
- **En lugar de `(list 'a 'b 'c)`**: `(value-lsym 'a (value-lsym 'b (value-sym 'c)))`

Esta representación enfatiza la estructura recursiva de las listas pero es menos eficiente que las listas nativas de Scheme.

## Tabla de Resumen

| Concepto | Descripción | Ejemplo en la Implementación |
|----------|-------------|------------------------------|
| **Parser recursivo mutuo** | Funciones que se llaman mutuamente para tipos relacionados | `parser-map` llama a `parser-value` y viceversa |
| **Estructura anidada** | Datos que contienen otros datos de diferentes tipos | `map` contiene `value`, que puede contener más estructuras |
| **Representación recursiva de listas** | Listas implementadas como pares cabeza-cola anidados | `value-lint` y `value-lsym` para listas de enteros y símbolos |
| **Correspondencia sintáctica** | Relación directa entre formas concretas y abstractas | `'empty-map` ↔ `(empty-map)`, `'value-int` ↔ `(value-int n)` |
| **Traversal de estructuras anidadas** | Recorrido que atraviesa múltiples tipos de datos | `unparser-map` recorre mapas y llama a `unparser-value` para valores |
| **Casos base múltiples** | Diferentes formas de terminar la recursión | `empty-map`, `value-int`, `value-sym` como casos base |
| **Extracción posicional** | Uso de `car`, `cadr`, `caddr` para acceder a elementos en listas | `(cadr m)` para clave, `(caddr m)` para valor en `parser-map` |
| **Reconstrucción estructural** | Recreación de la forma concreta manteniendo la estructura | `(list 'non-empty-map k (unparser-value v) (unparser-map m))` |

## Comentarios Adicionales

### Patrones de Diseño en Parsers

1. **Diseño modular**: Separar el parsing por tipo de dato mejora la mantenibilidad
2. **Recursión bien fundada**: Cada función recursiva debe tener casos base claros
3. **Consistencia**: El parser y unparser deben ser inversos (idempotencia)

### Limitaciones y Mejoras Potenciales

#### Limitaciones Actuales:
1. **Manejo de errores mínimo**: No verifica longitud de listas ni tipos de elementos
2. **Eficiencia**: Uso de `cadddr` que es O(n) para acceder al cuarto elemento
3. **Flexibilidad**: No maneja formas sintácticas alternativas

#### Mejoras Sugeridas:

```scheme
;; Parser con verificación de errores
(define parser-map-seguro
  (lambda (m)
    (cond
      [(not (list? m)) (eopl:error "parser-map: entrada debe ser lista")]
      [(null? m) (eopl:error "parser-map: expresión vacía")]
      [(equal? (car m) 'empty-map)
       (if (= (length m) 1)
           (empty-map)
           (eopl:error "parser-map: empty-map no debe tener argumentos"))]
      [(equal? (car m) 'non-empty-map)
       (if (and (>= (length m) 4) (symbol? (cadr m)))
           (non-empty-map (cadr m)
                          (parser-value-seguro (caddr m))
                          (parser-map-seguro (cadddr m)))
           (eopl:error "parser-map: non-empty-map requiere símbolo, valor y mapa"))]
      [else (eopl:error "parser-map: forma desconocida:" (car m))])))
```

### Aplicaciones Prácticas

1. **Configuración de programas**: Los mapas podrían representar archivos de configuración
2. **Intercambio de datos**: Formato para serialización/deserialización de datos estructurados
3. **Bases de datos simples**: Estructura clave-valor con valores complejos
4. **Ambientes de ejecución**: Similar a los ambientes vistos anteriormente, pero con valores más complejos

### Ejercicios de Extensión

1. **Agregar operaciones sobre mapas**:
   ```scheme
   ;; lookup: map × symbol → value
   ;; Busca una clave en el mapa
   (define lookup
     (lambda (m key)
       (cases map m
         (empty-map () (eopl:error "Clave no encontrada:" key))
         (non-empty-map (k v rest)
           (if (equal? k key)
               v
               (lookup rest key))))))
   ```

2. **Implementar evaluación de expresiones**:
   ```scheme
   ;; eval-value: value × map → value
   ;; Evalúa un valor que puede contener referencias a claves del mapa
   (define eval-value
     (lambda (v env)
       (cases value v
         (value-int (n) v)
         (value-sym (s) (lookup env s))
         ...)))
   ```

3. **Agregar más tipos de valores**:
   ```scheme
   ;; Extender value? con nuevos tipos
   (value-bool (b boolean?))
   (value-pair (car value?) (cdr value?))
   ```

### Consideraciones de Rendimiento

1. **Acceso a mapas**: La representación como lista enlazada de asociaciones tiene complejidad O(n) para búsqueda
2. **Parsing de listas**: La representación recursiva de listas es ineficiente para listas largas
3. **Memoria**: Cada elemento de lista requiere un nodo `value-lint` o `value-lsym`

### Relación con Estructuras de Datos Reales

Esta implementación es pedagógica y similar a:
- **Ambientes en intérpretes**: Como visto en ejemplos anteriores
- **Listas en Lisp/Scheme**: Representación similar a pares cons nativos
- **JSON simplificado**: Mapas con valores básicos y listas

La implementación de parsers y unparsers para estructuras anidadas es una habilidad fundamental en el desarrollo de procesadores de lenguaje, ya que permite la conversión entre representaciones externas (texto) e internas (estructuras de datos) de manera consistente y mantenible.