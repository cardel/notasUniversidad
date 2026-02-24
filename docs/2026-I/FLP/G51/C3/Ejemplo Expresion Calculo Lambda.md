# Ejemplo Expresión Cálculo Lambda

```ebnf
<lc-exp> ::= <identifier>   var-exp(id)
         ::= "lambda" 
            "(" <identifier> ")"
            <lc-exp>
            lambda-exp(id,exp)
         ::= "("<lc-exp> <lc-exp>")"
	         app-exp(rator, rand)
```

Vamos a implementar la regla de **ocurre libre** (occurs-free):

1. Si es `var-exp`, debe ser igual al `id`.
2. Si es `lambda-exp`, debe ser diferente del `id` y ocurrir libre en la expresión.
3. Si es `app-exp`, debe ocurrir libre en el `rator` o en el `rand`.

# Implementación basada en listas

```scheme
#lang eopl
#|
<lc-exp> ::= <identifier>   var-exp(id)
         ::= "lambda" 
            "(" <identifier> ")"
            <lc-exp>
            lambda-exp(id,exp)
         ::= "("<lc-exp> <lc-exp>")"
	         app-exp(rator, rand)
|#

;; Implementación basada en listas

;; Constructores
(define var-exp
  (lambda (id)
    (list 'var-exp id)))  ;; Representa una variable: (var-exp id)

(define lambda-exp
  (lambda (id exp)
    (list 'lambda-exp id exp)))  ;; Representa una abstracción lambda: (lambda-exp id cuerpo)

(define app-exp
  (lambda (rator rand)
    (list 'app-exp rator rand)))  ;; Representa una aplicación: (app-exp función argumento)

;; Observadores

;; Predicados
(define var-exp?
  (lambda (exp)
    (equal? (car exp) 'var-exp)))  ;; Verifica si es expresión variable

(define lambda-exp?
  (lambda (exp)
    (equal? (car exp) 'lambda-exp)))  ;; Verifica si es abstracción lambda

(define app-exp?
  (lambda (exp)
    (equal? (car exp) 'app-exp)))  ;; Verifica si es aplicación

;; Extractores
(define var-exp->id
  (lambda (exp)
    (cadr exp)))  ;; Extrae el identificador de una variable

(define lambda-exp->id
  (lambda (exp)
    (cadr exp)))  ;; Extrae el parámetro de una abstracción lambda

(define lambda-exp->exp
  (lambda (exp)
    (caddr exp)))  ;; Extrae el cuerpo de una abstracción lambda

(define app-exp->rator
  (lambda (exp)
    (cadr exp)))  ;; Extrae el operador (función) de una aplicación

(define app-exp->rand
  (lambda (exp)
    (caddr exp)))  ;; Extrae el operando (argumento) de una aplicación

;; Área del programador

(define occurs-free?
  (lambda (exp var)
    (cond
      [(var-exp? exp) (equal? var (var-exp->id exp))]  ;; Caso variable: verifica si coincide
      [(lambda-exp? exp)
       (and
        (not (equal? var (lambda-exp->id exp)))  ;; No es el parámetro ligado
        (occurs-free? (lambda-exp->exp exp) var))]  ;; Busca en el cuerpo
      [(app-exp? exp)
       (or
        (occurs-free? (app-exp->rator exp) var)  ;; Busca en el operador
        (occurs-free? (app-exp->rand exp) var))]  ;; Busca en el operando
      [else
       (eopl:error "No es una expresión lambda " exp)])))  ;; Error si no es expresión válida

;; Ejemplos de expresiones lambda
(define exp1 (lambda-exp 'x (lambda-exp 'y (var-exp 'z))))  ;; λx.λy.z
(define exp2
  (app-exp
   (lambda-exp 'x (var-exp 'y))  ;; (λx.y)
   (lambda-exp 'y (var-exp 'x))))  ;; (λy.x)

;; Pruebas
(newline)
(display (occurs-free? exp1 'x))  ;; #f - x está ligada
(newline)
(display (occurs-free? exp1 'y))  ;; #f - y está ligada
(newline)
(display (occurs-free? exp1 'z))  ;; #t - z ocurre libre
(newline)
(display (occurs-free? exp2 'x))  ;; #t - x ocurre libre en el segundo término
(newline)
(display (occurs-free? exp2 'y))  ;; #t - y ocurre libre en el primer término
```

# Implementación basada en procedimientos

```scheme
#lang eopl
#|
<lc-exp> ::= <identifier>   var-exp(id)
         ::= "lambda" 
            "(" <identifier> ")"
            <lc-exp>
            lambda-exp(id,exp)
         ::= "("<lc-exp> <lc-exp>")"
	         app-exp(rator, rand)
|#

;; Implementación basada en procedimientos

;; Constructores
(define var-exp
  (lambda (id)
    (lambda (s)  ;; Procedimiento que representa una variable
      (cond
        [(= s 0) 'var-exp]  ;; Selector 0: tipo de expresión
        [(= s 1) id]        ;; Selector 1: identificador
        [else (eopl:error "Error en var-exp")]))))  ;; Selector inválido

(define lambda-exp
  (lambda (id exp)
    (lambda (s)  ;; Procedimiento que representa una abstracción lambda
      (cond
        [(= s 0) 'lambda-exp]  ;; Selector 0: tipo
        [(= s 1) id]           ;; Selector 1: parámetro
        [(= s 2) exp]          ;; Selector 2: cuerpo
        [else (eopl:error "Error en lambda-exp")]))))  ;; Selector inválido

(define app-exp
  (lambda (rator rand)
    (lambda (s)  ;; Procedimiento que representa una aplicación
      (cond
        [(= s 0) 'app-exp]  ;; Selector 0: tipo
        [(= s 1) rator]     ;; Selector 1: operador
        [(= s 2) rand]      ;; Selector 2: operando
        [else (eopl:error "Error en app-exp")]))))  ;; Selector inválido

;; Observadores

;; Predicados
(define var-exp?
  (lambda (exp)
    (equal? (exp 0) 'var-exp)))  ;; Llama con selector 0 para obtener tipo

(define lambda-exp?
  (lambda (exp)
    (equal? (exp 0) 'lambda-exp)))  ;; Llama con selector 0

(define app-exp?
  (lambda (exp)
    (equal? (exp 0) 'app-exp)))  ;; Llama con selector 0

;; Extractores
(define var-exp->id
  (lambda (exp)
    (exp 1)))  ;; Selector 1 para obtener identificador

(define lambda-exp->id
  (lambda (exp)
    (exp 1)))  ;; Selector 1 para obtener parámetro

(define lambda-exp->exp
  (lambda (exp)
    (exp 2)))  ;; Selector 2 para obtener cuerpo

(define app-exp->rator
  (lambda (exp)
    (exp 1)))  ;; Selector 1 para obtener operador

(define app-exp->rand
  (lambda (exp)
    (exp 2)))  ;; Selector 2 para obtener operando

;; Área del programador

(define occurs-free?
  (lambda (exp var)
    (cond
      [(var-exp? exp) (equal? var (var-exp->id exp))]  ;; Variable: verifica coincidencia
      [(lambda-exp? exp)
       (and
        (not (equal? var (lambda-exp->id exp)))  ;; No es parámetro ligado
        (occurs-free? (lambda-exp->exp exp) var))]  ;; Busca en cuerpo
      [(app-exp? exp)
       (or
        (occurs-free? (app-exp->rator exp) var)  ;; Busca en operador
        (occurs-free? (app-exp->rand exp) var))]  ;; Busca en operando
      [else
       (eopl:error "No es una expresión lambda " exp)])))  ;; Error si no es válida

;; Mismos ejemplos
(define exp1 (lambda-exp 'x (lambda-exp 'y (var-exp 'z))))  ;; λx.λy.z
(define exp2
  (app-exp
   (lambda-exp 'x (var-exp 'y))  ;; (λx.y)
   (lambda-exp 'y (var-exp 'x))))  ;; (λy.x)

;; Pruebas (mismos resultados)
(newline)
(display (occurs-free? exp1 'x))  ;; #f
(newline)
(display (occurs-free? exp1 'y))  ;; #f
(newline)
(display (occurs-free? exp1 'z))  ;; #t
(newline)
(display (occurs-free? exp2 'x))  ;; #t
(newline)
(display (occurs-free? exp2 'y))  ;; #t
```

# Tabla de resumen

| Concepto | Descripción | Ejemplo/Implementación |
|----------|-------------|------------------------|
| **Expresión lambda (λ-expresión)** | Término del cálculo lambda, lenguaje formal para computación. | `var-exp`, `lambda-exp`, `app-exp`. |
| **var-exp** | Expresión variable, representa un identificador. | `(var-exp 'x)` representa la variable `x`. |
| **lambda-exp** | Abstracción lambda, función anónima con parámetro y cuerpo. | `(lambda-exp 'x (var-exp 'x))` representa `λx.x`. |
| **app-exp** | Aplicación de función, aplica un operador a un operando. | `(app-exp f a)` representa `(f a)`. |
| **Ocurre libre (occurs-free)** | Variable que aparece en una expresión sin estar ligada por un λ. | En `λx.y`, `y` ocurre libre; `x` no. |
| **Variable ligada** | Variable que está dentro del alcance de un λ con el mismo nombre. | En `λx.x`, `x` está ligada. |
| **Variable libre** | Variable que no está ligada por ningún λ en su contexto. | En `λx.y`, `y` es libre. |
| **Representación con listas** | Implementación usando listas de Scheme con etiquetas. | `(list 'lambda-exp id exp)`. |
| **Representación con procedimientos** | Implementación usando closures (message passing). | `(lambda (s) ...)` con selectores. |
| **Constructores** | Funciones que crean expresiones lambda. | `var-exp`, `lambda-exp`, `app-exp`. |
| **Observadores** | Funciones que inspeccionan expresiones sin modificarlas. | Predicados y extractores. |
| **Predicados** | Verifican el tipo de expresión. | `var-exp?`, `lambda-exp?`, `app-exp?`. |
| **Extractores** | Obtienen componentes de expresiones. | `var-exp->id`, `lambda-exp->exp`, etc. |
| **Selector** | Parámetro numérico para acceder a componentes en representación procedural. | 0: tipo, 1: primer componente, 2: segundo componente. |
| **rator** | Operador en una aplicación (función a aplicar). | En `(f x)`, `f` es el rator. |
| **rand** | Operando en una aplicación (argumento). | En `(f x)`, `x` es el rand. |

# Comentarios adicionales

- El **cálculo lambda** es el fundamento teórico de los lenguajes funcionales y proporciona un modelo minimalista de computación.
- La noción de **"ocurre libre"** es crucial para definir correctamente la sustitución (β-reducción) en cálculo lambda, evitando captura de variables.
- Las **dos representaciones** (listas vs. procedimientos) ilustran el principio de **abstracción de datos**: el mismo TAD puede implementarse de múltiples formas sin cambiar su interfaz.
- La **representación con procedimientos** es más segura contra errores de tipo, ya que solo responde a selectores válidos, mientras que la de listas podría acceder incorrectamente con `car`, `cdr`, etc.
- En la práctica, los **ambientes** (del ejemplo anterior) se combinan con expresiones lambda para implementar evaluadores, donde `occurs-free?` ayuda a detectar variables no ligadas.
- El **shadowing** (ocultamiento) se maneja naturalmente: en `λx.λx.x`, el `x` interno oculta al externo, y `occurs-free?` para `x` daría `#f` en el cuerpo.
- Para un evaluador completo, necesitaríamos además funciones para **sustitución** (β-reducción) y **α-conversión** (renombrado de variables ligadas).
- La **recursión estructural** en `occurs-free?` refleja la definición inductiva de expresiones lambda, procesando cada subexpresión según su tipo.
- En lenguajes de programación reales, estas nociones se extienden con **tipos**, **patrones de evaluación** (call-by-value, call-by-name), y **construcciones adicionales** (let, condicionales, etc.).