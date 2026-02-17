# Alcance de Variables

Los lenguajes de programación pueden manejar diferentes reglas de alcance de variables. Existen dos modelos principales:

1. **Alcance Estático (Lexical Scope)**: El alcance se determina por la estructura sintáctica del código (bloques). Una variable es accesible en la región donde se declara y en todas las regiones anidadas dentro de ella.

2. **Alcance Dinámico**: Una variable es potencialmente global y accesible desde cualquier lugar durante la ejecución, dependiendo de la pila de llamadas.

Racket utiliza **alcance estático**, que es el más común en lenguajes modernos.

## Sombreamiento de Variables

Consideremos el siguiente ejemplo:

```scheme
(lambda (x y z)
	(lambda (x a b)
		(+ x y z a b c)
	)
)
```

En este código, la variable `x` interna **sombrea** (u oculta) a la `x` externa. Desde el código interno, la primera `x` **no es accesible directamente** porque el identificador se resuelve al parámetro más cercano (la `x` del lambda interno).

Los lambdas crean ligaduras a través de sus parámetros. Estas ligaduras se establecen cuando la función se **evalúa** (es decir, cuando se aplica la función a argumentos).

### Ejemplo de Sombreamiento

```scheme
#lang eopl

; Define una función f que retorna otra función
(define f
  (lambda (x y z)
    ; La función interna sombrea el parámetro x
    (lambda (x a b c)
      ; Este x se refiere al parámetro más cercano (x=4)
      ; Los y, z se refieren a los parámetros externos (y=2, z=3)
      (+ x y z a b c)
      )
    ))

; Evaluación:
; (f 1 2 3) retorna una función con x=1, y=2, z=3 capturados
; ((f 1 2 3) 4 5 6 7) aplica esa función con x=4, a=5, b=6, c=7
; Resultado: 4 + 2 + 3 + 5 + 6 + 7 = 27
; Nota: el primer x=1 NO está accesible desde la suma porque está sombrado
(display ((f 1 2 3) 4 5 6 7))
(newline)
```

---

## Let: Ligaduras Locales Paralelas

`let` permite definir ligaduras locales cuyo alcance se limita a la expresión body de `let`. La característica fundamental es que **todas las ligaduras se crean de forma paralela**: los valores en el área de declaraciones se evalúan **antes** de que cualquiera de las nuevas ligaduras entre en efecto.

```scheme
(let
    (
        ; Área de declaraciones: pares (identificador valor)
        (identificador1 valor1)
        (identificador2 valor2)
        ...
    )
    ; Área de expresión: aquí están disponibles las ligaduras
    expresion-body
)
```

### Ejemplo: Ligaduras Paralelas

```scheme
#lang eopl

; Ejemplo de ligaduras paralelas en let
(define x
  (let
      ((x 3) (y 4) (z 5))
    ; Los nuevos x, y, z pueden usar los valores anteriores
    (let
        ((x z) (y x) (z y))
        ; x = 5 (valor de z anterior)
        ; y = 3 (valor de x anterior)
        ; z = 4 (valor de y anterior)
        (+ (* x y) (* x z))        ; (5 * 3) + (5 * 4) = 15 + 20 = 35
        )
    )
  )

(display "Ligaduras paralelas: ")
(display x)
(newline)

; PROBLEMA: Las ligaduras en let son PARALELAS, no secuenciales
; En el siguiente código, cuando se evalúa (+ x 1) para y,
; x aún no está disponible en el área de declaraciones
(define problema
  (let
      ((x 3) (y (+ x 1)))  ; ERROR: x no está definido aquí
    (+ x y)
    )
  )

; SOLUCIÓN: Anidar lets para crear dependencias secuenciales
(define j2
  (let
      ((x 3))
    (let
        ((y (+ x 1)))       ; Ahora x está disponible
        (+ x y)             ; x=3, y=4, resultado=7
        )
    )
  )

(display "Ligaduras anidadas: ")
(display j2)
(newline)
```

### Restricción de Let

La principal limitación de `let` es que **todas las expresiones de valor se evalúan en el alcance externo**. Esto significa que si una ligadura depende de otra dentro del mismo `let`, generará un error.

---

## Let*: Ligaduras Secuenciales

`let*` permite hacer definiciones secuenciales, respetando el orden de las declaraciones como en un lenguaje imperativo. Cada ligadura se crea **inmediatamente después** de su declaración, permitiendo que posteriores ligaduras la usen.

```scheme
(let*
    (
        (identificador1 valor1)
        (identificador2 valor2)  ; Puede usar identificador1
        (identificador3 valor3)  ; Puede usar identificador1 e identificador2
        ...
    )
    ; Área de expresión
    expresion-body
)
```

### Ejemplo: Definiciones Secuenciales

```scheme
#lang eopl

; let* permite que las ligaduras dependan unas de otras secuencialmente
(define j
  (let*
      ((x 3) (y (+ x 1)))      ; y puede usar x porque x ya está definido
    (+ x y)                     ; x=3, y=4, resultado=7
    )
  )

(display "Ligaduras secuenciales con let*: ")
(display j)
(newline)

; PROBLEMA: let* no permite referencias recursivas
; f y g no se conocen entre sí porque aún no están completamente definidas
(define problema2
  (let*
      (
       (f (lambda (x) (+ (g x) (f x))))  ; g no está definido aún
       (g (lambda (x) (g x)))             ; g no se conoce a sí misma
       )
    (f 10)
    ))

; Esto generaría un error cuando se intente evaluar (g x) o (g x)
```

---

## Letrec: Ligaduras Recursivas Mutuales

`letrec` permite que las variables se conozcan a sí mismas y se conozcan mutuamente. Esto es esencial para definir funciones recursivas o mutuamente recursivas. Las ligaduras en `letrec` están disponibles en **todas** las expresiones de valor, incluyendo las propias.

```scheme
(letrec
    (
        (identificador1 expresion1)  ; Puede usar identificador1, identificador2, ...
        (identificador2 expresion2)  ; Puede usar identificador1, identificador2, ...
        ...
    )
    ; Área de expresión
    expresion-body
)
```

### Ejemplo: Funciones Recursivas Mutuales

```scheme
#lang eopl

; letrec permite que f llame a g y g se llame a sí misma
(define j
  (letrec
      (
       ; f puede llamar a g y a sí misma (f)
       (f (lambda (x)
            (if (< x 0)
                0
                (+ (g (- x 1)) (f (- x 1))))))
       ; g puede llamarse a sí misma
       (g (lambda (x)
            (if (< x 0)
                0
                (g (- x 1)))))
       )
    (f 10)
    ))

(display "Recursión mutua con letrec: ")
(display j)
(newline)
```

### Restricción de Letrec: Abrazo Mortal (Deadlock)

`letrec` **no se recomienda** usar con valores diferentes a procedimientos (funciones lambda). El problema es que puede generarse un **abrazo mortal** (circular dependency) si dos ligaduras dependen una de la otra.

```scheme
#lang eopl

; PROBLEMA: Abrazo mortal en letrec
; x espera que y esté definida
; y espera que x esté definida
; Esto genera una dependencia circular sin solución
(define k
  (let
      (
       (x 10)
       (y 20)
       )
    (letrec
        (
         (x (+ y 3))             ; x depende de y
         (y (+ x 3))             ; y depende de x
         )
      (+ x y))))

; Cuando se evalúa (+ y 3), y aún no tiene un valor bien definido
; Cuando se evalúa (+ x 3), x aún no tiene un valor bien definido
; El intérprete no puede resolver esta dependencia circular
```

### ¿Por Qué Funciona con Funciones?

`letrec` funciona con funciones (lambdas) porque:

1. El cuerpo del lambda **no se evalúa** inmediatamente; solo se crea una estructura que representa la función
2. Las referencias a otras funciones dentro del lambda se resuelven **en tiempo de ejecución**, cuando se llama a la función, no cuando se crea

Por ejemplo, en:
```scheme
(f (lambda (x) (g (- x 1))))
```

La expresión `(g (- x 1))` no se evalúa cuando se crea el lambda. Se evalúa solo cuando `f` se llama, en cuyo momento `g` ya está completamente definida.

---

## Tabla de Resumen

| Concepto | Definición | Características | Diferencias Clave |
|----------|-----------|-----------------|------------------|
| **Alcance Estático (Lexical)** | Determinado por la estructura sintáctica del código | Una variable es accesible en su región de declaración y regiones anidadas | Determinado en tiempo de compilación |
| **Alcance Dinámico** | Basado en la pila de llamadas durante la ejecución | Una variable puede ser accesible desde cualquier función si está en la pila | Menos seguro, dificulta el razonamiento |
| **Sombreamiento** | Una variable interna oculta una variable externa del mismo nombre | El identificador se resuelve a la ligadura más cercana | Puede causar confusiones; afecta accesibilidad |
| **Let** | Crea ligaduras locales paralelas con alcance limitado | Todas las expresiones de valor se evalúan en el alcance externo antes de crear ligaduras | Las ligaduras NO pueden depender unas de otras |
| **Ligaduras Paralelas** | Múltiples ligaduras creadas simultáneamente | Todas disponibles al mismo tiempo en el body de let | Orden no afecta evaluación de expresiones |
| **Let*** | Crea ligaduras locales secuenciales | Las ligaduras se crean en orden; posteriores pueden usar anteriores | Las ligaduras PUEDEN depender unas de otras |
| **Ligaduras Secuenciales** | Ligaduras creadas una tras otra en orden | Cada nueva ligadura entra en efecto inmediatamente | Orden ES importante |
| **Letrec** | Crea ligaduras recursivas mutuales | Todas las ligaduras se conocen entre sí | Ideal para funciones recursivas y mutuamente recursivas |
| **Recursión Mutua** | Dos o más funciones que se llaman entre sí | Requiere que ambas funciones estén disponibles | Solo funciona correctamente en letrec con lambdas |
| **Abrazo Mortal (Deadlock)** | Dependencia circular entre ligaduras que no puede resolverse | Ocurre en letrec cuando valores no-función dependen circularmente | Indica error de especificación |
| **Captura de Ambiente (Closure)** | Una función retiene referencias a variables del alcance donde se definió | Fundamental para programación funcional | Las funciones retienen variables libres |

### Comentarios Adicionales

- **Elección entre Let, Let* y Letrec**: 
  - Usa `let` cuando las ligaduras son **independientes**
  - Usa `let*` cuando hay **dependencias lineales** (a depende de b depende de c...)
  - Usa `letrec` cuando hay **recursión o recursión mutua**

- **Equivalencia Teórica**: `let*` puede ser reescrito como `let`s anidados. `letrec` tiene equivalencia más compleja que involucrautiles internos para crear el ambiente apropiado.

- **Costo de Abstracción**: Usar múltiples `let`s anidados en lugar de `let*` es funcionalmente equivalente pero puede ser menos legible. El compilador generalmente optimiza ambos al mismo código.

- **Variables Libres en Letrec**: En `letrec`, cuando escribimos `(f (lambda (x) (+ x (g x))))`, la `g` es una **variable libre** en el lambda. Esta variable libre se resuelve dentro del ambiente `letrec` donde ambas están disponibles.

- **Orden en Letrec**: Aunque el orden no importa para referencias mutuas en `letrec`, es buena práctica mantener un orden lógico (por ejemplo, definir primero las funciones principales).

- **Prevención de Abrazo Mortal**: Para evitar el abrazo mortal, no mezcles `letrec` con valores no-función que dependan circularmente. Alterna con `let` o `let*` cuando sea necesario:
  ```scheme
  (let* ((x 10))
    (letrec ((f (lambda () x)))
      (f)))
  ```

- **Implementación Interna**: `letrec` se implementa típicamente creando primero todas las ligaduras con valores undefined, luego evaluando todas las expresiones en un paso, luego asignando los valores. Las funciones funcionan porque su evaluación no accede a los valores hasta que se llamen.