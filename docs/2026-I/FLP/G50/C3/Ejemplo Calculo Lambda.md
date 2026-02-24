# Ejemplo Cálculo Lambda

# Representación basada en listas

```scheme
#lang eopl
#|
Gramática para expresiones del cálculo lambda:
<lc-exp> ::= <identifier>                            var-exp(id)
         ::= "lambda" "(" <identifier> ")" <lc-exp>  lambda-exp(id,exp)
         ::= <lc-exp> <lc-exp>                       app-exp(rator, rand)
|#

;; Representación basada en listas para expresiones del cálculo lambda
;; Cada expresión se representa como una lista con un símbolo que identifica su tipo
;; seguido de sus componentes.

;; --- CONSTRUCTORES (Interfaz del TAD) ---

; var-exp: identifier -> var-exp
; Crea una expresión variable a partir de un identificador.
(define var-exp
  (lambda (id)
    (list 'var-exp id)))  ; Representación: ('var-exp id)

; lambda-exp: identifier × lc-exp -> lambda-exp
; Crea una expresión lambda (abstracción) a partir de un parámetro y un cuerpo.
(define lambda-exp
  (lambda (id exp)
    (list 'lambda-exp id exp)))  ; Representación: ('lambda-exp id cuerpo)

; app-exp: lc-exp × lc-exp -> app-exp
; Crea una expresión de aplicación a partir de un operador y un operando.
(define app-exp
  (lambda (rator rand)
    (list 'app-exp rator rand)))  ; Representación: ('app-exp operador operando)

;; --- PREDICADOS (Interfaz del TAD) ---

; var-exp?: any -> boolean
; Determina si una expresión es una variable.
(define var-exp?
  (lambda (exp)
    (equal? (car exp) 'var-exp)))  ; Verifica si el primer elemento es 'var-exp'

; lambda-exp?: any -> boolean
; Determina si una expresión es una abstracción lambda.
(define lambda-exp?
  (lambda (exp)
    (equal? (car exp) 'lambda-exp)))  ; Verifica si el primer elemento es 'lambda-exp'

; app-exp?: any -> boolean
; Determina si una expresión es una aplicación.
(define app-exp?
  (lambda (exp)
    (equal? (car exp) 'app-exp)))  ; Verifica si el primer elemento es 'app-exp'

;; --- EXTRACTORES (Interfaz del TAD) ---

; var-exp->id: var-exp -> identifier
; Extrae el identificador de una expresión variable.
(define var-exp->id
  (lambda (exp)
    (cadr exp)))  ; El identificador está en la segunda posición

; lambda-exp->id: lambda-exp -> identifier
; Extrae el parámetro de una expresión lambda.
(define lambda-exp->id
  (lambda (exp)
    (cadr exp)))  ; El parámetro está en la segunda posición

; lambda-exp->exp: lambda-exp -> lc-exp
; Extrae el cuerpo de una expresión lambda.
(define lambda-exp->exp
  (lambda (exp)
    (caddr exp)))  ; El cuerpo está en la tercera posición

; app-exp->rator: app-exp -> lc-exp
; Extrae el operador (función) de una expresión de aplicación.
(define app-exp->rator
  (lambda (exp)
    (cadr exp)))  ; El operador está en la segunda posición

; app-exp->rand: app-exp -> lc-exp
; Extrae el operando (argumento) de una expresión de aplicación.
(define app-exp->rand
  (lambda (exp)
    (caddr exp)))  ; El operando está en la tercera posición

;; --- ÁREA DEL PROGRAMADOR (Usando el TAD) ---

; occurs-free?: lc-exp × identifier -> boolean
; Determina si un identificador ocurre libre en una expresión del cálculo lambda.
; Un identificador ocurre libre si:
; 1. En una variable: si es igual al identificador buscado.
; 2. En una abstracción lambda: si ocurre libre en el cuerpo Y no es el parámetro ligado.
; 3. En una aplicación: si ocurre libre en el operador O en el operando.
(define occurs-free?
  (lambda (exp var)
    (cond
      [(var-exp? exp) (equal? (var-exp->id exp) var)]  ; Caso variable
      [(lambda-exp? exp)                               ; Caso lambda
       (and (not (equal? (lambda-exp->id exp) var))    ; No es el parámetro ligado
            (occurs-free? (lambda-exp->exp exp) var))] ; Y ocurre libre en el cuerpo
      [(app-exp? exp)                                  ; Caso aplicación
       (or (occurs-free? (app-exp->rator exp) var)     ; Ocurre libre en el operador
           (occurs-free? (app-exp->rand exp) var))]    ; O ocurre libre en el operando
      [else (eopl:error "Error en el TAD: expresión inválida")])))

; Ejemplo de expresión: λx.(p x)
; Representa una función que toma x y aplica p a x
(define exp
  (lambda-exp
   'x
   (app-exp
    (var-exp 'p)
    (var-exp 'x))))

; Pruebas
(newline)
(display "¿'x' ocurre libre en λx.(p x)? ")
(display (occurs-free? exp 'x))  ; Debe ser #f (x está ligada)
(newline)
(display "¿'p' ocurre libre en λx.(p x)? ")
(display (occurs-free? exp 'p))  ; Debe ser #t (p es libre)
```

# Representación basada en procedimientos

```scheme
#lang eopl
#|
Gramática para expresiones del cálculo lambda:
<lc-exp> ::= <identifier>                            var-exp(id)
         ::= "lambda" "(" <identifier> ")" <lc-exp>  lambda-exp(id,exp)
         ::= <lc-exp> <lc-exp>                       app-exp(rator, rand)
|#

;; Representación basada en procedimientos (funciones) para expresiones del cálculo lambda
;; Cada expresión se representa como una función (procedimiento) que acepta un selector
;; y devuelve el componente correspondiente.
;; Esta es una implementación más abstracta que oculta completamente la estructura de datos.

;; --- CONSTRUCTORES (Interfaz del TAD) ---

; var-exp: identifier -> var-exp
; Crea una expresión variable. La representación es una función que:
; - Con selector 0 devuelve el tipo 'var-exp'
; - Con selector 1 devuelve el identificador
(define var-exp
  (lambda (id)
    (lambda (s)  ; La expresión es una función que toma un selector
      (cond
        [(= s 0) 'var-exp]    ; Selector 0: tipo de la expresión
        [(= s 1) id]          ; Selector 1: identificador
        [else (eopl:error "Error en var-exp: selector inválido")]))))

; lambda-exp: identifier × lc-exp -> lambda-exp
; Crea una expresión lambda. La representación es una función que:
; - Con selector 0 devuelve el tipo 'lambda-exp'
; - Con selector 1 devuelve el parámetro
; - Con selector 2 devuelve el cuerpo
(define lambda-exp
  (lambda (id exp)
    (lambda (s)
      (cond
        [(= s 0) 'lambda-exp]  ; Selector 0: tipo de la expresión
        [(= s 1) id]           ; Selector 1: parámetro
        [(= s 2) exp]          ; Selector 2: cuerpo
        [else (eopl:error "Error en lambda-exp: selector inválido")]))))

; app-exp: lc-exp × lc-exp -> app-exp
; Crea una expresión de aplicación. La representación es una función que:
; - Con selector 0 devuelve el tipo 'app-exp'
; - Con selector 1 devuelve el operador
; - Con selector 2 devuelve el operando
(define app-exp
  (lambda (rator rand)
    (lambda (s)
      (cond
        [(= s 0) 'app-exp]    ; Selector 0: tipo de la expresión
        [(= s 1) rator]       ; Selector 1: operador (función)
        [(= s 2) rand]        ; Selector 2: operando (argumento)
        [else (eopl:error "Error en app-exp: selector inválido")]))))

;; --- PREDICADOS (Interfaz del TAD) ---

; var-exp?: any -> boolean
; Determina si una expresión es una variable.
; Aplica la expresión con selector 0 y verifica si devuelve 'var-exp'
(define var-exp?
  (lambda (exp)
    (equal? (exp 0) 'var-exp)))  ; exp es una función, la aplicamos con argumento 0

; lambda-exp?: any -> boolean
; Determina si una expresión es una abstracción lambda.
(define lambda-exp?
  (lambda (exp)
    (equal? (exp 0) 'lambda-exp)))  ; exp es una función, la aplicamos con argumento 0

; app-exp?: any -> boolean
; Determina si una expresión es una aplicación.
(define app-exp?
  (lambda (exp)
    (equal? (exp 0) 'app-exp)))  ; exp es una función, la aplicamos con argumento 0

;; --- EXTRACTORES (Interfaz del TAD) ---

; var-exp->id: var-exp -> identifier
; Extrae el identificador de una expresión variable.
; Aplica la expresión con selector 1
(define var-exp->id
  (lambda (exp)
    (exp 1)))  ; exp es una función, la aplicamos con argumento 1

; lambda-exp->id: lambda-exp -> identifier
; Extrae el parámetro de una expresión lambda.
(define lambda-exp->id
  (lambda (exp)
    (exp 1)))  ; exp es una función, la aplicamos con argumento 1

; lambda-exp->exp: lambda-exp -> lc-exp
; Extrae el cuerpo de una expresión lambda.
(define lambda-exp->exp
  (lambda (exp)
    (exp 2)))  ; exp es una función, la aplicamos con argumento 2

; app-exp->rator: app-exp -> lc-exp
; Extrae el operador de una expresión de aplicación.
(define app-exp->rator
  (lambda (exp)
    (exp 1)))  ; exp es una función, la aplicamos con argumento 1

; app-exp->rand: app-exp -> lc-exp
; Extrae el operando de una expresión de aplicación.
(define app-exp->rand
  (lambda (exp)
    (exp 2)))  ; exp es una función, la aplicamos con argumento 2

;; --- ÁREA DEL PROGRAMADOR (Usando el TAD) ---
;; NOTA: Este código es IDÉNTICO al de la representación basada en listas.
;; La abstracción permite cambiar la implementación sin afectar el código del usuario.

; occurs-free?: lc-exp × identifier -> boolean
; Determina si un identificador ocurre libre en una expresión del cálculo lambda.
(define occurs-free?
  (lambda (exp var)
    (cond
      [(var-exp? exp) (equal? (var-exp->id exp) var)]
      [(lambda-exp? exp)
       (and (not (equal? (lambda-exp->id exp) var))
            (occurs-free? (lambda-exp->exp exp) var))]
      [(app-exp? exp)
       (or (occurs-free? (app-exp->rator exp) var)
           (occurs-free? (app-exp->rand exp) var))]
      [else (eopl:error "Error en el TAD: expresión inválida")])))

; Ejemplo de expresión: λx.(p x)
; Misma expresión que en la representación basada en listas
(define exp
  (lambda-exp
   'x
   (app-exp
    (var-exp 'p)
    (var-exp 'x))))

; Pruebas - mismos resultados que la representación basada en listas
(newline)
(display "¿'x' ocurre libre en λx.(p x)? ")
(display (occurs-free? exp 'x))  ; Debe ser #f
(newline)
(display "¿'p' ocurre libre en λx.(p x)? ")
(display (occurs-free? exp 'p))  ; Debe ser #t
```

# Tabla de Resumen: Representaciones del Cálculo Lambda

| Concepto | Definición | Ejemplo en el Código | Propósito/Importancia |
| :--- | :--- | :--- | :--- |
| **Cálculo Lambda** | Sistema formal para expresar computación basado en funciones y aplicación. | Gramática: `var-exp`, `lambda-exp`, `app-exp`. | Base teórica de los lenguajes funcionales. Permite estudiar conceptos como variables libres/ligadas. |
| **Variable Libre** | Identificador que no está ligado por un λ en su contexto. | En `λx.(p x)`, `p` es libre, `x` es ligada. | Fundamental para la sustitución y evaluación. Las variables libres representan "parámetros externos". |
| **Variable Ligada** | Identificador que está dentro del alcance de un λ que lo declara como parámetro. | En `λx.(p x)`, `x` está ligada por `λx`. | Define el ámbito de los parámetros en las funciones. |
| **Representación Basada en Listas** | Implementación del TAD usando listas como estructura de datos concreta. | `(list 'var-exp id)`, `(list 'lambda-exp id exp)`, etc. | Sencilla y directa. Fácil de depurar pero expone la estructura interna. |
| **Representación Basada en Procedimientos** | Implementación del TAD usando funciones (closures) como representación. | Expresión como `(lambda (s) ...)` que devuelve componentes según el selector. | Más abstracta y encapsulada. Oculta completamente la representación interna. |
| **Constructores** | Operaciones que crean valores del TAD. | `var-exp`, `lambda-exp`, `app-exp`. | Permiten construir expresiones del cálculo lambda. |
| **Predicados** | Operaciones que verifican el tipo de una expresión. | `var-exp?`, `lambda-exp?`, `app-exp?`. | Permiten hacer dispatch en funciones que procesan expresiones. |
| **Extractores** | Operaciones que obtienen componentes de una expresión. | `var-exp->id`, `lambda-exp->exp`, `app-exp->rator`. | Permiten acceder a las partes de una expresión de manera controlada. |
| **Interfaz del TAD** | Conjunto de constructores, predicados y extractores que definen cómo usar el tipo. | Las 9 funciones definidas antes de "Área del programador". | Contrato que separa el uso de la implementación. |
| **Selector** | Argumento numérico que indica qué componente se solicita a una expresión. | En representación procedural: `0` para tipo, `1` para primer componente, etc. | Mecanismo de acceso uniforme a los componentes de una expresión. |
| **Ámbito Léxico** | Reglas que determinan dónde una variable está visible en el código. | En `λx.(p x)`, `x` tiene ámbito dentro del cuerpo de la lambda. | Fundamental para evitar colisiones de nombres y entender el comportamiento de closures. |

# Comentarios Adicionales sobre el Tema

1. **Importancia del Cálculo Lambda**: El cálculo lambda no es solo un ejemplo académico. Es la base teórica de lenguajes funcionales como Haskell, ML y Scheme. Conceptos como funciones de primera clase, closures y evaluación perezosa tienen sus raíces en el cálculo lambda. Además, es Turing-completo, lo que significa que puede expresar cualquier función computable.

2. **Ventajas de la Representación Procedural**: 
   - **Encapsulación total**: El usuario no puede acceder directamente a la estructura de datos, solo a través de la interfaz definida.
   - **Flexibilidad**: Se puede cambiar la representación interna sin afectar el código del usuario.
   - **Validación**: Los constructores pueden validar los argumentos antes de crear la expresión.
   - **Mensajes de error personalizados**: Como se ve en los `eopl:error`, se pueden dar mensajes más informativos.
   - **Seguridad**: Previene el acceso no autorizado a la estructura interna de los datos.

3. **Patrón de Diseño**: La representación basada en procedimientos sigue el patrón de diseño **"Objeto como Closure"** o **"Dispatch sobre Selector"**. Cada expresión es un objeto que sabe cómo responder a diferentes mensajes (selectores). Este patrón es precursor de la programación orientada a objetos y muestra cómo se pueden implementar objetos en lenguajes funcionales.

4. **occurs-free? como algoritmo fundamental**: La función `occurs-free?` es crucial en implementaciones de lenguajes de programación porque:
   - Es necesaria para la sustitución segura (evitar captura de variables).
   - Se usa en la implementación de reductores (evaluadores) del cálculo lambda.
   - Es un ejemplo de recursión estructural sobre la sintaxis abstracta.

5. **Comparación de Representaciones**:
   - **Listas**: Más eficiente en memoria, más fácil de inspeccionar durante la depuración, pero menos segura (el usuario puede modificar la estructura directamente).
   - **Procedimientos**: Más segura, más flexible, permite invariantes más complejas, pero con overhead de llamadas a función y más difícil de inspeccionar.

6. **Extensibilidad del TAD**: Para agregar nuevos tipos de expresiones (como let-expresiones, condicionales, etc.), solo se necesita:
   - Extender la interfaz con nuevos constructores, predicados y extractores.
   - Actualizar las funciones que procesan expresiones (como `occurs-free?`) para manejar el nuevo caso.
   - La representación interna puede permanecer igual o cambiarse independientemente.

7. **Relación con la Programación Funcional**: Este ejemplo ilustra cómo la programación funcional trata los datos y el código de manera uniforme. Las expresiones del cálculo lambda son tanto datos (que podemos analizar con `occurs-free?`) como código (que podríamos evaluar si implementáramos un evaluador).

8. **Aplicaciones Prácticas**: Los TAD bien diseñados son fundamentales en:
   - Compiladores e intérpretes (para representar árboles de sintaxis abstracta).
   - Sistemas de tipos (para representar tipos y restricciones).
   - Bases de datos (para representar consultas y planes de ejecución).
   - Interfaces gráficas (para representar widgets y layouts).