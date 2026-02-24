# Ejemplo ambientes

Un ambiente es un TAD (Tipo Abstracto de Dato) que permite mapear variables y su alcance léxico. Será especialmente útil cuando veamos ligaduras y procedimientos.

```ebnf
<environment> ::= '()             empty-env()
              ::= <identifier>
                  <value>
                  <environment>
                 extend-env(id, val, old-env)
```

De acuerdo a esto, podemos representar el dato utilizando diferentes estrategias pero conservando:

1. **Diseñar constructores**: Permiten generar un dato que es ambiente.
2. **Diseñar observadores**:
    - **Predicados**: Saber a qué tipo de ambiente pertenece.
    - **Extractores**: Extraen las partes de cada tipo.

## Representación basada en listas

```scheme
#lang eopl
#|
<environment> ::= '()                                 empty-env()
              ::= <identifier> <value> <environment>  extend-env(id,val, old-env)
|#

;; Representación mediante listas

; Constructores
; Nos permiten definir un tipo de dato
(define empty-env
  (lambda ()
    (list 'empty-env)))  ;; Crea un ambiente vacío representado como lista con símbolo 'empty-env

(define extend-env
  (lambda (id val old-env)
    (list 'extend-env id val old-env)))  ;; Crea ambiente extendido: símbolo, identificador, valor, ambiente anterior

;; Observadores
;; Predicados

(define empty-env?
  (lambda (env)
    (equal? (car env) 'empty-env)))  ;; Verifica si es ambiente vacío (primer elemento es 'empty-env)

(define extend-env?
  (lambda (env)
    (equal? (car env) 'extend-env)))  ;; Verifica si es ambiente extendido

;; Extractores

(define extend-env->id
  (lambda (env)
    (cadr env)))  ;; Extrae el identificador (segundo elemento)

(define extend-env->val
  (lambda (env)
    (caddr env)))  ;; Extrae el valor (tercer elemento)

(define extend-env->old-env
  (lambda (env)
    (cadddr env)))  ;; Extrae el ambiente anterior (cuarto elemento)

;;; Área del programador

(define e
  (extend-env 'x 10
              (extend-env 'y 20
                          (extend-env 'z 30
                                  (extend-env 'x 110
                                          (empty-env))))))  ;; Ambiente anidado con múltiples variables

(define apply-env
  (lambda (env var)
    (cond
      [(empty-env? env) (eopl:error "No se encuentra " var)]  ;; Variable no encontrada
      [(extend-env? env)
       (if
        (equal? (extend-env->id env) var)  ;; Compara identificador actual con variable buscada
        (extend-env->val env)  ;; Retorna valor si coincide
        (apply-env (extend-env->old-env env) var))  ;; Busca recursivamente en ambiente anterior
       ]
      [else (eopl:error "Tipo de dato incorrecto")]  ;; Error si no es ambiente válido
      )
    )
  )

(newline)
(display (apply-env e 'x)) ;10  ;; Encuentra el primer 'x' (shadowing)
(newline)
(display (apply-env e 'y)) ;20
(newline)
(display (apply-env e 'z)) ;30
(newline)
(display (apply-env e 'j)) ;Error  ;; Variable no definida
```

Observe que la interfaz sí considera que son listas (porque hay `car`, `cadr`, etc.), pero el programador usa los métodos provistos por la interfaz y no nota que son listas.

## Representación basada en procedimientos

En lugar de usar listas, voy a tener procedimientos que esperan un selector. De acuerdo a esto, puedo validar el comportamiento y enfocarlo a lo que necesito (extraer las partes).

```scheme
#lang eopl
#|
<environment> ::= '()                                 empty-env()
              ::= <identifier> <value> <environment>  extend-env(id,val, old-env)
|#

;; Representación mediante procedimientos

; Constructores
; Nos permiten definir un tipo de dato
(define empty-env
  (lambda ()
    (lambda (s)  ;; Procedimiento que actúa como ambiente vacío
      (cond
        [(= s 0) 'empty-env]  ;; Selector 0: tipo de ambiente (equivalente a car en listas)
        [else (eopl:error "Error en el tipo empty-env")]  ;; Selector inválido
        )
      )
    )
  )

(define extend-env
  (lambda (id val old-env)
    (lambda (s)  ;; Procedimiento que actúa como ambiente extendido
      (cond
        [(= s 0) 'extend-env]  ;; Selector 0: tipo de ambiente
        [(= s 1) id]           ;; Selector 1: identificador
        [(= s 2) val]          ;; Selector 2: valor
        [(= s 3) old-env]      ;; Selector 3: ambiente anterior
        [else (eopl:error "Error en el tipo extend-env")]  ;; Selector inválido
        )
      )
    )
  )

;; Observadores
;; Predicados

(define empty-env?
  (lambda (env)
    (equal? (env 0) 'empty-env)))  ;; Llama al procedimiento con selector 0 para obtener tipo

(define extend-env?
  (lambda (env)
    (equal? (env 0) 'extend-env)))  ;; Llama al procedimiento con selector 0

;; Extractores

(define extend-env->id
  (lambda (env)
    (env 1)))  ;; Llama al procedimiento con selector 1 para obtener identificador

(define extend-env->val
  (lambda (env)
    (env 2)))  ;; Selector 2 para obtener valor

(define extend-env->old-env
  (lambda (env)
    (env 3)))  ;; Selector 3 para obtener ambiente anterior

;;; Área del programador

(define e
  (extend-env 'x 10
              (extend-env 'y 20
                          (extend-env 'z 30
                                  (extend-env 'x 110
                                          (empty-env))))))  ;; Mismo ambiente que en representación de listas

(define apply-env
  (lambda (env var)
    (cond
      [(empty-env? env) (eopl:error "No se encuentra " var)]  ;; Variable no encontrada
      [(extend-env? env)
       (if
        (equal? (extend-env->id env) var)  ;; Compara identificador
        (extend-env->val env)  ;; Retorna valor si coincide
        (apply-env (extend-env->old-env env) var))  ;; Busca recursivamente
       ]
      [else (eopl:error "Tipo de dato incorrecto")]  ;; Error si no es ambiente válido
      )
    )
  )

(newline)
(display (apply-env e 'x)) ;10  ;; Shadowing: toma el 'x' más reciente
(newline)
(display (apply-env e 'y)) ;20
(newline)
(display (apply-env e 'z)) ;30
(newline)
(display (apply-env e 'j)) ;Error  ;; Variable no definida
```

# Tabla de resumen

| Concepto | Descripción | Ejemplo/Implementación |
|----------|-------------|------------------------|
| **Ambiente** | TAD que mapea identificadores a valores, gestionando el alcance léxico. | Estructura para almacenar variables y sus valores. |
| **Alcance léxico** | Reglas que determinan dónde una variable es visible basándose en su posición en el código. | Variables definidas en un bloque solo son accesibles dentro de él. |
| **Constructores** | Funciones que crean instancias del TAD. | `empty-env`, `extend-env`. |
| **Observadores** | Funciones que inspeccionan el TAD sin modificarlo. | Predicados y extractores. |
| **Predicados** | Observadores que verifican el tipo de dato. | `empty-env?`, `extend-env?`. |
| **Extractores** | Observadores que obtienen componentes del dato. | `extend-env->id`, `extend-env->val`, `extend-env->old-env`. |
| **Representación con listas** | Implementación del ambiente usando listas de Scheme. | `(list 'extend-env id val old-env)`. |
| **Representación con procedimientos** | Implementación usando closures (procedimientos que capturan estado). | `(lambda (s) ...)` que devuelve componentes según selector. |
| **apply-env** | Operación principal para buscar un valor asociado a un identificador. | Recorre el ambiente recursivamente hasta encontrar la variable. |
| **Shadowing** | Cuando una variable interna oculta una externa con el mismo nombre. | En el ejemplo, el primer 'x' (valor 10) oculta el segundo 'x' (valor 110). |
| **Selector** | Parámetro numérico que indica qué componente se solicita a un procedimiento. | 0: tipo, 1: id, 2: valor, 3: ambiente anterior. |

# Comentarios adicionales

- Los **ambientes** son fundamentales en la implementación de lenguajes de programación, ya que gestionan el contexto de ejecución donde las variables tienen significado.
- La **representación con procedimientos** es más abstracta y flexible que la de listas, ya que encapsula completamente la implementación. Esta técnica se conoce como **message passing** o **dispatch on type**.
- El **shadowing** (ocultamiento) es un comportamiento importante: cuando una variable se redefine en un ámbito interno, la nueva definición prevalece sobre la externa. Esto permite reutilizar nombres de variables de forma controlada.
- La **recursión** en `apply-env` refleja la estructura anidada de los ambientes, buscando desde el ámbito más local hacia el más global.
- La **separación entre interfaz e implementación** garantiza que el código del programador no dependa de si los ambientes son listas o procedimientos, permitiendo cambiar la representación sin afectar la funcionalidad.
- En la práctica, los ambientes suelen implementarse con estructuras de datos más eficientes (como tablas hash), pero estas representaciones didácticas ilustran los conceptos fundamentales.
- La **representación con procedimientos** es un ejemplo de **programación orientada a objetos** en un lenguaje funcional: cada ambiente es un objeto que responde a mensajes (selectores).
- Para lenguajes con **ambientes dinámicos** (en contraposición a léxicos), la implementación sería diferente, ya que la búsqueda de variables depende de la cadena de llamadas en tiempo de ejecución, no de la estructura del código.