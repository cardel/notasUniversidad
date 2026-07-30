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