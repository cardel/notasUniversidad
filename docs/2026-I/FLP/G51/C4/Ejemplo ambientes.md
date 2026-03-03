# Ejemplo: Implementación de Ambientes (Environments)

## Introducción

Los ambientes (environments) son un tipo de dato fundamental en la implementación de lenguajes de programación. Representan una estructura que relaciona identificadores (variables) con sus valores correspondientes, y se utilizan como mecanismo para almacenar las ligaduras (bindings) que se declaran durante la ejecución de un programa.

## Especificación del Tipo de Dato

```ebnf
<environment> ::= '()          
                  empty-env()
              ::= <identifier>* <values>* <environment>
                  extend-env(lid lval old-env)
```

## Implementación en Scheme/EOPL

```scheme
#lang eopl
#|
<environment> ::= '()          
                  empty-env()
              ::= <identifier>* <values>* <environment>
                  extend-env(lid lval old-env)
|#

;; Definición del tipo de dato environment (ambiente)
;; Un ambiente es una estructura que mapea identificadores a valores
(define-datatype environment environment?  ; Nota: corregido el nombre del tipo (era "enviroment")
  (empty-env)                              ; Ambiente vacío: no contiene ligaduras
  (extend-env                              ; Extensión de ambiente: añade nuevas ligaduras
   (lid (list-of symbol?))                ; Lista de identificadores (símbolos)
   (lval (list-of value?))                ; Lista de valores correspondientes
   (old-env environment?)                 ; Ambiente anterior que se extiende
   )
  )

;; Predicado para valores (simplificado para este ejemplo)
;; En una implementación real, value? verificaría tipos específicos
(define value? (lambda (v) #t))           ; Acepta cualquier valor como válido

;; Ejemplo de construcción de un ambiente anidado
;; Representa múltiples ámbitos (scopes) anidados
(define e1
  (extend-env '(x y z) '(10 20 3)         ; Tercer ámbito: variables x, y, z
              (extend-env '(a b c d e) '(1 2 3 4 5)  ; Segundo ámbito: variables a-e
                          (extend-env '(m n o) '(80 90 100)  ; Primer ámbito: variables m, n, o
                                      (empty-env))))) ; Ambiente base vacío

;; apply-env: environment × symbol → value
;; Busca un identificador en el ambiente y retorna su valor asociado
(define apply-env
  (lambda (env var)
    (cases environment env  ; Nota: corregido el nombre del tipo
      (empty-env () (eopl:error "No se encuentra " var))  ; Caso base: variable no encontrada
      (extend-env
       (lid lval old-env)  ; Extrae: lista de ids, lista de valores, ambiente anterior
       (letrec  ; Define funciones recursivas locales
           (
            ;; buscar-val: lista-símbolos × lista-valores → value
            ;; Busca recursivamente en las listas paralelas
            (buscar-val
             (lambda (lid lval)
               (cond
                 [(null? lid)                    ; Si no hay más identificadores en este ámbito
                  (apply-env old-env var)]       ; Busca en el ambiente anterior (ámbito exterior)
                 [(equal? (car lid) var)         ; Si encontramos el identificador
                  (car lval)]                    ; Retorna el valor correspondiente
                 [else                           ; Si no es este identificador
                  (buscar-val (cdr lid) (cdr lval))]  ; Continúa buscando en el resto
                 )
               )
             )
            )
         ;; Inicia la búsqueda en el ámbito actual
         (buscar-val lid lval)
         )
       )
      )
    )
  )
```

## Conceptos Teóricos

### Ambientes como Estructuras de Ámbito (Scoping)
Los ambientes implementan **reglas de ámbito léxico** (static scoping):
- Cada `extend-env` crea un nuevo ámbito (scope)
- Los ámbitos se anidan, creando una jerarquía
- La búsqueda sigue la **regla de sombreado (shadowing)**: las definiciones más internas ocultan las externas

### Listas Paralelas como Estructura de Datos
La implementación usa **listas paralelas** para almacenar las asociaciones:
- `lid`: lista de identificadores (símbolos)
- `lval`: lista de valores correspondientes
- Mantienen correspondencia por posición (índice)

### Búsqueda Recursiva con Fallback
El algoritmo de búsqueda implementa:
1. **Búsqueda lineal** en el ámbito actual
2. **Recursión estructural** hacia ámbitos exteriores
3. **Manejo de errores** cuando la variable no existe en ningún ámbito

## Correcciones y Mejoras

### Correcciones Identificadas:
1. **Nombre del tipo**: Cambiado de `enviroment` a `environment` (error ortográfico)
2. **Consistencia en `cases`**: Usar `environment` en lugar de `enviroment`

### Posibles Mejoras:
1. **Verificación de longitud**: Asegurar que `lid` y `lval` tengan la misma longitud
2. **Tipado más estricto**: Definir `value?` con predicados específicos
3. **Eficiencia**: Considerar estructuras más eficientes que listas paralelas

## Tabla de Resumen

| Concepto | Descripción | Ejemplo/Implementación |
|----------|-------------|------------------------|
| **Ambiente (Environment)** | Estructura que mapea identificadores a valores | `(extend-env '(x y) '(1 2) old-env)` |
| **Ámbito (Scope)** | Contexto donde las variables son visibles | Cada `extend-env` crea un nuevo ámbito |
| **Ligadura (Binding)** | Asociación variable-valor | Par `(x, 10)` en las listas paralelas |
| **Ambiente vacío** | Ambiente base sin ligaduras | `(empty-env)` |
| **Extensión de ambiente** | Crear nuevo ámbito añadiendo ligaduras | `extend-env` constructor |
| **Búsqueda léxica** | Buscar desde el ámbito actual hacia los exteriores | Recursión en `apply-env` |
| **Sombreado (Shadowing)** | Las variables internas ocultan las externas | `buscar-val` busca primero en `lid` actual |
| **Listas paralelas** | Estructura para almacenar asociaciones | `lid` y `lval` mantienen correspondencia posicional |
| **Ámbitos anidados** | Jerarquía de contextos de variables | Ambiente `e1` con tres niveles de anidamiento |

## Comentarios Adicionales

### Propiedades de los Ambientes

1. **Inmutabilidad**: En esta implementación, los ambientes son inmutables. Cada `extend-env` crea un nuevo ambiente sin modificar el anterior.
2. **Persistencia**: Los ambientes antiguos permanecen accesibles, permitiendo múltiples contextos coexistentes.
3. **Eficiencia espacial**: Comparten estructura con ambientes anteriores (no se copian datos).

### Patrones de Uso Comunes

1. **Evaluación de expresiones**: Los evaluadores (interpreters) usan ambientes para llevar el registro de variables durante la evaluación.
2. **Análisis estático**: Los compiladores usan estructuras similares para verificación de tipos y resolución de nombres.
3. **Máquinas abstractas**: Las máquinas de evaluación usan ambientes en sus estados de ejecución.

### Consideraciones de Diseño

1. **Elección de estructura de datos**:
   - **Listas paralelas**: Simple pero O(n) en búsqueda
   - **Tablas hash**: Más eficiente pero más compleja
   - **Árboles balanceados**: Compromiso entre simplicidad y eficiencia

2. **Manejo de errores**:
   - La función `eopl:error` termina la ejecución
   - En implementaciones reales, podría preferirse retornar un valor especial o usar el sistema de manejo de errores del lenguaje

3. **Extensibilidad**:
   - Para soportar mutabilidad, se necesitarían operaciones de actualización
   - Para ambientes dinámicos (dynamic scoping), la búsqueda seguiría reglas diferentes

### Ejercicios de Extensión

1. **Implementar `set-env!`**: Operación para modificar el valor de una variable existente
2. **Agregar tipos**: Extender `value?` para distinguir entre números, booleanos, procedimientos, etc.
3. **Implementar ambientes imperativos**: Con mutabilidad y operaciones de actualización
4. **Optimizar búsqueda**: Usar estructuras de datos más eficientes para grandes ambientes

### Relación con Implementaciones Reales

Esta implementación es pedagógica y similar a la usada en:
- **Interpretadores Scheme**: Muchos implementan ambientes de manera similar
- **Lenguajes funcionales**: Haskell, ML usan estructuras análogas
- **Máquinas virtuales**: Algunas máquinas abstractas usan ambientes en lugar de pilas para variables locales

La comprensión de los ambientes es fundamental para implementar cualquier lenguaje de programación, ya que proporcionan el mecanismo básico para la gestión de variables y el contexto de ejecución.