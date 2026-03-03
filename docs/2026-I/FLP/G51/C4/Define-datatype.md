# Definición de Tipos de Datos Abstractos (TADs) en Scheme

Hasta ahora hemos visto representaciones de Tipos Abstractos de Datos (TADs) usando estructuras como listas o estrategias como procedimientos. Sin embargo, vamos a independizarnos de estas representaciones concretas utilizando una estructura genérica proporcionada por el lenguaje EOPL (Essentials of Programming Languages).

## Definición del Tipo de Dato `arbol-b`

```scheme
#lang eopl
#|
<arbol-b> ::= <int>
              leaf(num)
          ::= <symbol> <arbol-b> <arbol-b>
              node(key,left,right)
|#

;; Definición del tipo de dato árbol binario
(define-datatype arbol-b arbol-b?
  (leaf (num number?))           ; Variante hoja: contiene un número
  (node                          ; Variante nodo: contiene una clave y dos subárboles
   (key symbol?)                ; Campo clave: símbolo
   (left arbol-b?)              ; Campo izquierdo: árbol binario
   (right arbol-b?)             ; Campo derecho: árbol binario
   )
  )

;; Ejemplo de construcción de un árbol binario
(define arbol1
  (node 'k                       ; Nodo raíz con clave 'k
        (node 's                 ; Subárbol izquierdo: nodo con clave 's
              (leaf 10)          ;   Hoja izquierda con valor 10
              (leaf 20))         ;   Hoja derecha con valor 20
        (node 'k                 ; Subárbol derecho: nodo con clave 'k
              (leaf 30)          ;   Hoja izquierda con valor 30
              (leaf 40))))       ;   Hoja derecha con valor 40
```

## Explicación de `define-datatype`

La macro `define-datatype` permite generar constructores, predicados y patrones para crear nuevos tipos de datos. En este caso, definimos un árbol binario. La estructura general es:

```scheme
(define-datatype <nombre-tipo> <nombre-predicado>
   (variante1
	   (campo1 tipo1)      ; Campo 1 con su predicado de tipo
	   (campo2 tipo2)      ; Campo 2 con su predicado de tipo
	   ...
	   (campon tipon)      ; Campo n con su predicado de tipo
   )
   ...
   (varianten ......)      ; Otras variantes del tipo
)
```

### Elementos generados por `define-datatype`:

1. **Funciones constructoras**: `variante1`, `variante2`, ..., `varianten` que permiten crear instancias del tipo.
2. **Función predicado**: `nombre-predicado` que verifica si un valor pertenece al tipo definido.
3. **Patrones para reconocimiento**: Estructuras que pueden usarse con `cases` para hacer pattern matching.

## Reconocimiento de Patrones con `cases`

La forma `cases` permite hacer reconocimiento de patrones sobre el tipo de dato, extrayendo los elementos internos de cada variante:

```scheme
;; arbol->list: arbol-b -> lista de números
;; Convierte un árbol binario en una lista plana de números
(define arbol->list
  (lambda (arb)
    (cases arbol-b arb                     ; Analiza el árbol 'arb' de tipo arbol-b
      (leaf (num) (list num))              ; Caso hoja: devuelve lista con el número
      (node (key left right)               ; Caso nodo: extrae clave, subárbol izquierdo y derecho
            (append
             (arbol->list left)            ; Recursión sobre subárbol izquierdo
             (arbol->list right)           ; Recursión sobre subárbol derecho
             )
            )
      )
    )
  )
```

### Estructura de `cases`:

```scheme
cases <tipo> <variable>
  (variante1 (campo1 campo2 ... campok) expresion)
  ...
  (varianten (campo1 campo2 ... campom) expresion)
```

Los `cases` integran predicados con extractores, permitiendo:
- Verificar qué variante del tipo tiene el valor
- Extraer automáticamente los campos de esa variante
- Ejecutar código específico para cada variante

## Conceptos Teóricos Importantes

### Tipos de Datos Algebraicos (ADTs)
Los tipos definidos con `define-datatype` son ejemplos de **tipos de datos algebraicos**, que pueden ser:
- **Productos**: Estructuras que contienen múltiples campos (como `node`)
- **Sumas**: Alternativas entre diferentes variantes (como `leaf` o `node`)
- **Recursivos**: Pueden contener instancias de sí mismos (como `arbol-b`)

### Pattern Matching
El reconocimiento de patrones es una técnica fundamental en lenguajes funcionales que permite:
- Desestructurar datos complejos
- Ejecutar código condicional basado en la estructura de los datos
- Evitar el uso explícito de predicados y extractores

### Abstracción de Datos
`define-datatype` proporciona un mecanismo para definir TADs que:
- Ocultan la representación interna
- Proporcionan una interfaz bien definida (constructores y observadores)
- Garantizan la integridad de los datos mediante verificaciones de tipo

## Tabla de Resumen

| Concepto | Descripción | Ejemplo en Código |
|----------|-------------|-------------------|
| **`define-datatype`** | Macro para definir nuevos tipos de datos con variantes | `(define-datatype arbol-b arbol-b? ...)` |
| **Variante** | Una forma posible del tipo de dato | `leaf` y `node` para `arbol-b` |
| **Constructor** | Función que crea instancias de una variante | `(leaf 10)`, `(node 'k left right)` |
| **Predicado de tipo** | Función que verifica si un valor es del tipo | `arbol-b?` |
| **`cases`** | Forma para reconocimiento de patrones sobre tipos definidos | `(cases arbol-b arb ...)` |
| **Pattern Matching** | Técnica para desestructurar datos basada en su forma | Extraer `key`, `left`, `right` de `node` |
| **Tipo Recursivo** | Tipo que se define en términos de sí mismo | `arbol-b` contiene `arbol-b` en `node` |
| **Observadores** | Procedimientos que extraen información del tipo | Los patrones en `cases` actúan como observadores |

## Comentarios Adicionales

### Ventajas de `define-datatype`
1. **Seguridad de tipos**: Los constructores verifican que los valores cumplan con los predicados especificados.
2. **Abstracción completa**: Separa la interfaz pública de la implementación interna.
3. **Pattern matching integrado**: Elimina la necesidad de escribir manualmente predicados y extractores.
4. **Documentación implícita**: La estructura del tipo sirve como documentación de su diseño.

### Consideraciones de Diseño
- Cada variante debe tener un conjunto único de constructores para evitar ambigüedades.
- Los tipos recursivos deben incluir casos base (como `leaf`) para terminar la recursión.
- El uso de `cases` es más seguro que el acceso directo a campos, ya que verifica la variante antes de extraer.

### Aplicaciones Típicas
- Representación de estructuras de datos (árboles, grafos, listas)
- Implementación de lenguajes (ASTs - Abstract Syntax Trees)
- Modelado de estados en máquinas de estado
- Parsing y procesamiento de datos estructurados

### Relación con Otros Paradigmas
En programación orientada a objetos, los tipos definidos con `define-datatype` serían equivalentes a jerarquías de clases con métodos virtuales, donde cada variante es una subclase y `cases` es similar a un switch sobre el tipo dinámico.