# Clase 1. Inducción y recursión: especificación de datos y de programas

Martes 8 de septiembre de 2026.

Un procedimiento recibe valores de cierta clase y devuelve valores de cierta
clase. Mientras esas clases sean finitas y pequeñas, describirlas es fácil:
se enumeran. La sesión empieza donde eso deja de funcionar, cuando la clase
tiene infinitos elementos, y termina con la pregunta de a cuál declaración
pertenece cada aparición de un nombre.

Las diapositivas están en el Campus Virtual. Aquí quedan las notas y el código
que se escribió en clase. El repaso del lenguaje va aparte, en
[Racket, lo que hace falta para empezar](./Racket.md).

Referencia: Friedman y Wand, *Essentials of Programming Languages*, 3.ª
edición, §1.1 a §1.3.

## Conjuntos definidos por reglas

Primero el problema. De estos valores, ¿cuáles son listas de tuplas $(a\;b)$
con $a$ par y $b$ múltiplo de tres?

```
()                          sí, la lista vacía siempre cumple
((2 3) (4 9))               sí
((2 3) (8 2))               no, 2 no es múltiplo de 3
((8 27) (6 3))              sí
(8 27 6 3)                  no, eso no son tuplas
```

Un lector humano decide esto de un vistazo. Una máquina no, y ahí empieza el
trabajo.

La primera idea es enumerar el conjunto: escribir todos sus elementos. No
sirve. El conjunto es infinito, ninguna enumeración infinita cabe en un
programa, y preguntar si $1000$ es par obligaría a recorrer la lista hasta
encontrarlo.

En lugar de decir cuáles son, se dice **cómo se construyen**. Una definición
inductiva tiene siempre dos partes:

1. Un **caso base**: ciertos valores están en el conjunto.
2. Una **regla inductiva**: si ciertos valores están, entonces otros también.

Y el conjunto es el más pequeño que cumple las dos.

Para los pares:

$$2 \in P \qquad \frac{n \in P}{n + 2 \in P}$$

Con eso se construye: $2$ por el caso base, $2+2=4$, $4+2=6$, $6+2=8$. Tres
aplicaciones de la regla sobre el caso base.

Para las listas de tuplas hacen falta varios conjuntos encadenados:

$$\frac{a \in P \quad b \in T}{(a\;b) \in \mathit{Tu}} \qquad \frac{t \in \mathit{Tu} \quad l \in L}{(t\;.\;l) \in L}$$

donde $T$ son los múltiplos de tres y $L$ las listas de tuplas. La lista vacía
es el caso base de $L$. Recordando la estructura de una lista: cabeza y cola,
donde la cola es a su vez una lista.

## Del conjunto al reconocedor

Cada regla de la especificación se vuelve una cláusula del procedimiento:

- el **caso base** responde que sí;
- la **regla inductiva** deshace la construcción —aplica la operación
  inversa— y vuelve a preguntar;
- lo que no encaja en ninguna regla responde que no.

```scheme
(define in-P?
  (lambda (n)
    (cond
      [(= n 2) #t]
      [(< n 2) #f]
      [else (in-P? (- n 2))])))
```

La regla suma dos, así que el reconocedor resta dos. Al evaluar `(in-P? 8)`:
ni es 2 ni es menor que 2, entonces `(in-P? 6)`, luego `(in-P? 4)`, luego
`(in-P? 2)`, que responde verdadero. Ese último caso ya no se evalúa más.

La cláusula `(< n 2)` no es un adorno. Sin ella, `(in-P? 3)` resta dos
indefinidamente y nunca alcanza el caso base: el procedimiento no termina. La
condición de terminación es parte del reconocedor, no un detalle que se pueda
omitir.

Con el mismo molde salen `in-T?` para los múltiplos de tres, `in-Tu?` para las
tuplas —una lista no vacía cuyo primer elemento es par y cuyo segundo es
múltiplo de tres— y `in-L?` para las listas de tuplas, donde el caso vacío
responde verdadero y el otro pregunta si el `car` es una tupla y si el `cdr`
es una lista de tuplas.

## Gramáticas BNF

Escribir las reglas en palabras se vuelve largo. La misma definición de las
listas de enteros, en notación BNF:

```
<lista-de-enteros> ::= ()
                   ::= (<int> . <lista-de-enteros>)
```

La notación fija los nombres de las categorías y hace visible la recursión: el
no terminal reaparece dentro de su propia producción.

Tres ingredientes (EOPL §1.1.2):

- **No terminales**: las categorías sintácticas, entre ángulos.
- **Terminales**: los símbolos concretos —paréntesis, la palabra `lambda`, un
  entero.
- **Producciones**: las reglas `no terminal ::= cuerpo`, donde el cuerpo
  mezcla las dos cosas.

Y tres abreviaturas: la barra `|` para alternativas, la cerradura de Kleene
$\{\ldots\}^{*}$ para cero o más, y la cerradura positiva $\{\ldots\}^{+}$ para
uno o más.

Un árbol binario:

```
<b-tree> ::= <int>
         ::= (<symbol> <b-tree> <b-tree>)
```

Así, `(f (k 2 3) (l (s 2 4) 3))` pertenece: `f` es el símbolo, `(k 2 3)` es el
hijo izquierdo —que a su vez cumple la segunda producción, con dos enteros
como hijos— y `(l (s 2 4) 3)` es el derecho.

La gramática que va a acompañar todo el curso es la de las expresiones lambda:

```
<lc-exp> ::= <identificador>
         ::= (lambda (<identificador>) <lc-exp>)
         ::= (<lc-exp> <lc-exp>)
```

Con ella se decide qué pertenece y qué no:

| Expresión | ¿Pertenece? | Por qué |
|---|---|---|
| `(lambda (x) (x y))` | sí | segunda producción; el cuerpo es una aplicación |
| `(lambda x x)` | no | al identificador le faltan los paréntesis |
| `(a b)` | sí | tercera producción, dos identificadores |
| `(x y w)` | no | la aplicación es binaria, no admite tres partes |

Las gramáticas del curso se leen de izquierda a derecha: la forma en que
empieza una producción es lo que permite distinguirla de las demás. Cuando dos
producciones empiezan igual, hay que transformarlas antes.

## Seguir la gramática

La gramática no solo dice qué pertenece: dice cómo se escribe el procedimiento
que la recorre. Tres reglas de diseño:

1. Un caso por cada producción del no terminal.
2. Una llamada recursiva por cada aparición del no terminal en la producción.
3. Confiar en que la llamada recursiva devuelve lo que su especificación
   promete, siempre que su entrada cumpla la precondición.

Contar los elementos de una lista sale directo de ahí:

```scheme
(define list-length
  (lambda (lst)
    (if (null? lst)
        0
        (+ 1 (list-length (cdr lst))))))
```

Dos producciones, dos casos. La lista vacía tiene cero elementos; en el otro
caso se suma uno y se sigue con el `cdr`. Termina porque una lista bien
formada llega siempre a la lista vacía bajando por los `cdr`, y ese es el caso
base de todo lo que estamos viendo.

## Recursión sobre árboles

Las listas y los árboles se recorren igual. La diferencia está en cuántas
llamadas recursivas pide la producción: una lista tiene un solo caso recursivo
—cabeza y cola—; un árbol tiene dos o más.

Recorrer un árbol y devolver sus elementos en preorden:

```scheme
(define arbol->lista
  (lambda (arb)
    (if (number? arb)
        (list arb)
        (append (list (car arb))
                (append (arbol->lista (cadr arb))
                        (arbol->lista (caddr arb)))))))
```

Para el árbol `(f (k 2 3) 4)`: `f` es el `car`, el hijo izquierdo es el `cadr`
y el derecho el `caddr`. Las llamadas se resuelven primero por la izquierda,
así que el resultado es `(f k 2 3 4)`.

Cambiar de preorden a inorden o a postorden es cambiar el orden en que se
juntan las tres partes: raíz-izquierda-derecha, izquierda-raíz-derecha,
izquierda-derecha-raíz.

## Ejercicio: dos reconocedores

Escritos en clase, en [`codigo/ejerciciosclase.rkt`](codigo/ejerciciosclase.rkt).

```scheme
(define (in-lc-exp? e)
  (cond ((symbol? e) #t)
        ((not (pair? e)) #f)
        ((eq? (car e) 'lambda)
         (and (list? (car (cdr e)))
              (symbol? (car (car (cdr e))))
              (in-lc-exp? (car (cdr (cdr e))))))
        (else
         (and (= (length e) 2)
              (or (in-lc-exp? (car e))
                  (in-lc-exp? (cadr e)))))))
```

Tres cosas que costaron al escribirlo. La primera: `(not (pair? e))` va
enseguida del caso del símbolo, porque todo lo demás supone que hay al menos
un paréntesis. La segunda: preguntar por el identificador de la lambda exige
bajar dos veces, `(car (car (cdr e)))`, y antes hay que verificar que
`(car (cdr e))` sea una lista, cosa que `and` permite hacer sin riesgo porque
evalúa en corto circuito. La tercera: la condición `(= (length e) 2)` va
**antes** de mirar las partes, o una expresión de tres elementos entraría
donde no debe.

```scheme
(define (in-b-tree? t)
  (cond ((number? t) #t)
        ((not (pair? t)) #f)
        (else
         (and (= (length t) 3)
              (symbol? (car t))
              (in-b-tree? (car (cdr t)))
              (in-b-tree? (car (cdr (cdr t))))))))
```

El mismo esqueleto con tres condiciones en lugar de dos: el tamaño, el símbolo
de la raíz y los dos hijos.

## Declaración, referencia y alcance

El mismo nombre puede aparecer muchas veces y significar cosas distintas. El
ejemplo de la sesión está en
[`codigo/ejercicio2clase.rkt`](codigo/ejercicio2clase.rkt):

```scheme
(define x            ; declara x1
  (lambda (x)        ; declara x2
    (map (lambda (x) ; declara x3
           (+ x 1))  ; referencia a x3
         x)))        ; referencia a x2
(x '(1 2 3))         ; referencia a x1
```

Cinco apariciones de `x`, tres declaraciones y tres referencias, y cada
referencia se resuelve con la declaración más cercana hacia afuera que la
contenga. Nada de esto depende de cómo se ejecute el programa: se decide
leyendo. Pegando ese código en DrRacket, las flechas del editor muestran
exactamente eso.

Cuatro términos que no son sinónimos:

- **Declaración**: la aparición que introduce la variable, como el parámetro
  de una `lambda` o el nombre en un `let`.
- **Referencia**: la aparición que la usa.
- **Ligadura**: la asociación entre una referencia y su declaración. El valor
  asociado es la denotación de la variable.
- **Alcance**: la región del programa donde las referencias a un nombre
  corresponden a una declaración dada.

Cuando las reglas se aplican leyendo el texto, el lenguaje es de **alcance
estático** o léxico; cuando se aplican durante la ejecución siguiendo la
cadena de llamadas, es de **alcance dinámico**, y ahí una variable declarada
dentro de un procedimiento podría verse desde afuera.

El fenómeno que aparece en el ejemplo se llama **ocultamiento**: la `x` de la
lambda interna tapa a la externa, porque crea un contexto nuevo. Se llaman
igual y son variables distintas.

## Ocurrencia libre y ocurrencia ligada

Sobre la gramática de expresiones lambda, la variable $x$ **ocurre libre** en
una expresión $e$ cuando:

1. $e$ es el identificador $x$; o
2. $e$ es `(lambda (y) e')` con $y \neq x$ y $x$ ocurre libre en $e'$; o
3. $e$ es `(e1 e2)` y $x$ ocurre libre en $e1$ o en $e2$.

Tres casos porque la gramática tiene tres producciones. En `(lambda (y) x)` la
variable ocurre libre: $y \neq x$ y en el cuerpo aparece sola. En
`(lambda (x) x)` no, porque el parámetro ya la liga.

Y **ocurre ligada** cuando:

1. $e$ es `(lambda (y) e')` y $x$ ocurre ligada en $e'$, o bien $y = x$ y $x$
   ocurre libre en $e'$; o
2. $e$ es `(e1 e2)` y $x$ ocurre ligada en $e1$ o en $e2$.

Un identificador solo nunca ocurre ligado.

**Libre y ligada no son opuestas.** Las dos pueden dar verdadero sobre la
misma expresión, y las dos pueden dar falso. En `((lambda (x) x) x)` la `x`
del operando está libre y la del cuerpo de la abstracción está ligada: los dos
predicados hablan de *ocurrencias*, no del nombre.

Contar cuántas veces ocurre libre, escrito en clase con la misma estructura de
tres casos:

```scheme
(define (cuantas-libres exp var)
  (cond ((symbol? exp)
         (if (equal? exp var) 1 0))
        ((equal? (car exp) 'lambda)
         (cond
           [(equal? (car (car (cdr exp))) var) 0]
           [else (cuantas-libres (car (cdr (cdr exp))) var)]))
        (else
         (+ (cuantas-libres (car exp) var)
            (cuantas-libres (car (cdr exp)) var)))))
```

El caso del símbolo devuelve uno o cero, la lambda corta y devuelve cero
cuando declara la variable buscada, y la aplicación suma lo que traigan sus
dos partes. El caso de terminación es el símbolo.

## let, let* y letrec

Las tres tienen dos áreas: la de declaraciones, donde van las ligaduras entre
paréntesis, y el cuerpo donde se usan.

Un `let` es una aplicación de `lambda` escrita de otra forma:

```scheme
(let ([x 10] [y 20]) (+ x y))
((lambda (x y) (+ x y)) 10 20)
```

Las expresiones de inicialización son los argumentos y se evalúan **antes** de
que exista cualquiera de las ligaduras nuevas, en el ambiente exterior. De ahí
que las variables de un mismo `let` no se conozcan entre sí: en
`(let ([x 5] [y (+ x 1)]) ...)` la referencia a `x` no se resuelve con la
ligadura de al lado, sino afuera, y si afuera no hay ninguna `x` el programa
falla con variable no ligada.

Se arregla anidando o con `let*`, que es lo mismo escrito más corto: cada
ligadura ve las anteriores.

El ejercicio de la sesión, en [`codigo/usolet.rkt`](codigo/usolet.rkt):

```scheme
(let ((x 3)
      (y 4))
  (+ (let ((x (+ y 5)))
       (* x y))
     x))
```

El `let` interno declara solo `x`, así que su `y` se busca afuera y vale 4.
Entonces la `x` interna vale $4+5=9$ y el producto da $36$. La `x` que queda
fuera del paréntesis interno sigue siendo la del `let` externo, que vale 3.
Total: **39**. Pegar el código en DrRacket y seguir las flechas confirma a
cuál declaración apunta cada nombre.

`letrec` liga los nombres **antes** de evaluar las expresiones, y por eso es
la que sirve para procedimientos que se llaman a sí mismos o entre sí:

```scheme
(letrec ([es-par? (lambda (n) (if (zero? n) #t (es-impar? (- n 1))))]
         [es-impar? (lambda (n) (if (zero? n) #f (es-par? (- n 1))))])
  (es-par? 10))
```

Con `let*`, `es-par?` no podría nombrar a `es-impar?`. Conviene reservar
`letrec` para procedimientos: `(letrec ([x y] [y x]) ...)` es una definición
recursiva que no tiene fin.

## Ejercicio de cierre: devolver dos respuestas de un recorrido

`quita-y-cuenta` recibe un símbolo y una lista, y devuelve una lista de dos
elementos: la lista sin las apariciones del símbolo y cuántas quitó. En
[`codigo/ejercicio3clase.rkt`](codigo/ejercicio3clase.rkt):

```scheme
(define (quita-y-cuenta s lst)
  (cond ((null? lst) (list '() 0))
        ((eq? (car lst) s)
         (let ([resto (quita-y-cuenta s (cdr lst))])
           (list (car resto) (+ 1 (car (cdr resto))))))
        (else
         (let ([resto (quita-y-cuenta s (cdr lst))])
           (list (cons (car lst) (car resto)) (car (cdr resto)))))))
```

```
(quita-y-cuenta 'a '(a b a c)) → ((b c) 2)
(quita-y-cuenta 'a '())        → (() 0)
(quita-y-cuenta 'z '(a b))     → ((a b) 0)
(quita-y-cuenta 'a '(a a a))   → (() 3)
```

Un solo recorrido produce las dos respuestas. La llamada recursiva se liga a
un nombre porque hace falta dos veces: su primera parte es la lista y la
segunda es la cuenta. Sin esa ligadura habría que escribirla dos veces, y
escribirla dos veces la evalúa dos veces.

Las dos cláusulas arman la misma pareja y se diferencian en qué hacen con el
primer elemento: la que lo encuentra lo deja fuera y suma uno; la otra lo
conserva con `cons` y deja la cuenta como venía.

## Para practicar

Las actividades de esta sesión están en
[Ejercicios interactivos](./Ejercicios.md), y el repaso del lenguaje en
[Ejercicios de Racket](./EjerciciosRacket.md). Corren en el navegador, sin
instalar nada.

El evaluador de esas páginas es pequeño y no reemplaza a DrRacket: no tiene
`define-datatype` ni `cases`. Lo que se entrega se escribe y se corre en
DrRacket.
