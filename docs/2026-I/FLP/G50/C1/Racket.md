# Conceptos
1. Es un lenguaje multiparadigma (principalmente funcional).
2. Los valores se declaran con `define`.
3. Los paréntesis guían la ejecución:
   4. En `(función ...)`, el primer elemento a la izquierda debe ser una función.
   5. Se evalúan de adentro hacia afuera. Ejemplo: `(+ (* 2 3) (* 3 4))` → primero `(* 2 3)` y `(* 3 4)` (izquierda a derecha), luego `(+ 6 12)` → `18`.
6. Condicionales:
   7. `if`: `(if pregunta respuesta_true respuesta_false)`.
   8. `cond`: `[(pregunta respuesta)] ... [(else respuesta)]`. Se evalúan de arriba hacia abajo.
9. Las listas son la estructura de datos (colección) más utilizada. Tienen la forma cabeza-cola:
   10. `(cons valor lista)`: la lista puede ser no vacía (`cons`) o vacía (`empty`).
   11. `(car lista)`: accede al primer elemento.
   12. `(cdr lista)`: accede al resto de la lista.
   13. Existe azúcar sintáctico con combinaciones como `cadr` (`car (cdr ...)`) o `caadr` (`car (car (cdr ...))`).
   14. `(list x x x)`: es una abstracción de `cons`.
   15. `'(x x y)`: todo lo interior se transforma en símbolo o número. Un símbolo (o átomo) es un tipo de dato indivisible que inicia con `'x`.

```scheme
#lang eopl

; Notación prefija: (f args...)

(display (+ 1 2 3 4 5)) ; Muestra la suma de 1 a 5

(define valor 3) ; Define una variable llamada 'valor' con el número 3

(define funcion
  (lambda (x y z) ; Define una función anónima con parámetros x, y, z
    (* (+ x y) (+ x z)) ; Retorna el producto de (x+y) y (x+z)
    )
  )

(display "\n") ; Salto de línea
(display (funcion 1 2 3)) ; Llama a 'funcion' con argumentos 1,2,3 y muestra el resultado

(define mayorEdad
  (lambda (edad)
    (if
     (>= edad 18) ; Condición: ¿edad mayor o igual a 18?
     "Es mayor de edad" ; Si es verdadero
     "Es menor de edad" ; Si es falso
     )))

(define mayorEdadPro
  (lambda (edad)
    (cond
      [(and (>= edad 0) (< edad 18)) "Es menor de edad"] ; Caso: entre 0 y 17
      [(>= edad 18) "Es mayor de edad"] ; Caso: 18 o más
      [else (eopl:error "Edad no válida")]))) ; Error si la edad es negativa

;; Listas
;; Estructura cabeza-cola
(define listaA (cons 1 (cons 2 (cons 3 empty)))) ; Lista construida con cons
(define listaB (list 1 2 3)) ; Lista usando la función list
(define listaC '(1 2 3)) ; Lista simbólica (los elementos se toman literalmente)

(define cuadrado (lambda (x) (* x x))) ; Función que calcula el cuadrado de x
(define listaD (list (cuadrado 1) (cuadrado 2) (cuadrado 3))) ; Lista con cuadrados evaluados
(define listaF '((cuadrado 1) (cuadrado 2) (cuadrado 3))) ; Lista simbólica (no evalúa cuadrado)

(map (lambda (x) (+ x 2)) listaA) ; Aplica (x+2) a cada elemento de listaA

(define listaG (list (list 1 2 3) (list 2 3 4))) ; Lista de listas usando list
(define listaH '((1 2 3) (2 3 4))) ; Lista simbólica de listas
(define listaI '(((((1 2 3 (3))) (4 5 6) (2 3)) 2) 4)) ; Lista anidada compleja

```

# Usando recursión para resolver problemas

En Racket, la recursión es el método principal para resolver problemas iterativos.

- **Caso base**: Situación trivial que detiene la recursión.
- **Caso recursivo**: Reduce el problema y avanza hacia el caso base.

```scheme
;; Sumar los elementos de una lista

(define sumar-elemento
  (lambda (lst)
    (cond
      [(null? lst) 0] ; Caso base: lista vacía, suma es 0
      [else (+ (car lst) (sumar-elemento (cdr lst)))]))) ; Caso recursivo: cabeza + suma de la cola

(define sumar-elemento-lista-listas
  (lambda (lst)
    (cond
      [(null? lst) 0] ; Caso base: lista vacía
      [(list? (car lst)) (+ (sumar-elemento-lista-listas (car lst)) ; Si el primer elemento es una lista, sumar recursivamente
                            (sumar-elemento-lista-listas (cdr lst)))] ; y sumar el resto de la lista
      [else (+ (car lst) (sumar-elemento-lista-listas (cdr lst)))]))) ; Si no es lista, sumar cabeza y continuar

(define sumar-elementoxD
  (lambda (lst [acc 0]) ; Parámetro opcional 'acc' (acumulador) inicializado en 0
    (cond
      [(null? lst) acc] ; Caso base: devolver acumulador
      [else (sumar-elementoxD (cdr lst) (+ acc (car lst)))]))) ; Caso recursivo: acumular cabeza y procesar cola
```

## Conceptos teóricos adicionales

- **Evaluación perezosa (lazy evaluation)**: Racket no es perezoso por defecto, pero ofrece construcciones como `delay` y `force` para evaluación diferida.
- **Funciones de orden superior**: Funciones que reciben o retornan otras funciones, como `map`, `filter`, `foldl`.
- **Clausuras (closures)**: Una función que captura el entorno donde fue definida, permitiendo acceso a variables externas.
- **Tipado dinámico**: Los tipos se verifican en tiempo de ejecución, no en compilación.
- **Inmutabilidad**: Los datos en Racket son inmutables por defecto; las operaciones crean nuevos valores en lugar de modificar existentes.

## Tabla de resumen

| Concepto | Descripción | Ejemplo |
|----------|-------------|---------|
| **Define** | Define variables o funciones. | `(define x 5)` |
| **Lambda** | Crea funciones anónimas. | `(lambda (x) (* x x))` |
| **If** | Condicional simple. | `(if (> x 0) "positivo" "negativo")` |
| **Cond** | Condicional múltiple. | `(cond [(> x 0) "+"] [(< x 0) "-"] [else "cero"])` |
| **Cons** | Construye una lista (cabeza + cola). | `(cons 1 (cons 2 empty))` |
| **Car** | Obtiene el primer elemento de una lista. | `(car '(a b c))` → `a` |
| **Cdr** | Obtiene el resto de la lista. | `(cdr '(a b c))` → `(b c)` |
| **List** | Crea una lista a partir de elementos. | `(list 1 2 3)` |
| **Lista simbólica** | Lista con elementos literales (no evaluados). | `'(a b c)` |
| **Recursión** | Técnica para repetir operaciones llamándose a sí misma. | Ver `sumar-elemento` |
| **Recursión con acumulador** | Recursión que lleva un estado acumulado. | Ver `sumar-elementoxD` |
| **Map** | Aplica una función a cada elemento de una lista. | `(map add1 '(1 2 3))` → `(2 3 4)` |

## Comentarios adicionales

- Racket es un dialecto de Scheme, que a su vez pertenece a la familia Lisp. Su sintaxis minimalista (muchos paréntesis) puede ser desafiante al inicio, pero permite una gran expresividad.
- La recursión es fundamental debido a la inmutabilidad de las listas; los bucles imperativos (como `for`) son menos comunes.
- Las listas en Racket son listas enlazadas simples, por lo que operaciones como `car` son O(1), pero acceder a un elemento por índice es O(n).
- Es recomendable usar funciones de orden superior (`map`, `filter`, `foldl`) cuando sea posible, ya que son más declarativas y reducen errores.
- Para depurar, se puede usar `(display ...)` o herramientas del entorno (DrRacket) para inspeccionar valores.
- En programas más grandes, es buena práctica documentar funciones con comentarios que especifiquen los tipos esperados y el propósito, aunque Racket no tenga tipado estático.