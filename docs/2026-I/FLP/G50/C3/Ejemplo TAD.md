# Ejemplo TAD: Árboles con Hojas Mixtas

# Ejercicio

Tenemos el tipo de dato árbol definido por la siguiente gramática:

```ebnf
<tree> ::= <int>                                leaf-int (n)
         ::= <symbol>                        leaf-symbol(s)
         ::= <int> <tree> <tree>       node-int(key, l, r)
         ::= <symbol> <tree> <tree> node-symbol(key,l,r)
```

**Tareas:**
1. Hacer los constructores
2. Hacer los observadores (predicados, extractores)
3. Definir un árbol de ejemplo
4. Implementar las funciones:
   - `tree->list-int`: extrae todos los enteros del árbol
   - `tree->list-sym`: extrae todos los símbolos del árbol

# Implementación basada en Listas

```scheme
#lang eopl
#|
Tipo de dato árbol con hojas mixtas (enteros y símbolos)

Gramática:
<tree> ::= <int>                                leaf-int (n)
         ::= <symbol>                        leaf-symbol(s)
         ::= <int> <tree> <tree>       node-int(key, l, r)
         ::= <symbol> <tree> <tree> node-symbol(key,l,r)

Implementación basada en listas: cada árbol se representa como una lista
con un símbolo que identifica su tipo seguido de sus componentes.
|#

;; --- CONSTRUCTORES (Interfaz del TAD) ---

; leaf-int: int -> leaf-int
; Crea una hoja que contiene un entero.
(define leaf-int
  (lambda (n)
    (list 'leaf-int n)))  ; Representación: ('leaf-int n)

; leaf-symbol: symbol -> leaf-symbol
; Crea una hoja que contiene un símbolo.
(define leaf-symbol
  (lambda (s)
    (list 'leaf-symbol s)))  ; Representación: ('leaf-symbol s)

; node-int: int × tree × tree -> node-int
; Crea un nodo interno con una clave entera y dos subárboles.
(define node-int
  (lambda (key l r)
    (list 'node-int key l r)))  ; Representación: ('node-int clave izquierdo derecho)

; node-symbol: symbol × tree × tree -> node-symbol
; Crea un nodo interno con una clave simbólica y dos subárboles.
(define node-symbol
  (lambda (key l r)
    (list 'node-symbol key l r)))  ; Representación: ('node-symbol clave izquierdo derecho)

;; --- PREDICADOS (Interfaz del TAD) ---

; leaf-int?: any -> boolean
; Determina si un valor es una hoja entera.
(define leaf-int?
  (lambda (tree)
    (equal? (car tree) 'leaf-int)))  ; Verifica si el primer elemento es 'leaf-int'

; leaf-symbol?: any -> boolean
; Determina si un valor es una hoja simbólica.
(define leaf-symbol?
  (lambda (tree)
    (equal? (car tree) 'leaf-symbol)))  ; Verifica si el primer elemento es 'leaf-symbol'

; node-int?: any -> boolean
; Determina si un valor es un nodo con clave entera.
(define node-int?
  (lambda (tree)
    (equal? (car tree) 'node-int)))  ; Verifica si el primer elemento es 'node-int'

; node-symbol?: any -> boolean
; Determina si un valor es un nodo con clave simbólica.
(define node-symbol?
  (lambda (tree)
    (equal? (car tree) 'node-symbol)))  ; Verifica si el primer elemento es 'node-symbol'

;; --- EXTRACTORES (Interfaz del TAD) ---

; leaf-int->n: leaf-int -> int
; Extrae el entero de una hoja entera.
(define leaf-int->n
  (lambda (tree)
    (cadr tree)))  ; El entero está en la segunda posición

; leaf-symbol->s: leaf-symbol -> symbol
; Extrae el símbolo de una hoja simbólica.
(define leaf-symbol->s
  (lambda (tree)
    (cadr tree)))  ; El símbolo está en la segunda posición

; node-int->key: node-int -> int
; Extrae la clave entera de un nodo.
(define node-int->key
  (lambda (tree)
    (cadr tree)))  ; La clave está en la segunda posición

; node-int->l: node-int -> tree
; Extrae el subárbol izquierdo de un nodo entero.
(define node-int->l
  (lambda (tree)
    (caddr tree)))  ; El subárbol izquierdo está en la tercera posición

; node-int->r: node-int -> tree
; Extrae el subárbol derecho de un nodo entero.
(define node-int->r
  (lambda (tree)
    (cadddr tree)))  ; El subárbol derecho está en la cuarta posición

; node-symbol->key: node-symbol -> symbol
; Extrae la clave simbólica de un nodo.
(define node-symbol->key
  (lambda (tree)
    (cadr tree)))  ; La clave está en la segunda posición

; node-symbol->l: node-symbol -> tree
; Extrae el subárbol izquierdo de un nodo simbólico.
(define node-symbol->l
  (lambda (tree)
    (caddr tree)))  ; El subárbol izquierdo está en la tercera posición

; node-symbol->r: node-symbol -> tree
; Extrae el subárbol derecho de un nodo simbólico.
(define node-symbol->r
  (lambda (tree)
    (cadddr tree)))  ; El subárbol derecho está en la cuarta posición

;; --- ÁREA DEL PROGRAMADOR (Usando el TAD) ---

; Ejemplo de árbol:
;        k
;       / \
;      1   2
;     / \ / \
;    5  4 3  6
;        / \ / \
;       p  s t  w
(define arb
  (node-symbol 'k
               (node-int 1 (leaf-int 5) (leaf-int 4))
               (node-int 2
                         (node-int 3 (leaf-symbol 'p) (leaf-symbol 's))
                         (node-int 6 (leaf-symbol 't) (leaf-symbol 'w)))))

; tree->list-int: tree -> list of numbers
; Extrae todos los enteros del árbol en un recorrido preorden.
; Estrategia:
; - Hoja entera: devuelve lista con el entero
; - Hoja simbólica: devuelve lista vacía
; - Nodo entero: incluye la clave y procesa recursivamente los subárboles
; - Nodo simbólico: procesa recursivamente los subárboles (ignora la clave simbólica)
(define tree->list-int
  (lambda (tree)
    (cond
      [(leaf-int? tree) (list (leaf-int->n tree))]  ; Caso base: hoja entera
      [(leaf-symbol? tree) '()]                     ; Caso base: hoja simbólica
      [(node-int? tree)                             ; Caso recursivo: nodo entero
       (append
        (list (node-int->key tree))                 ; Incluye la clave
        (tree->list-int (node-int->l tree))         ; Procesa subárbol izquierdo
        (tree->list-int (node-int->r tree)))]       ; Procesa subárbol derecho
      [(node-symbol? tree)                          ; Caso recursivo: nodo simbólico
       (append
        (tree->list-int (node-symbol->l tree))      ; Procesa subárbol izquierdo
        (tree->list-int (node-symbol->r tree)))]    ; Procesa subárbol derecho
      [else (eopl:error "No es un árbol")])))

; Prueba: debe devolver (1 5 4 2 3 6)
(newline)
(display "Enteros en el árbol: ")
(display (tree->list-int arb))

; tree->list-symbol: tree -> list of symbols
; Extrae todos los símbolos del árbol en un recorrido preorden.
; Estrategia:
; - Hoja entera: devuelve lista vacía
; - Hoja simbólica: devuelve lista con el símbolo
; - Nodo entero: procesa recursivamente los subárboles (ignora la clave entera)
; - Nodo simbólico: incluye la clave y procesa recursivamente los subárboles
(define tree->list-symbol
  (lambda (tree)
    (cond
      [(leaf-int? tree) '()]                        ; Caso base: hoja entera
      [(leaf-symbol? tree) (list (leaf-symbol->s tree))]  ; Caso base: hoja simbólica
      [(node-int? tree)                             ; Caso recursivo: nodo entero
       (append
        (tree->list-symbol (node-int->l tree))      ; Procesa subárbol izquierdo
        (tree->list-symbol (node-int->r tree)))]    ; Procesa subárbol derecho
      [(node-symbol? tree)                          ; Caso recursivo: nodo simbólico
       (append
        (list (node-symbol->key tree))              ; Incluye la clave
        (tree->list-symbol (node-symbol->l tree))   ; Procesa subárbol izquierdo
        (tree->list-symbol (node-symbol->r tree)))] ; Procesa subárbol derecho
      [else (eopl:error "No es un árbol")])))

; Prueba: debe devolver (k p s t w)
(newline)
(display "Símbolos en el árbol: ")
(display (tree->list-symbol arb))
```

# Implementación basada en Procedimientos

Aquí estamos modelando el comportamiento: lo que queremos de cada tipo de árbol es poder consultar qué es y extraer su información.

```scheme
#lang eopl
#|
Tipo de dato árbol con hojas mixtas (enteros y símbolos)

Gramática:
<tree> ::= <int>                                leaf-int (n)
         ::= <symbol>                        leaf-symbol(s)
         ::= <int> <tree> <tree>       node-int(key, l, r)
         ::= <symbol> <tree> <tree> node-symbol(key,l,r)

Implementación basada en procedimientos: cada árbol se representa como una función
(closure) que acepta un selector y devuelve el componente correspondiente.
|#

;; --- CONSTRUCTORES (Interfaz del TAD) ---

; leaf-int: int -> leaf-int
; Crea una hoja entera representada como una función.
; Selector 0: tipo ('leaf-int)
; Selector 1: valor entero
(define leaf-int
  (lambda (n)
    (lambda (s)  ; La hoja es una función que toma un selector
      (cond
        [(= s 0) 'leaf-int]    ; Tipo de la hoja
        [(= s 1) n]            ; Valor entero
        [else (eopl:error "Error en leaf-int: selector inválido")]))))

; leaf-symbol: symbol -> leaf-symbol
; Crea una hoja simbólica representada como una función.
; Selector 0: tipo ('leaf-symbol)
; Selector 1: valor simbólico
(define leaf-symbol
  (lambda (s)
    (lambda (sng)  ; Nota: el parámetro se llama sng para evitar conflicto con s
      (cond
        [(= sng 0) 'leaf-symbol]  ; Tipo de la hoja
        [(= sng 1) s]             ; Valor simbólico
        [else (eopl:error "Error en leaf-symbol: selector inválido")]))))

; node-int: int × tree × tree -> node-int
; Crea un nodo entero representado como una función.
; Selector 0: tipo ('node-int)
; Selector 1: clave entera
; Selector 2: subárbol izquierdo
; Selector 3: subárbol derecho
(define node-int
  (lambda (key l r)
    (lambda (s)
      (cond
        [(= s 0) 'node-int]  ; Tipo del nodo
        [(= s 1) key]        ; Clave entera
        [(= s 2) l]          ; Subárbol izquierdo
        [(= s 3) r]          ; Subárbol derecho
        [else (eopl:error "Error en node-int: selector inválido")]))))

; node-symbol: symbol × tree × tree -> node-symbol
; Crea un nodo simbólico representado como una función.
; Selector 0: tipo ('node-symbol)
; Selector 1: clave simbólica
; Selector 2: subárbol izquierdo
; Selector 3: subárbol derecho
(define node-symbol
  (lambda (key l r)
    (lambda (s)
      (cond
        [(= s 0) 'node-symbol]  ; Tipo del nodo
        [(= s 1) key]           ; Clave simbólica
        [(= s 2) l]             ; Subárbol izquierdo
        [(= s 3) r]             ; Subárbol derecho
        [else (eopl:error "Error en node-symbol: selector inválido")]))))

;; --- PREDICADOS (Interfaz del TAD) ---

; leaf-int?: any -> boolean
; Determina si un valor es una hoja entera.
; Aplica la función con selector 0 y verifica si devuelve 'leaf-int'
(define leaf-int?
  (lambda (tree)
    (equal? (tree 0) 'leaf-int)))  ; tree es una función

; leaf-symbol?: any -> boolean
; Determina si un valor es una hoja simbólica.
(define leaf-symbol?
  (lambda (tree)
    (equal? (tree 0) 'leaf-symbol)))  ; tree es una función

; node-int?: any -> boolean
; Determina si un valor es un nodo con clave entera.
(define node-int?
  (lambda (tree)
    (equal? (tree 0) 'node-int)))  ; tree es una función

; node-symbol?: any -> boolean
; Determina si un valor es un nodo con clave simbólica.
(define node-symbol?
  (lambda (tree)
    (equal? (tree 0) 'node-symbol)))  ; tree es una función

;; --- EXTRACTORES (Interfaz del TAD) ---

; leaf-int->n: leaf-int -> int
; Extrae el entero de una hoja entera.
; Aplica la función con selector 1
(define leaf-int->n
  (lambda (tree)
    (tree 1)))  ; tree es una función

; leaf-symbol->s: leaf-symbol -> symbol
; Extrae el símbolo de una hoja simbólica.
(define leaf-symbol->s
  (lambda (tree)
    (tree 1)))  ; tree es una función

; node-int->key: node-int -> int
; Extrae la clave entera de un nodo.
(define node-int->key
  (lambda (tree)
    (tree 1)))  ; tree es una función

; node-int->l: node-int -> tree
; Extrae el subárbol izquierdo de un nodo entero.
(define node-int->l
  (lambda (tree)
    (tree 2)))  ; tree es una función

; node-int->r: node-int -> tree
; Extrae el subárbol derecho de un nodo entero.
(define node-int->r
  (lambda (tree)
    (tree 3)))  ; tree es una función

; node-symbol->key: node-symbol -> symbol
; Extrae la clave simbólica de un nodo.
(define node-symbol->key
  (lambda (tree)
    (tree 1)))  ; tree es una función

; node-symbol->l: node-symbol -> tree
; Extrae el subárbol izquierdo de un nodo simbólico.
(define node-symbol->l
  (lambda (tree)
    (tree 2)))  ; tree es una función

; node-symbol->r: node-symbol -> tree
; Extrae el subárbol derecho de un nodo simbólico.
(define node-symbol->r
  (lambda (tree)
    (tree 3)))  ; tree es una función

;; --- ÁREA DEL PROGRAMADOR (Usando el TAD) ---
;; NOTA: Este código es IDÉNTICO al de la representación basada en listas.
;; La abstracción permite cambiar la implementación sin afectar el código del usuario.

; Mismo árbol de ejemplo
(define arb
  (node-symbol 'k
               (node-int 1 (leaf-int 5) (leaf-int 4))
               (node-int 2
                         (node-int 3 (leaf-symbol 'p) (leaf-symbol 's))
                         (node-int 6 (leaf-symbol 't) (leaf-symbol 'w)))))

; tree->list-int: tree -> list of numbers
; Misma implementación que en la representación basada en listas
(define tree->list-int
  (lambda (tree)
    (cond
      [(leaf-int? tree) (list (leaf-int->n tree))]
      [(leaf-symbol? tree) '()]
      [(node-int? tree)
       (append
        (list (node-int->key tree))
        (tree->list-int (node-int->l tree))
        (tree->list-int (node-int->r tree)))]
      [(node-symbol? tree)
       (append
        (tree->list-symbol (node-symbol->l tree))
        (tree->list-symbol (node-symbol->r tree)))]
      [else (eopl:error "No es un árbol")])))

; Prueba: mismos resultados
(newline)
(display "Enteros en el árbol (procedural): ")
(display (tree->list-int arb))

; tree->list-symbol: tree -> list of symbols
; Misma implementación que en la representación basada en listas
(define tree->list-symbol
  (lambda (tree)
    (cond
      [(leaf-int? tree) '()]
      [(leaf-symbol? tree) (list (leaf-symbol->s tree))]
      [(node-int? tree)
       (append
        (tree->list-int (node-int->l tree))
        (tree->list-int (node-int->r tree)))]
      [(node-symbol? tree)
       (append
        (list (node-symbol->key tree))
        (tree->list-symbol (node-symbol->l tree))
        (tree->list-symbol (node-symbol->r tree)))]
      [else (eopl:error "No es un árbol")])))

; Prueba: mismos resultados
(newline)
(display "Símbolos en el árbol (procedural): ")
(display (tree->list-symbol arb))
```

# Tabla de Resumen: TAD para Árboles con Hojas Mixtas

| Concepto | Definición | Ejemplo en el Código | Propósito/Importancia |
| :--- | :--- | :--- | :--- |
| **Árbol con Hojas Mixtas** | Estructura de datos arbórea donde las hojas pueden contener enteros o símbolos, y los nodos internos pueden tener claves enteras o simbólicas. | `leaf-int`, `leaf-symbol`, `node-int`, `node-symbol`. | Ejemplo de TAD complejo que maneja múltiples tipos de datos en una misma estructura. |
| **Hoja (Leaf)** | Nodo terminal del árbol que contiene un valor pero no tiene hijos. | `leaf-int 5`, `leaf-symbol 'p`. | Representa los datos almacenados en los extremos del árbol. |
| **Nodo Interno (Node)** | Nodo no terminal que tiene una clave y dos subárboles hijos. | `node-int 1 left right`, `node-symbol 'k' left right`. | Estructura que permite organizar jerárquicamente los datos. |
| **Recorrido Preorden** | Estrategia de recorrido: raíz, subárbol izquierdo, subárbol derecho. | En `tree->list-int` y `tree->list-symbol`. | Método sistemático para visitar todos los nodos de un árbol. |
| **Polimorfismo de Estructura** | Capacidad de una estructura de datos para contener elementos de diferentes tipos. | Árbol que puede tener hojas enteras o simbólicas, nodos enteros o simbólicos. | Aumenta la flexibilidad y expresividad del tipo de dato. |
| **Dispatch por Tipo** | Mecanismo para ejecutar código diferente según el tipo de dato. | Condicional con `leaf-int?`, `leaf-symbol?`, etc. en `tree->list-int`. | Permite procesar cada variante del TAD de manera apropiada. |
| **Separación de Interfaz/Implementación** | Principio de diseño donde el uso del TAD es independiente de su representación interna. | Mismo código de usuario (`tree->list-int`) funciona con ambas implementaciones. | Facilita el mantenimiento y la evolución del software. |
| **Closure como Representación** | Uso de funciones (closures) para encapsular datos y comportamiento. | `(lambda (s) ...)` en la implementación procedural. | Técnica poderosa para implementar objetos y abstracciones de datos. |
| **Selectores Numéricos** | Argumentos numéricos que indican qué componente se solicita a una representación procedural. | `0` para tipo, `1` para primer componente, `2` para segundo, etc. | Interfaz uniforme para acceder a componentes de estructuras heterogéneas. |
| **Invariantes del TAD** | Propiedades que deben mantenerse para todas las instancias válidas del tipo. | Un `leaf-int` siempre contiene un entero, un `node-int` siempre tiene dos subárboles válidos. | Garantizan la corrección y consistencia de las operaciones. |

# Comentarios Adicionales sobre el Tema

1. **Diseño de TADs Complejos**: Este ejemplo muestra cómo diseñar un TAD que maneja múltiples variantes (4 constructores diferentes). El patrón es:
   - Definir una gramática que especifique todas las variantes.
   - Implementar constructores para cada variante.
   - Implementar predicados para identificar cada variante.
   - Implementar extractores para acceder a los componentes de cada variante.

2. **Patrón de Recorrido Recursivo**: Las funciones `tree->list-int` y `tree->list-symbol` siguen un patrón común:
   - Casos base para las hojas (tratamiento diferente según el tipo de hoja).
   - Casos recursivos para los nodos (procesamiento de la clave y los subárboles).
   - El orden de procesamiento (preorden) está determinado por el orden en que se concatenan las listas.

4. **Ventajas de la Representación Procedural**:
   - **Encapsulación fuerte**: El usuario no puede acceder a la estructura interna de ninguna manera excepto a través de la interfaz.
   - **Validación centralizada**: Los constructores pueden validar todos los argumentos.
   - **Mensajes de error específicos**: Cada constructor puede dar mensajes de error apropiados para su tipo.
   - **Flexibilidad para cambios**: Se puede cambiar completamente la representación interna sin afectar el código del usuario.

5. **Aplicaciones de Árboles con Hojas Mixtas**:
   - **Árboles de sintaxis abstracta (AST)**: En compiladores, los nodos pueden representar operadores (símbolos) y las hojas pueden representar literales (enteros, símbolos).
   - **Estructuras de datos heterogéneas**: Cuando se necesita almacenar datos de diferentes tipos en una misma jerarquía.
   - **Árboles de decisión**: Donde los nodos internos son condiciones y las hojas son resultados.

6. **Extensibilidad del Diseño**: Para agregar nuevos tipos de nodos (ej: `node-bool` para claves booleanas), solo se necesita:
   - Agregar un nuevo constructor a la interfaz.
   - Agregar predicados y extractores correspondientes.
   - Actualizar las funciones que procesan árboles para manejar el nuevo caso.
   - El código existente del usuario seguirá funcionando.

7. **Principio de Abstracción en Acción**: Este ejemplo demuestra perfectamente el principio de abstracción de datos. El usuario que escribe `tree->list-int` no necesita saber si los árboles se representan como listas o como procedimientos. Solo necesita conocer la interfaz (constructores, predicados, extractores).

8. **Relación con Patrones de Diseño Modernos**: La implementación basada en procedimientos es un precursor de:
   - **Patrón Strategy**: Cada tipo de árbol implementa su propia estrategia para responder a selectores.
   - **Patrón Factory**: Los constructores actúan como fábricas que producen objetos con interfaz uniforme.
   - **Programación Orientada a Objetos**: Cada "objeto" árbol sabe cómo responder a mensajes.