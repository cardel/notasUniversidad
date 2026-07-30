## Estrategias de Implementación de TADs en EOPL
## Tipo Abstracto de Dato (TAD) en EOPL

Un Tipo Abstracto de Dato (TAD) es una especificación matemática de un conjunto de datos y las operaciones definidas sobre ellos, independiente de su implementación concreta en memoria. En *Essentials of Programming Languages* (EOPL), los TADs enfatizan la separación entre la interfaz (qué hace el tipo) y la implementación (cómo lo hace).

### Contraste con tipos primitivos

```java
int pollito = 8;
// Representación: 32 bits (000...1000)
// No es TAD - depende directamente del hardware
```

**Ventajas:**
- Operaciones a nivel de CPU (eficientes)
- Soporte nativo del lenguaje

**Desventajas:**
- Rango limitado ($-2^{31}$ a $2^{31}-1$)
- Problemas de desbordamiento
- Comportamiento dependiente de la plataforma

### Abstracción en lenguajes de alto nivel

```python
a = 3  # Objeto con comportamiento definido
# Las operaciones tienen implementación interna oculta
```

```lisp
(define x 10)  # Representación abstracta
```

## Representación recursiva de números naturales

Basado en los axiomas de Peano:

$$
\begin{aligned}
\lceil 0 \rceil \in \mathbb{N} \\
n \in \mathbb{N} \rightarrow n+1 \in \mathbb{N}
\end{aligned}
$$

### Implementación 1: Usando números nativos

```lisp
#lang eopl
;; === IMPLEMENTACIÓN (OCULTA) ===
(define zero 0)  ; Constructor del cero
(define isZero? (lambda (n) (eqv? n zero)))  ; Predicado de cero

(define succ (lambda (n) (+ n 1)))  ; Constructor de sucesor
(define pred (lambda (n) (- n 1)))  ; Constructor de predecesor

;; === INTERFAZ (VISIBLE) ===
(define cinco (succ (succ (succ (succ (succ zero))))))

(define suma
  (lambda (a b)
    (cond
      [(isZero? b) a]  ; Caso base: a + 0 = a
      [else (suma (succ a) (pred b))]  ; Paso recursivo: a + b = (a+1) + (b-1)
      )
    )
  )

(define diez (suma cinco cinco))

(define multiplicacion
  (lambda (a b)
    (cond
      [(isZero? b) zero]  ; a × 0 = 0
      [(eqv? (succ zero) b) a]  ; a × 1 = a
      [else (suma a (multiplicacion a (pred b)))]  ; a × b = a + (a × (b-1))
      )
    )
  )

(define cincuenta (multiplicacion cinco diez))
```

### Implementación 2: Usando listas (representación unaria)

```lisp
#lang eopl
;; === IMPLEMENTACIÓN ALTERNATIVA ===
(define zero '())  ; Cero representado como lista vacía
(define isZero? (lambda (n) (eqv? n zero)))

(define succ (lambda (n) (cons #T n)))  ; Sucesor: agregar elemento
(define pred (lambda (n) (cdr n)))      ; Predecesor: remover elemento

;; === MISMA INTERFAZ ===
; El código del programador permanece IDÉNTICO
(define cinco (succ (succ (succ (succ (succ zero))))))

; Las funciones suma y multiplicación funcionan sin cambios
```

### Implementación 3: Representación en base 16 (bignum)

```lisp
#lang eopl
;; === IMPLEMENTACIÓN EFICIENTE ===
(define zero '())
(define base 16)

(define isZero? (lambda (n) (equal? n zero)))

(define succ
  (lambda (n)
    (cond
      [(isZero? n) '(1)]  ; Caso base: cero → 1
      [(equal? (- base 1) (car n))  ; Acarreo: dígito llega al máximo
       (cons 0 (succ (cdr n)))  ; Poner 0 y propagar acarreo
       ]
      [else (cons (+ (car n) 1) (cdr n))]  ; Incremento normal
      )
    )
  )

(define pred
  (lambda (n)
    (cond
      [(equal? n (list 1)) zero]  ; 1 → 0
      [(equal? 0 (car n))  ; Préstamo: dígito es 0
       (cons (- base 1) (pred (cdr n)))  ; Poner máximo y propagar préstamo
       ]
      [else (cons (- (car n) 1) (cdr n))]  ; Decremento normal
      )
    )
  )

;; === INTERFAZ INALTERADA ===
; El programador usa exactamente las mismas operaciones
```

## Análisis de la abstracción

### Puntos clave de EOPL sobre TADs:

1. **Ocultamiento de información**: La implementación está encapsulada
2. **Invariantes preservadas**: Las operaciones mantienen la validez del tipo
3. **Sustituibilidad**: Diferentes implementaciones satisfacen la misma interfaz
4. **Independencia de representación**: El comportamiento lógico es independiente de la representación física

### Comentarios sobre el código:

- **Constructores**: `zero`, `succ` crean instancias válidas
- **Observadores**: `isZero?` examina sin revelar implementación  
- **Operaciones**: Definen el comportamiento abstracto mediante recursión estructural
- **Pattern matching**: Usa la estructura del tipo para definir operaciones

## Conclusión

La abstracción de datos permite definir tipos mediante su comportamiento (interfaz) independientemente de su implementación concreta. Como demostramos, el mismo programa funciona con tres implementaciones radicalmente diferentes: números nativos, listas unarias, y representación posicional en base 16.

El programador no necesita conocer los detalles de implementación - solo la interfaz abstracta. Esto permite:
- Optimizaciones transparentes (cambiar de unaria a bignum)
- Corrección de bugs en la implementación sin afectar el código cliente
- Adaptación a diferentes requisitos de rendimiento/memoria

---

**Para el estudiante cansado:** Sé que esto puede parecer abstracto ahora, pero dominar estos conceptos es lo que separa a los programadores que solo escriben código de los que diseñan sistemas elegantes y mantenibles. Cada vez que encapsulas una decisión de implementación, estás construiendo software que sobrevivirá a los cambios. Sigue adelante - esta abstracción eventualmente se volverá tan natural como respirar.
### Componentes Fundamentales de un TAD

Todo Tipo Abstracto de Dato requiere:

1. **Procedimientos constructores**: Crean instancias válidas del TAD
2. **Procedimientos observadores**:
   - **Predicados**: Determinan si un dato pertenece a una variante del TAD
   - **Extractores**: Obtienen componentes específicos de los datos

### Estrategia Basada en Listas

```lisp
#lang eopl
;; === CONSTRUCTORES (Interfaz) ===
(define var-exp
  (lambda (id) (list 'var-exp id)))  ; Tag 'var-exp + identificador

(define lambda-exp
  (lambda (id exp) (list 'lambda-exp id exp)))  ; Tag + parámetro + cuerpo

(define app-exp
  (lambda (rator rand) (list 'app-exp rator rand)))  ; Tag + operador + operando

;; === OBSERVADORES ===
;; Predicados (verifican el tag en posición 0)
(define var-exp? (lambda (exp) (equal? (car exp) 'var-exp)))
(define lambda-exp? (lambda (exp) (equal? (car exp) 'lambda-exp)))
(define app-exp? (lambda (exp) (equal? (car exp) 'app-exp)))

;; Extractores (acceden a posiciones específicas)
(define var-exp->id (lambda (exp) (cadr exp)))  ; Posición 1: identificador
(define lambda-exp->id (lambda (exp) (cadr exp)))  ; Posición 1: parámetro
(define lambda-exp->exp (lambda (exp) (caddr exp)))  ; Posición 2: cuerpo
(define app-exp->rator (lambda (exp) (cadr exp)))  ; Posición 1: operador
(define app-exp->rand (lambda (exp) (caddr exp)))  ; Posición 2: operando

;; === CÓDIGO DEL PROGRAMADOR (usa solo la interfaz) ===
(define occurs-free?
  (lambda (exp v)
    (cond
      [(var-exp? exp) (equal? v (var-exp->id exp))]  ; Variable libre si coincide
      [(lambda-exp? exp)
       (and (not (equal? v (lambda-exp->id exp)))  ; No libre si es parámetro
            (occurs-free? (lambda-exp->exp exp) v))]  ; Buscar en cuerpo
      [(app-exp? exp)
       (or (occurs-free? (app-exp->rator exp) v)  ; Libre en operador
           (occurs-free? (app-exp->rand exp) v))])))  ; o en operando

;; Ejemplos de uso
(define exp1 (var-exp 'x))  ; 'x
(define exp2 (lambda-exp 'x (app-exp (var-exp 'x) (var-exp 'y))))  ; (lambda (x) (x y))
(define exp3 (app-exp (var-exp 'x)  ; (x (lambda (x) (lambda (y) x)))
               (lambda-exp 'x 
                 (lambda-exp 'y (var-exp 'x)))))
```

### Estrategia Basada en Procedimientos

```lisp
#lang eopl
;; === CONSTRUCTORES (Implementación con closures) ===
(define var-exp
  (lambda (id)
    (lambda (s)  ; Closure que responde a selectores
      (cond
        [(= s 0) 'var-exp]  ; Selector 0: tipo
        [(= s 1) id]        ; Selector 1: identificador
        [else (eopl:error "Error en var-exp")]))))

(define lambda-exp
  (lambda (id exp)
    (lambda (s)
      (cond
        [(= s 0) 'lambda-exp]  ; Tipo
        [(= s 1) id]           ; Parámetro
        [(= s 2) exp]          ; Cuerpo
        [else (eopl:error "Error en lambda-exp")]))))

(define app-exp
  (lambda (rator rand)
    (lambda (s)
      (cond
        [(= s 0) 'app-exp]  ; Tipo
        [(= s 1) rator]     ; Operador
        [(= s 2) rand]      ; Operando
        [else (eopl:error "Error en app-exp")]))))

;; === OBSERVADORES (Misma interfaz) ===
;; Predicados
(define var-exp? (lambda (exp) (equal? (exp 0) 'var-exp)))  ; Invoca selector 0
(define lambda-exp? (lambda (exp) (equal? (exp 0) 'lambda-exp)))
(define app-exp? (lambda (exp) (equal? (exp 0) 'app-exp)))

;; Extractores
(define var-exp->id (lambda (exp) (exp 1)))  ; Invoca selector 1
(define lambda-exp->id (lambda (exp) (exp 1)))
(define lambda-exp->exp (lambda (exp) (exp 2)))  ; Invoca selector 2
(define app-exp->rator (lambda (exp) (exp 1)))
(define app-exp->rand (lambda (exp) (exp 2)))

;; === CÓDIGO DEL PROGRAMADOR (EXACTAMENTE EL MISMO) ===
; occurs-free? y ejemplos idénticos a la versión anterior
```

## Análisis Comparativo

### Ventajas de la estrategia basada en procedimientos:

1. **Encapsulación fuerte**: Los datos solo son accesibles mediante la interfaz definida
2. **Validación incorporada**: Los selectores validan los accesos
3. **Flexibilidad de implementación**: Puede cambiar la representación interna sin afectar la interfaz
4. **Posibilidad de comportamiento dinámico**: Los procedimientos pueden implementar lógica compleja

### Principio de EOPL demostrado:

El **código cliente** (`occurs-free?` y los ejemplos) permanece **inalterado** entre ambas implementaciones. Esto ilustra el principio fundamental de que la interfaz abstracta protege al programador de los detalles de implementación.

## Conclusión

Ambas estrategias implementan el mismo TAD pero con diferentes trade-offs:
- **Listas**: Más simple, menos overhead, pero menos encapsulación
- **Procedimientos**: Mejor encapsulación, validación, pero mayor overhead computacional

La elección depende de los requisitos específicos, pero la clave es que **la interfaz abstracta permanece constante**, permitiendo cambiar la implementación sin afectar el código existente.

---

**Para el estudiante que piensa que esto es muy abstracto:** Cada vez que usas `car` y `cdr` directamente, estás acoplando tu código a una representación específica. Dominar TADs te permitirá escribir código que sobreviva a cambios de requisitos y optimizaciones. Es como aprender a construir con LEGO en lugar de bloques de cemento: puedes reorganizar sin demoler todo. ¡Vale la pena el esfuerzo!