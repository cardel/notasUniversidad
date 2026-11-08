# Clase 9. Colecciones II: mapas y flujos

**Jueves 5 de noviembre de 2026, de 7:00 a 10:00 el grupo 50 y de 14:00 a
17:00 el grupo 51, con el mismo contenido en las dos sesiones.**

La sesión cierra el bloque de colecciones con tres cosas: escribir consultas
con expresiones `for`, asociar datos con `Map`, y calcular solo lo que se
necesita con `LazyList`. El código que se escribió en clase está en
[`codigo/`](https://github.com/cardel/notasUniversidad/tree/master/docs/2026-II/PFC/C9/codigo),
y todas las salidas que aparecen abajo salieron de correrlo con Scala 2.13.11.

## Una consulta es un for

El punto de partida fue una comparación con las bases de datos. Una consulta
como esta:

```sql
SELECT nombre FROM Persona p JOIN Responsabilidad r
WHERE p.responsabilidad = r.id AND r.cargo = "Gerente"
```

tiene tres piezas, y una expresión `for` tiene las mismas tres. Los
generadores son el `FROM`, los filtros son el `WHERE` y lo que produce el
`yield` es el `SELECT`.

Sobre un modelo de estudiantes y materias:

```scala
case class Estudiante(cedula: Int, nombre: String, materias: Vector[Materia])
case class Materia(codigo: Int, nombre: String)

def estudiantesPorMateria(
    nombre: String,
    estudiantes: Vector[Estudiante],
    materias: Vector[Materia]
): Vector[String] =
  for {
    e <- estudiantes
    m <- materias
    if m.nombre == nombre
    if e.materias.indexOf(m) != -1
  } yield e.nombre
```

Dos generadores recorren el producto de estudiantes por materias, dos filtros
lo recortan, y el `yield` deja solo el nombre. Con cuatro estudiantes y diez
materias, preguntar por matemáticas devuelve `Vector(Juan, Ana)`.

La segunda consulta agrupa, que es el `GROUP BY`:

```scala
(for {
  e <- estudiantes
  m <- materias
  if e.materias.indexOf(m) != -1
} yield (m.nombre, e.nombre))
  .groupBy(par => par._1)
  .map { case (materia, pares) => (materia, pares.map(_._2).toList) }
  .toVector
```

El `for` produce las parejas y `groupBy` las junta por materia. El listado
queda así:

```
Vector((Matematicas,List(Juan, Ana)), (Geografia,List(Maria)),
       (Programacion,List(Pedro)), (Fisica,List(Juan, Ana)), ...)
```

El orden de ese resultado no es el de escritura, porque `groupBy` devuelve un
`Map` y un `Map` no promete orden.

## Map, y qué pasa cuando la clave no está

Un `Map[Llave, Valor]` asocia claves con valores y además es una función: se
puede aplicar a un argumento. Esa es la parte cómoda y también la peligrosa,
porque aplicar una clave que no existe lanza una excepción.

Scala ofrece dos salidas y en clase se usaron las dos:

```scala
capital.get("COLOMBIA")                        // Some(Bogota)
capital.get("US")                              // None
capital.withDefaultValue("Desconocida")("US")  // Desconocida
```

`get` no devuelve el valor: devuelve un `Option`, que es una envoltura que
representa si hay algo, `Some`, o si no hay nada, `None`. Quien saca el valor
de ahí es `getOrElse`, que recibe qué responder cuando no hay nada. La razón
de que exista `Option` es que en programación funcional no hay un valor nulo
al que recurrir, así que la ausencia se modela con un tipo en lugar de con un
hueco.

## El problema que obliga a la pereza

El segundo primo entre 1000 y 10000. Escrito de la forma directa:

```scala
val primos = (1000 to 10000).filter(esPrimo)
primos(1)   // 1013
```

Da la respuesta, pero para llegar a ella filtró los nueve mil números del
rango. Se calcularon todos los primos para quedarse con uno.

La alternativa es construir la colección por demanda:

```scala
def rangoPerezoso(inicio: Int, fin: Int): LazyList[Int] =
  if (inicio > fin) LazyList.empty
  else inicio #:: rangoPerezoso(inicio + 1, fin)

val primosPerezosos = rangoPerezoso(1000, 10000).filter(esPrimo)
```

Y ahí está lo que se ve en la pantalla y conviene mirar despacio:

```
println(primosPerezosos)       // LazyList(<not computed>)
println(primosPerezosos(1))    // 1013
println(primosPerezosos)       // LazyList(1009, 1013, <not computed>)
```

Antes de pedir nada no hay ni un elemento calculado. Después de pedir el
índice 1 hay exactamente dos, los que hicieron falta para responder, y el
resto sigue sin existir. El operador `#::` es el que construye así: pone una
cabeza concreta y deja la cola sin evaluar.

## Flujos sin final

Si la cola no se evalúa, nada obliga a que la colección termine:

```scala
def naturales(n: Int): LazyList[Int] = n #:: naturales(n + 1)

val nat = naturales(0)
println(nat)        // LazyList(<not computed>)
println(nat(10))    // 10
println(nat)        // LazyList(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, <not computed>)
```

Pedir el índice 10 materializa once elementos y ni uno más. Con evaluación
ansiosa esta definición no terminaría nunca.

## La criba de Eratóstenes

El método es antiguo y la idea es corta: el primer número de la lista es
primo, se eliminan sus múltiplos del resto, y se repite sobre lo que queda.

```scala
def criba(n: Int): LazyList[Int] =
  if (n < 2) LazyList.empty
  else n #:: criba(n + 1).filter(_ % n != 0)

val cri = criba(2)
println(cri)       // LazyList(<not computed>)
println(cri(10))   // 31
println(cri)       // LazyList(2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, <not computed>)
```

El proceso no termina nunca, y por eso solo funciona con pereza: cada llamada
entrega una cabeza y deja pendiente el filtrado del resto, de modo que se
filtra hasta donde el índice pedido obligue.

Cuidado con dos cosas al leer la criba. La primera es qué se descarta en cada
paso: los múltiplos del primo que acaba de salir, no los de todos los números
anteriores. La segunda es que para decidir si un número suelto es primo basta
con buscar divisores hasta su raíz cuadrada, porque si tuviera un divisor
mayor que la raíz, el cociente sería un divisor menor que ya se habría
encontrado.

## El ejercicio de la sesión

Los números que se leen igual al derecho y al revés y que además son primos,
como flujo infinito:

```scala
def esCapicua(n: Int): Boolean = n.toString == n.toString.reverse

val capicuaPrimo: LazyList[Int] =
  enterosDesde(0).filter(esCapicua).filter(esPrimo)
```

Los diez primeros son:

```
List(2, 3, 5, 7, 11, 101, 131, 151, 181, 191)
```

Entre el 11 y el 101 hay noventa enteros seguidos sin un solo acierto, y ahí
se ve para qué sirve el flujo: con un rango fijo habría que adivinar hasta
dónde llegar, y con `1 to 100` salen cinco sin que nada avise que faltan. El
elemento de índice 20 es `10301`, y para encontrarlo el flujo se extendió solo
hasta ahí.

Mirando esa lista aparece algo que vale la pena demostrar: todos tienen una
cantidad impar de dígitos salvo el 11. La razón es que un capicúa de longitud
par es múltiplo de 11. Con cuatro dígitos se ve directo, porque
$\overline{abba} = 1001a + 110b = 11(91a + 10b)$, y en general la suma de las
cifras alternando el signo da cero, que es el criterio de divisibilidad por
11.

## Dónde quedó el curso

En el grupo de la tarde se hizo un repaso de los temas vistos hasta aquí:

1. Programación sin estado, con variables inmutables.
2. Estrategias de evaluación: por valor, por nombre y perezosa.
3. Funciones de alto orden, que reciben funciones o devuelven funciones.
4. `map`, `filter` y `reduce`.
5. Reconocimiento de patrones.
6. Expresiones `for`.
7. Abstracción de datos con tipos propios.

Con esto termina el primer corte. Lo que sigue es concurrencia y paralelismo.

## Dos precisiones

En la sesión se dijo que el siguiente primo no debía ser divisible ni por 1 ni
por 2. El 1 divide a todos los números, así que no sirve para descartar
ninguno: lo que descarta candidatos son los primos que ya salieron, el 2 y el
3 en ese punto de la criba.

También se dijo, sobre la sucesión que divide entre dos los pares y aplica
$3n + 1$ a los impares, que cualquier número termina llegando a uno. Eso se
cumple en todos los casos que se han probado, pero nadie lo ha demostrado: es
la conjetura de Collatz, abierta desde 1937.
