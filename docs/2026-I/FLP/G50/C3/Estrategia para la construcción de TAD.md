# Estrategia para la construcción de TAD

## 1. Definir los constructores de acuerdo a cada caso de la gramática
## 2. Definir los procedimientos observadores
   1. **Predicados**: Consultar a qué variante pertenece el TAD
   2. **Extractores**: Extraer toda pieza de información dentro del TAD

# Ejemplo con ambientes

Los **ambientes** (environments) son estructuras de datos fundamentales en la implementación de lenguajes de programación. Un ambiente asocia identificadores (variables) con sus valores, permitiendo resolver referencias a variables durante la evaluación de expresiones.

**Gramática para ambientes:**
```ebnf
<environment> ::= '()                    (empty-env)
              ::= <symbol> <value> <environment>  (extend-env id value old-env)
```

## Ejemplo con listas

```scheme
#lang eopl
#|
Ambientes permiten almacenar variables y sus valores

Gramática:
<environment> ::= '()                    (empty-env)
              ::= <symbol> <value> <environment>  (extend-env id value old-env)

Implementación basada en listas: cada ambiente se representa como una lista
con un símbolo que identifica su tipo seguido de sus componentes.
|#

;; --- CONSTRUCTORES (Interfaz del TAD) ---

; empty-env: -> empty-env
; Crea un ambiente vacío (sin asociaciones).
(define empty-env
  (lambda ()
    '(empty-env)))  ; Representación: ('empty-env)

; extend-env: symbol × value × environment -> extend-env
; Extiende un ambiente existente con una nueva asociación variable-valor.
; Si la variable ya existe en el ambiente, esta nueva asociación la "oculta".
(define extend-env
  (lambda (id val old-env)
    (list 'extend-env id val old-env)))  ; Representación: ('extend-env id valor ambiente-anterior)

;; --- OBSERVADORES (Interfaz del TAD) ---

;; 1. Predicados: Consultar pertenencias

; empty-env?: any -> boolean
; Determina si un valor es un ambiente vacío.
(define empty-env?
  (lambda (env)
    (equal? (car env) 'empty-env)))  ; Verifica si el primer elemento es 'empty-env'

; extend-env?: any -> boolean
; Determina si un valor es un ambiente extendido.
(define extend-env?
  (lambda (env)
    (equal? (car env) 'extend-env)))  ; Verifica si el primer elemento es 'extend-env'

;; 2. Extractores

; extend-env->id: extend-env -> symbol
; Extrae el identificador (variable) de un ambiente extendido.
(define extend-env->id
  (lambda (env)
    (cadr env)))  ; El identificador está en la segunda posición

; extend-env->val: extend-env -> value
; Extrae el valor asociado de un ambiente extendido.
(define extend-env->val
  (lambda (env)
    (caddr env)))  ; El valor está en la tercera posición

; extend-env->old-env: extend-env -> environment
; Extrae el ambiente anterior (base) de un ambiente extendido.
(define extend-env->old-env
  (lambda (env)
    (cadddr env)))  ; El ambiente anterior está en la cuarta posición

;; --- ÁREA DEL PROGRAMADOR (Usando el TAD) ---

; Ejemplo de ambiente: {d:6, y:8, x:7, y:14}
; Nota: hay dos asociaciones para 'y', la más reciente (y:8) oculta la anterior (y:14)
(define e
  (extend-env 'd 6
              (extend-env 'y 8
                          (extend-env 'x 7
                                      (extend-env 'y 14
                                                  (empty-env))))))

; apply-env: environment × symbol -> value
; Busca el valor asociado a una variable en un ambiente.
; Estrategia de búsqueda:
; 1. Si el ambiente está vacío: error (variable no encontrada)
; 2. Si la variable en la asociación más reciente coincide: devuelve su valor
; 3. Si no coincide: busca recursivamente en el ambiente anterior
; Esta implementación sigue la semántica de "shadowing" (ocultamiento):
; las asociaciones más recientes ocultan a las anteriores para la misma variable.
(define apply-env
  (lambda (env var)
    (cond
      [(empty-env? env) (eopl:error "No se encuentra " var)]  ; Caso base: variable no encontrada
      [(equal? (extend-env->id env) var)                      ; Caso: variable encontrada
       (extend-env->val env)]
      [else                                                   ; Caso recursivo: buscar en el ambiente anterior
       (apply-env (extend-env->old-env env) var)])))
```

## Ejemplo con procedimientos

```scheme
#lang eopl
#|
Ambientes permiten almacenar variables y sus valores

Gramática:
<environment> ::= '()                    (empty-env)
              ::= <symbol> <value> <environment>  (extend-env id value old-env)

Implementación basada en procedimientos: cada ambiente se representa como una función
(closure) que acepta un selector y devuelve el componente correspondiente.
Esta representación es más abstracta y encapsula completamente la estructura interna.
|#

;; --- CONSTRUCTORES (Interfaz del TAD) ---

; empty-env: -> empty-env
; Crea un ambiente vacío representado como una función.
; Selector 0: tipo ('empty-env)
(define empty-env
  (lambda ()
    (lambda (s)  ; El ambiente es una función que toma un selector
      (cond
        [(= s 0) 'empty-env]          ; Selector 0: tipo del ambiente
        [else (eopl:error "Señal inválida para empty-env")]))))

; extend-env: symbol × value × environment -> extend-env
; Extiende un ambiente existente con una nueva asociación.
; Representado como una función que responde a selectores:
; Selector 0: tipo ('extend-env)
; Selector 1: identificador (variable)
; Selector 2: valor asociado
; Selector 3: ambiente anterior
(define extend-env
  (lambda (id val old-env)
    (lambda (s)
      (cond
        [(= s 0) 'extend-env]        ; Selector 0: tipo del ambiente
        [(= s 1) id]                 ; Selector 1: identificador
        [(= s 2) val]                ; Selector 2: valor
        [(= s 3) old-env]            ; Selector 3: ambiente anterior
        [else (eopl:error "Señal inválida para extend-env")]))))

;; --- OBSERVADORES (Interfaz del TAD) ---

;; 1. Predicados: Consultar pertenencias

; empty-env?: any -> boolean
; Determina si un valor es un ambiente vacío.
; Aplica la función con selector 0 y verifica si devuelve 'empty-env'
(define empty-env?
  (lambda (env)
    (equal? (env 0) 'empty-env)))  ; env es una función

; extend-env?: any -> boolean
; Determina si un valor es un ambiente extendido.
(define extend-env?
  (lambda (env)
    (equal? (env 0) 'extend-env)))  ; env es una función

;; 2. Extractores

; extend-env->id: extend-env -> symbol
; Extrae el identificador de un ambiente extendido.
; Aplica la función con selector 1
(define extend-env->id
  (lambda (env)
    (env 1)))  ; env es una función

; extend-env->val: extend-env -> value
; Extrae el valor asociado de un ambiente extendido.
(define extend-env->val
  (lambda (env)
    (env 2)))  ; env es una función

; extend-env->old-env: extend-env -> environment
; Extrae el ambiente anterior de un ambiente extendido.
(define extend-env->old-env
  (lambda (env)
    (env 3)))  ; env es una función

;; --- ÁREA DEL PROGRAMADOR (Usando el TAD) ---
;; NOTA: Este código es IDÉNTICO al de la representación basada en listas.
;; La abstracción permite cambiar la implementación sin afectar el código del usuario.

; Mismo ambiente de ejemplo
(define e
  (extend-env 'd 6
              (extend-env 'y 8
                          (extend-env 'x 7
                                      (extend-env 'y 14
                                                  (empty-env))))))

; apply-env: environment × symbol -> value
; Misma implementación que en la representación basada en listas
(define apply-env
  (lambda (env var)
    (cond
      [(empty-env? env) (eopl:error "No se encuentra " var)]
      [(equal? (extend-env->id env) var)
       (extend-env->val env)]
      [else
       (apply-env (extend-env->old-env env) var)])))
```

# Tabla de Resumen: Estrategia para Construcción de TAD

| Concepto | Definición | Ejemplo en Ambientes | Propósito/Importancia |
| :--- | :--- | :--- | :--- |
| **Ambiente (Environment)** | Estructura que asocia identificadores (variables) con valores. | `(extend-env 'x 5 (empty-env))` | Fundamental para implementar el binding de variables en lenguajes de programación. |
| **Ambiente Vacío** | Ambiente sin asociaciones, punto de partida para construir ambientes. | `(empty-env)` | Representa el contexto inicial sin variables definidas. |
| **Extensión de Ambiente** | Operación que agrega una nueva asociación variable-valor a un ambiente existente. | `(extend-env id val old-env)` | Permite construir ambientes incrementalmente, simulando nuevos ámbitos. |
| **Shadowing (Ocultamiento)** | Semántica donde asociaciones más recientes ocultan a las anteriores para la misma variable. | `(extend-env 'x 2 (extend-env 'x 1 ...))` | Modela el comportamiento de variables locales que ocultan variables globales. |
| **apply-env** | Operación que busca el valor asociado a una variable en un ambiente. | `(apply-env env 'x)` | Implementa la resolución de referencias a variables durante la evaluación. |
| **Estrategia de Construcción** | Metodología sistemática para implementar TADs. | 1. Definir constructores<br>2. Definir observadores (predicados + extractores) | Garantiza una implementación completa y consistente del TAD. |
| **Constructores** | Operaciones que crean valores del TAD. | `empty-env`, `extend-env` | Permiten construir instancias del tipo de dato. |
| **Observadores** | Operaciones que inspeccionan valores del TAD sin modificarlos. | Predicados y extractores | Permiten consultar información sobre las instancias del TAD. |
| **Predicados** | Observadores que determinan a qué variante pertenece un valor. | `empty-env?`, `extend-env?` | Habilitan el dispatch por tipo en funciones que procesan el TAD. |
| **Extractores** | Observadores que obtienen componentes específicos de un valor. | `extend-env->id`, `extend-env->val`, etc. | Permiten acceder a las partes internas de una instancia del TAD. |
| **Representación por Listas** | Implementación usando listas como estructura de datos concreta. | `'(extend-env id val old-env)` | Sencilla y directa, fácil de depurar pero menos encapsulada. |
| **Representación por Procedimientos** | Implementación usando funciones (closures) como representación. | `(lambda (s) ...)` que responde a selectores | Más abstracta, mejor encapsulación, permite validación y mensajes de error personalizados. |

# Comentarios Adicionales sobre el Tema

1. **Importancia de los Ambientes en Lenguajes de Programación**: Los ambientes no son solo un ejemplo académico. Son componentes fundamentales en:
   - **Intérpretes y compiladores**: Para implementar el binding estático/dinámico de variables.
   - **Sistemas de módulos**: Para manejar namespaces y resolución de nombres.
   - **Entornos de ejecución**: Para mantener el estado durante la evaluación de programas.

2. **Semántica de Búsqueda en Ambientes**: La función `apply-env` implementa búsqueda **profunda desde el frente** (deep search from the front):
   - Comienza en la asociación más reciente.
   - Si no encuentra la variable, busca en el ambiente anterior.
   - Esto implementa la semántica de **ámbitos léxicos anidados** (nested lexical scoping).

3. **Shadowing vs. Reasignación**: Es importante distinguir:
   - **Shadowing**: Una nueva asociación para una variable existente crea un nuevo "ámbito" que oculta el anterior. La asociación original permanece intacta en el ambiente anterior.
   - **Reasignación**: Modificar el valor asociado a una variable en el mismo ámbito. Nuestra implementación actual no soporta reasignación.

4. **Eficiencia de la Implementación**: 
   - **Listas**: Búsqueda O(n) donde n es el número de asociaciones. Simple pero ineficiente para ambientes grandes.
   - En implementaciones reales se usan estructuras más eficientes como tablas hash o árboles balanceados.

5. **Extensibilidad del Diseño**: Para agregar nuevas operaciones al TAD de ambientes:
   - **empty-env?** y **extend-env?**: Ya están definidas.
   - **apply-env**: Ya está definida.
   - Podríamos agregar: `env->list` (convertir a lista de pares), `env-keys` (obtener todas las variables), `env-values` (obtener todos los valores).

6. **Patrón de Diseño "Chain of Responsibility"**: La estructura de ambientes sigue el patrón Chain of Responsibility:
   - Cada ambiente delega la búsqueda al siguiente si no encuentra la variable.
   - Esto permite implementar jerarquías de ámbitos (local, de función, global).

7. **Relación con el Stack de Ejecución**: En lenguajes imperativos, los ambientes están relacionados con el stack de ejecución:
   - Cada llamada a función crea un nuevo ambiente (marco de stack).
   - El ambiente anterior corresponde al marco de la función llamadora.
   - El retorno de función descarta el ambiente actual.

8. **Aplicaciones Más Allá de Lenguajes de Programación**: Los ambientes (como estructuras clave-valor) son útiles en:
   - **Sistemas de configuración**: Variables de entorno, parámetros de configuración.
   - **Bases de datos**: Contextos para consultas con variables.
   - **Sistemas expertos**: Hechos y reglas en sistemas basados en conocimiento.

9. **Invariantes del TAD Ambiente**:
   - Un `empty-env` siempre está vacío (no contiene asociaciones).
   - Un `extend-env` siempre tiene exactamente un identificador, un valor y un ambiente anterior.
   - No hay ciclos en la cadena de ambientes (es una lista simplemente enlazada).

10. **Prueba del Principio de Abstracción**: El código de `apply-env` es idéntico en ambas implementaciones. Esto demuestra que un usuario del TAD puede escribir algoritmos complejos sin conocer los detalles de implementación, confiando únicamente en la interfaz pública.