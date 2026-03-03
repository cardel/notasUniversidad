# Define-datatype en EOPL

**Define-datatype** permite especificar un **Árbol de Sintaxis Abstracta (AST)** a partir de una gramática. Es una representación estructurada de los datos pertenecientes a una gramática, facilitando el procesamiento y análisis de expresiones en lenguajes de programación.

```scheme
#lang eopl
#|
Gramática de expresiones lambda:
<lc-exp> ::= <identifier>                            var-exp(id)
         ::= "lambda" "(" <identifier> ")" <lc-exp>  lambda-exp(id,exp)
         ::= "(" <lc-exp> <lc-exp> ")"               app-exp(rator, rand)
|#

(define-datatype lc-exp lc-exp?
  (var-exp (id symbol?))                    ; Variable: identificador
  (lambda-exp (id symbol?)                  ; Abstracción lambda: parámetro
              (exp lc-exp?))                ; y cuerpo
  (app-exp (rator lc-exp?)                  ; Aplicación: operador
           (rand lc-exp?))                  ; y operando
  )

;; Ejemplo: expresión lambda (λx.y)
(define exp1
  (lambda-exp 'x (var-exp 'y)))

;; occurs-free?: lc-exp × symbol → boolean
;; Determina si una variable ocurre libre en una expresión lambda.
;; Reglas:
;; - En var-exp: ocurre libre si el identificador coincide con la variable buscada.
;; - En lambda-exp: ocurre libre si la variable es diferente al parámetro
;;   y ocurre libre en el cuerpo de la abstracción.
;; - En app-exp: ocurre libre si ocurre libre en el operador o en el operando.
(define occurs-free?
  (lambda (exp var)
    (cases lc-exp exp
      (var-exp (id) (eqv? var id))          ; Caso base: variable
      (lambda-exp (id exp)
        (and
         (not (eqv? var id))                ; Diferente del parámetro ligado
         (occurs-free? exp var)))           ; Recurre en el cuerpo
      (app-exp (rator rand)
               (or
                (occurs-free? rator var)    ; Recurre en el operador
                (occurs-free? rand var)     ; Recurre en el operando
                )
               )
      )
    )
  )
```

## Consideraciones importantes

1. **Estructura de define-datatype**:
```scheme
(define-datatype <nombre-tipo> <nombre-predicado>
   (nombre-variante
       (nombre-campo tipo-validador)
   )
)
```
Donde `tipo-validador` puede ser: `symbol?`, `<nombre-predicado>`, `number?`, `string?`, o `(list-of <tipo>)`.

2. **Constructores**: Se generan automáticamente procedimientos constructores con los nombres de las variantes.

3. **Reconocimiento de patrones con `cases`**:
```scheme
(cases <nombre-tipo> expresión
   (nombre-variante (..campos..) ..cuerpo..)
   (else ..cuerpo-alternativo..)
)
```

## Ejemplo: Árbol binario

```scheme
#|
Gramática de árbol binario:
<bin-tree> ::= <int>                         leaf(number)
           ::= <symbol> <bin-tree> <bin-tree> node(key, left, right)
|#

(define-datatype bin-tree bin-tree?
  (leaf (number number?))                    ; Hoja: valor numérico
  (node (key symbol?)                        ; Nodo: clave simbólica
        (left bin-tree?)                     ; subárbol izquierdo
        (right bin-tree?))                   ; subárbol derecho
  )

;; Ejemplo: árbol binario con estructura jerárquica
(define tree1
  (node 'k
        (node 'p (leaf 2) (leaf 3))         ; Subárbol izquierdo
        (node 'u (leaf 4) (leaf 5))))       ; Subárbol derecho

;; tree->list: bin-tree → list-of-numbers
;; Convierte un árbol binario en una lista plana de todos sus números.
;; Recorre el árbol en orden (izquierda, derecha) y concatena resultados.
(define tree->list
  (lambda (tree)
    (cases bin-tree tree
      (leaf (number) (list number))          ; Hoja: lista con un elemento
      (node (key l r)
            (append
             (tree->list l)                  ; Recorre subárbol izquierdo
             (tree->list r))))))             ; Recorre subárbol derecho
```

## Ambientes (Environments)

Los ambientes son estructuras que asocian identificadores con valores, fundamentales para la evaluación en lenguajes de programación.

```scheme
#|
Gramática de ambientes:
<environment> ::= '()                                 empty-env()
              ::= <identifier>* <value>* environment  extend-env(lid lval old-env)
|#

(define-datatype environment environment?    ; Nota: corrección de "enviroment" a "environment"
  (empty-env)                                 ; Ambiente vacío
  (extend-env
   (lid (list-of symbol?))                   ; Lista de identificadores
   (lval (list-of value?))                   ; Lista de valores correspondientes
   (old-env environment?)))                  ; Ambiente anterior (encadenamiento)

;; Predicado de tipo para valores: acepta cualquier expresión de Racket
(define value?
  (lambda (exp) #t))

;; Ejemplo: ambiente con múltiples enlaces
(define e
  (extend-env '(x y z) '(1 2 3)              ; Enlaza x→1, y→2, z→3
              (extend-env '(a b c) '(4 5 6)  ; Enlaza a→4, b→5, c→6
                          (empty-env))))     ; Ambiente base vacío
```

**Nota**: Se corrigió el nombre del tipo de dato de `enviroment` a `environment` para mantener consistencia terminológica.

### Función `apply-env`

```scheme
;; apply-env: environment × symbol → value
;; Busca un identificador en un ambiente y retorna su valor asociado.
;; Si no se encuentra, lanza un error.
(define apply-env
  (lambda (env var)
    (cases environment env                    ; Nota: corrección de "enviroment" a "environment"
      (empty-env () (eopl:error "No se encuentra la variable " var))
      (extend-env (lid lval old-env)
                  (letrec
                   (
                    ;; search-value: list-of-symbols × list-of-values → value
                    ;; Busca recursivamente la variable en las listas de identificadores y valores.
                    (search-value
                     (lambda (lid lval)
                       (cond
                         [(null? lid) (apply-env old-env var)]  ; No encontrado: busca en ambiente anterior
                         [(eqv? (car lid) var) (car lval)]      ; Encontrado: retorna valor correspondiente
                         [else (search-value (cdr lid) (cdr lval))] ; Continúa búsqueda
                         )
                       )
                     )
                    )
                   (search-value lid lval)    ; Inicia búsqueda en el entorno actual
                   )
                  )
      )
    )
  )
```

## Conceptos teóricos clave

1. **Árbol de Sintaxis Abstracta (AST)**: Representación jerárquica de la estructura sintáctica de un programa, donde cada nodo corresponde a una construcción del lenguaje.

2. **Tipos de datos algebraicos**: `define-datatype` implementa tipos de datos algebraicos (sumas de productos), permitiendo definir estructuras de datos recursivas con múltiples variantes.

3. **Pattern matching**: La forma `cases` permite descomponer y analizar valores de tipos definidos con `define-datatype`, similar al pattern matching en lenguajes funcionales.

4. **Ambientes léxicos**: Estructuras que mantienen el mapeo entre identificadores y valores durante la evaluación. Implementan el encadenamiento estático (lexical scoping).

5. **Recursión estructural**: Las funciones sobre tipos recursivos (como `occurs-free?` y `tree->list`) siguen la estructura del dato, procesando subcomponentes recursivamente.

## Tabla de resumen

Concepto | Descripción | Ejemplo en código | Propósito
--- | --- | --- | ---
`define-datatype` | Define un tipo de dato algebraico con variantes | `(define-datatype lc-exp lc-exp? ...)` | Especificar ASTs y estructuras de datos
Constructor | Procedimiento que crea valores de una variante | `(var-exp 'x)`, `(lambda-exp 'x exp)` | Instanciar valores del tipo
Predicado de tipo | Función que verifica si un valor es del tipo | `lc-exp?`, `bin-tree?` | Validar valores en tiempo de ejecución
`cases` | Forma de reconocimiento de patrones | `(cases lc-exp exp ...)` | Descomponer y procesar valores del tipo
Variante | Caso particular de un tipo algebraico | `var-exp`, `lambda-exp`, `app-exp` | Representar diferentes formas del dato
Árbol de Sintaxis Abstracta | Representación estructurada de código | Expresiones lambda como `lc-exp` | Facilitar análisis y transformación de programas
Ambiente (Environment) | Estructura de enlaces identificador→valor | `extend-env`, `empty-env` | Gestionar el estado durante la evaluación
Recursión estructural | Patrón de recursión que sigue la estructura del dato | `occurs-free?`, `tree->list` | Procesar datos recursivos de forma natural

## Comentarios adicionales

- **Ventajas de `define-datatype`**: Proporciona verificación de tipos en tiempo de ejecución, constructores específicos para cada variante, y un mecanismo de pattern matching seguro que garantiza el manejo exhaustivo de casos.

- **Aplicaciones típicas**: 
  - Implementación de intérpretes y compiladores
  - Procesamiento de lenguajes de dominio específico (DSLs)
  - Representación de documentos estructurados (XML, JSON)
  - Implementación de estructuras de datos complejas

- **Relación con otros sistemas de tipos**: `define-datatype` es similar a los tipos de datos algebraicos en Haskell (`data`) o a las clases selladas en lenguajes OO, pero adaptado al paradigma funcional de Scheme.

- **Consideraciones de diseño**: Al definir gramáticas con `define-datatype`, es crucial mantener la correspondencia biunívoca entre las reglas de la gramática y las variantes del tipo de dato, asegurando que toda expresión válida tenga una representación única.

- **Extensibilidad**: Aunque `define-datatype` no permite añadir nuevas variantes a un tipo existente (es cerrado), esta restricción favorece el análisis exhaustivo de casos y mejora la seguridad del programa.

- **Uso en EOPL**: En el libro "Essentials of Programming Languages", `define-datatype` es la herramienta fundamental para implementar los intérpretes de los diferentes lenguajes de programación que se estudian, demostrando su utilidad en la enseñanza de conceptos de lenguajes de programación.