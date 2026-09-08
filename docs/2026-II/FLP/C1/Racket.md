# Racket, lo que hace falta para empezar

Repaso del lenguaje del curso, hecho antes de entrar en materia. No es un
tutorial completo: es lo que se necesita para escribir los procedimientos de
esta sesión. El código de esta página está en
[`codigo/introracket.rkt`](codigo/introracket.rkt).

Todo archivo empieza con `#lang eopl`, que es el lenguaje del libro. Sin esa
línea, las construcciones que usaremos más adelante —`define-datatype`,
`cases`— no existen.

## El operador va adelante

En notación infija se escribe `5 + 3`. Aquí no: el primer elemento de cada
paréntesis es la función y lo que sigue son sus argumentos.

```scheme
(+ 5 3)        ; 8
(+ 5 3 10 20)  ; 38, varios argumentos
(- 10 3)       ; 7
```

Los paréntesis se evalúan de adentro hacia afuera, y eso reemplaza cualquier
tabla de precedencia: el anidamiento dice qué se aplica a qué. Un paréntesis
que abre es un paréntesis que cierra, sin excepciones.

## Ligaduras, no variables

`define` asocia un nombre a un valor. La asociación no cambia después.

```scheme
(define x 3)
(define y (* x 3))   ; y vale 9
```

Redefinir `x` no es reasignar: DrRacket responde que el identificador ya fue
definido y el programa no corre. Son ligaduras inmutables, como los `val` de
otros lenguajes.

DrRacket dibuja una flecha desde cada declaración hasta sus referencias. Esa
flecha es la razón para preferirlo a un editor con más ayudas: muestra a cuál
declaración pertenece cada aparición de un nombre, que es justamente el tema
de la segunda mitad de la sesión.

## Procedimientos

Se declaran con `lambda`. Un procedimiento es un valor, igual que un número.

```scheme
(define f
  (lambda (x) (* x 2)))

(f 10)       ; 20
(f (f 10))   ; 40
```

Con un procedimiento solo se pueden hacer dos cosas: pasarlo como valor o
evaluarlo.

## Preguntar: cond e if

`cond` prueba sus cláusulas de arriba abajo y se queda con la primera que
resulte verdadera. `if` tiene tres partes: la pregunta, la respuesta cuando es
verdadera y la respuesta cuando es falsa. Las dos ramas son obligatorias.

```scheme
(define g
  (lambda (x [acc 0])
    (cond
      [(= x 0) acc]
      [else (g (- x 1) (+ x acc))])))

(define h
  (lambda (x [acc 0])
    (if (= x 0)
        acc
        (h (- x 1) (+ x acc)))))

(g 10)   ; 55
(h 10)   ; 55
```

Los dos calculan lo mismo. No hay `for` ni `while`: lo que en otros lenguajes
es un ciclo, aquí es una llamada recursiva.

## Recursión lineal y recursión de cola

`g` y `h` llevan un acumulador y la llamada recursiva es lo último que ocurre.
Esa es la forma de cola, y el lenguaje la optimiza reutilizando el marco de
pila en lugar de apilar uno nuevo. La forma lineal deja una operación
pendiente después de la llamada, y con datos grandes esa pila termina siendo
el problema.

El corchete en `[acc 0]` declara un argumento con valor por defecto, de modo
que quien llama escribe `(g 10)` y no `(g 10 0)`.

## Números

La aritmética es exacta y sin límite de tamaño. Una división que no da entero
se representa como fracción, no como número de punto flotante, y DrRacket
permite verla como decimal, como fracción impropia o como número mixto. Hay
también números complejos, `5+4i`.

## Listas

Tres formas de escribir la misma lista:

```scheme
(define lst1 (cons 4 (cons 3 (cons 2 empty))))
(define lst2 (list 4 3 2))
(define lst3 '(4 3 2))
```

`cons` recibe un elemento y una lista; `empty` es la lista vacía. La segunda y
la tercera son azúcar sintáctico de la primera.

Una lista tiene dos partes: el `car`, que es su primer elemento, y el `cdr`,
que es la lista con el resto. Para llegar al segundo elemento hay que pedir el
`car` del `cdr`, que se abrevia `cadr`; al tercero, `caddr`.

## Listas simbólicas

Con listas anidadas la diferencia se nota:

```scheme
(define ll1 (list (list 1 2) (list 4 3)))
(define ll2 '((1 2) (4 3)))
```

Las dos producen lo mismo y la segunda se lee mejor. Pero la comilla tiene una
consecuencia que hay que tener presente:

```scheme
(define ll3 (list (g 10) (g 20)))   ; (55 210)
(define ll4 '((g 10) (g 20)))       ; ((g 10) (g 20))
```

`ll4` no evalúa nada. Todo lo que queda dentro de la comilla se convierte en
dato, y `g` deja de ser el procedimiento para volverse un símbolo. Dentro de
una lista simbólica no se evalúa.

## Símbolos y cadenas

```scheme
(define sim 'xads)    ; símbolo
(define str "xads")   ; cadena
```

Se parecen al escribirlos y son cosas distintas. Un símbolo es un átomo: no se
puede partir, no admite espacios y se compara de un golpe con `eq?`. Una cadena
sí se divide en caracteres. Los programas que vamos a representar están hechos
de símbolos, no de cadenas, y por eso buscar una variable en un ambiente será
una comparación directa y no un recorrido de letras.
