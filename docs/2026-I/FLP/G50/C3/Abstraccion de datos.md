
# Abstracción de datos

Los **Tipos Abstractos de Datos (TAD)** surgen a partir de una especificación. Esta define un conjunto de valores que pertenecen al tipo de dato. Por ejemplo: números enteros, booleanos, etc.

Para implementar un TAD, tenemos dos grandes partes:

1. **Implementación**: Es cómo se maneja internamente el dato.
   2. En C++ y Java, un `int` es un valor de 32 bits.
   3. En Python, un `int` es un objeto.
   4. Internamente son distintos, pero cumplen la misma especificación abstracta.

5. **Interfaz**: Es lo que me permite utilizar el tipo de dato: funciones, operaciones y las características del tipo de datos.
   6. En C++ y Java puedo hacer operaciones aritméticas; no sé cómo se hacen internamente, pero las puedo utilizar.
   7. En Python también puedo hacer lo mismo y, desde el punto de vista del usuario, no veo diferencia.

El principio fundamental es la **separación entre la interfaz y la implementación**. El usuario del tipo de dato solo interactúa con la interfaz, sin conocer los detalles internos de cómo se almacenan o manipulan los datos. Esto permite cambiar la implementación sin afectar el código que usa el tipo de dato.

# Representaciones de los Números Naturales

Vamos a explorar diferentes formas de implementar el TAD de los números naturales ($\mathbb{N}$), definido por las operaciones:
- `zero`: Representa el número 0.
- `is-zero?`: Predicado que verifica si un número es cero.
- `succ`: Constructor que devuelve el sucesor de un número (n+1).
- `pred`: Constructor que devuelve el predecesor de un número (n-1), con la restricción de que no existe para el cero.

## 1. Representación Recursiva (Usando los Nativos de Racket)

Esta es la representación más directa, utilizando los números enteros nativos de Racket como representación subyacente.

```scheme
#lang eopl
#|
Representación Racket para números naturales utilizando la representación nativa.
La interfaz abstracta se implementa sobre los números enteros del lenguaje.
|#

; --- INTERFAZ DEL TAD ---

; Caso base: la constante cero.
(define zero 0)

; Predicado: verifica si un número natural es cero.
(define is-zero? (lambda (n) (equal? n zero)))

; Constructor: devuelve el sucesor de un número natural n.
(define succ (lambda (n) (+ n 1)))

; Constructor: devuelve el predecesor de un número natural n.
; Lanza un error si se intenta obtener el predecesor de cero.
(define pred
  (lambda (n)
    (if (is-zero? n)
        (eopl:error "No existe predecesor de 0")
        (- n 1))))

; --- ÁREA DEL PROGRAMADOR (USUARIO DEL TAD) ---
; El código a continuación utiliza solo la interfaz definida arriba.
; No depende de saber que `zero` es el número 0 internamente.

; Construye el número 5 aplicando sucesor cinco veces desde cero.
(define cinco (succ (succ (succ (succ (succ zero))))))
; Construye el número 6.
(define seis (succ (succ (succ (succ (succ (succ zero)))))))

; suma: natural x natural -> natural
; Implementa la suma utilizando solo las operaciones del TAD.
; Estrategia: sumar 1 a 'a' y restar 1 a 'b' hasta que 'b' sea cero.
(define suma
  (lambda (a b)
    (if (is-zero? b)
        a ; Caso base: a + 0 = a
        (suma (succ a) (pred b)) ; Caso recursivo: a + b = (a+1) + (b-1)
    )
  )
)
```

## 2. Representación Basada en Listas

Ahora implementaremos el mismo TAD utilizando una representación subyacente diferente: listas. La idea es que un número natural `n` se representa como una lista de `n` elementos `#t`.
- `zero` se representa como la lista vacía `'()`.
- `succ` agrega un elemento `#t` al frente de la lista.
- `pred` elimina un elemento del frente de la lista (el `cdr`).

```scheme
#lang eopl
#|
Representación Racket para números naturales utilizando listas.
Representación: n = lista de n elementos #t. cero = lista vacía.
|#

; --- INTERFAZ DEL TAD ---

; Caso base: el número cero es la lista vacía.
(define zero '())

; Predicado: un número es cero si es igual a la lista vacía.
(define is-zero? (lambda (n) (equal? n zero)))

; Constructor: el sucesor de n es una lista con un nuevo #t al frente.
(define succ (lambda (n) (cons #t n)))

; Constructor: el predecesor de n es la lista sin su primer elemento.
; Lanza un error si se intenta obtener el predecesor de cero (lista vacía).
(define pred
  (lambda (n)
    (if (is-zero? n)
        (eopl:error "No existe predecesor de 0")
        (cdr n)))) ; cdr devuelve la lista sin el primer elemento.

; --- ÁREA DEL PROGRAMADOR ---
; El usuario del TAD utiliza exactamente la misma interfaz.
; El código de usuario (como la función `suma`) NO CAMBIA.

(define cinco (succ (succ (succ (succ (succ zero))))))
(define seis (succ (succ (succ (succ (succ (succ zero)))))))

; La función `suma` es IDÉNTICA a la de la representación anterior.
; Esto demuestra la ventaja de la abstracción: el algoritmo no depende de la implementación.
(define suma
  (lambda (a b)
    (if (is-zero? b)
        a
        (suma (succ a) (pred b))
    )
  )
)
```

## 3. Representación Bignum (Base N)

Esta representación es más eficiente para números grandes. Se representa un número en una base `N` (ej., binaria, decimal, hexadecimal) como una lista de dígitos (del 0 a `N-1`), donde el dígito menos significativo está al frente de la lista.
- `zero` se representa como la lista vacía `'()`.
- Un número `n > 0` se representa como `(cons r q)`, donde `n = q * N + r`, con `0 <= r < N`. Es la representación posicional habitual.

**Ejemplo (Base N=2, binaria):**
- 0 = `'()`
- 1 = `'(1)`       (1 = $1*2^0$)
- 2 = `'(0 1)`     (2 = $0*2^0 + 1*2^1$)
- 3 = `'(1 1)`     (3 = $1*2^0 + 1*2^1$)
- 4 = `'(0 0 1)`   (4 = $0*2^0 + 0*2^1 + 1*2^2$)

Las operaciones `succ` y `pred` deben manejar el acarreo (carry) y el préstamo (borrow) entre dígitos.

```scheme
#lang eopl
#|
Representación Racket para números naturales Bignum.
Base N: un número n se representa como una lista de dígitos (0 a N-1),
con el dígito menos significativo al frente.
n = 0  --> '()
n > 0 --> (cons r q)    donde n = q * N + r, 0 <= r < N
|#

(define N 16) ; Definimos la base, por ejemplo, hexadecimal (base 16).

; --- INTERFAZ DEL TAD ---

; Caso base: el número cero es la lista vacía.
(define zero '())

; Predicado: un número es cero si es la lista vacía.
(define is-zero? (lambda (n) (equal? n zero)))

; Constructor: devuelve el sucesor de un número n, manejando acarreos.
(define succ (lambda (n)
               (cond
                 [(is-zero? n) '(1)] ; El sucesor de 0 es 1 (representado como el dígito 1).
                 [(= (+ 1 (car n)) N) ; Si al sumar 1 al dígito actual alcanzamos la base N...
                  (cons 0 (succ (cdr n))) ; ...ponemos 0 en este dígito y propagamos el acarreo al siguiente.
                  ]
                 [else ; No hay acarreo, simplemente incrementamos el dígito menos significativo.
                  (cons (+ 1 (car n))
                        (cdr n))])))

; Constructor: devuelve el predecesor de un número n, manejando préstamos.
(define pred
  (lambda (n)
    (cond
      [(is-zero? n) (eopl:error "No existe predecesor de 0")]
      [(equal? n '(1)) '()] ; El predecesor de 1 es 0.
      [(= (car n) 0) ; Si el dígito actual es 0, no podemos restar 1 directamente.
       (cons (- N 1) (pred (cdr n)))] ; Tomamos un préstamo: este dígito se convierte en N-1.
      [else ; No hay préstamo, simplemente decrementamos el dígito.
       (cons (- (car n) 1)
             (cdr n))]
      )))

; --- ÁREA DEL PROGRAMADOR ---
; Nuevamente, el código del usuario es idéntico. La complejidad está aislada en la implementación.

(define cinco (succ (succ (succ (succ (succ zero))))))
(define seis (succ (succ (succ (succ (succ (succ zero)))))))

(define suma
  (lambda (a b)
    (if (is-zero? b)
        a
        (suma (succ a) (pred b))
    )
  )
)
```

# Tabla de Resumen: Abstracción de Datos y Representaciones

| Concepto | Definición | Ejemplo en la Clase | Propósito/Importancia |
| :--- | :--- | :--- | :--- |
| **Tipo Abstracto de Dato (TAD)** | Especificación de un conjunto de valores y operaciones sobre ellos, independiente de su implementación. | El TAD de los Números Naturales con `zero`, `is-zero?`, `succ`, `pred`. | Separar el *qué* (interfaz) del *cómo* (implementación). Permite razonar sobre programas de manera más clara. |
| **Interfaz** | Conjunto de operaciones (funciones, procedimientos) que un programa puede usar para interactuar con el TAD. | Las funciones `zero`, `is-zero?`, `succ`, `pred` que el programador usa para construir y operar números. | Define el contrato que debe cumplir cualquier implementación. El código del usuario solo depende de la interfaz. |
| **Implementación** | Conjunto de estructuras de datos y algoritmos concretos que dan vida a la interfaz del TAD. | 1. Números nativos de Racket.<br>2. Listas de elementos `#t`.<br>3. Listas de dígitos en base N (Bignum). | Provee el comportamiento especificado por la interfaz. Puede cambiarse para mejorar eficiencia, sin afectar al usuario. |
| **Representación Recursiva** | Implementación que se apoya directamente en un tipo de dato primitivo del lenguaje. | Usar el número `0` de Racket para representar `zero` y las operaciones aritméticas nativas para `succ`/`pred`. | Sencilla y eficiente, pero acopla el TAD a los detalles específicos del lenguaje. |
| **Representación Estructural** | Implementación que construye el TAD a partir de otras estructuras de datos más básicas (como listas). | Representar un número `n` como una lista de `n` elementos `#t`. | Demuestra que se puede construir un nuevo tipo de dato desde cero. Es ineficiente para números grandes. |
| **Representación Bignum** | Representación posicional en una base `N`, ideal para números de magnitud arbitraria. | Representar números como listas de dígitos (ej., base 16), manejando acarreos y préstamos. | Es eficiente en espacio y tiempo para operaciones con números muy grandes. La complejidad se encapsula en la implementación. |
| **Principio de Abstracción** | La capacidad de ocultar los detalles de implementación, exponiendo solo una interfaz esencial. | El programador escribe la función `suma` una sola vez, y funciona con cualquiera de las tres representaciones. | Reduce la complejidad, facilita el mantenimiento y permite la reutilización de código. |

# Comentarios Adicionales sobre el Tema

1.  **Ventaja Clave de la Abstracción**: El ejemplo de la función `suma` es fundamental. Se escribió **una sola vez** utilizando únicamente la interfaz del TAD (`zero`, `is-zero?`, `succ`, `pred`). Esta misma función funciona correctamente con las tres implementaciones radicalmente diferentes (números nativos, listas de `#t`, bignum). Esto es el poder de la abstracción: el algoritmo lógico de la suma es independiente de *cómo* se almacenan los números.

2.  **Elección de la Implementación**: La decisión de qué implementación usar depende del contexto:
    *   **Representación nativa**: Es la opción práctica y eficiente en la mayoría de los casos, pero no ilustra el concepto de construcción de un TAD desde cero.
    *   **Representación estructural (listas de `#t`)**: Es pedagógica. Demuestra que se puede definir un nuevo concepto (número natural) usando solo listas, pero es tremendamente ineficiente en memoria y tiempo para valores grandes.
    *   **Representación Bignum**: Es la usada en lenguajes como Python para enteros de precisión arbitraria. Su complejidad algorítmica (manejo de acarreos) está completamente encapsulada, ofreciendo una interfaz simple para el usuario.

3.  **Invariante de Representación**: En implementaciones como la bignum, existe un **invariante** que debe mantenerse: la lista no debe tener dígitos líderes iguales a cero (excepto para la representación del número cero mismo). Las funciones `succ` y `pred` deben diseñarse para preservar este invariante. Este es un detalle de implementación crítico que la interfaz oculta.

4.  **Relación con el Mundo Real**: Este patrón es ubicuo en la ingeniería de software. Por ejemplo, una base de datos ofrece una interfaz (SQL: `SELECT`, `INSERT`) mientras que su implementación (almacenamiento en disco, índices, caché) puede variar enormemente (MySQL, PostgreSQL, SQLite). El programador que escribe consultas no necesita conocer estos detalles.

5.  **Próximos Pasos**: La abstracción de datos es el fundamento para construir estructuras de datos más complejas como pilas, colas, conjuntos y árboles de manera robusta y reusable. El patrón será siempre el mismo: definir una interfaz clara y luego proporcionar una o más implementaciones que la satisfagan.