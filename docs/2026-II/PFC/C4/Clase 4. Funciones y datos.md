# Clase 4. Funciones y datos

Jueves 1 de octubre de 2026.

Hasta ahora lo que se abstraía era el cálculo: una función que recibe otra
función y deja huecos donde algo cambia. Esta sesión abstrae el otro lado, el
dato. Una fecha son tres enteros —día, mes y año—, y aun así nadie piensa en
tres enteros: piensa en una fecha. Eso es lo que se arma aquí, con los
racionales en la mañana y con los vectores en la tarde.

Las diapositivas están en el Campus Virtual. Aquí quedan las notas de lo que se
dijo en el salón y el código que se escribió en vivo, en
[`codigo/`](https://github.com/cardel/notasUniversidad/tree/master/docs/2026-II/PFC/C4/codigo).
Los ocho ejercicios interactivos de la sesión están en
[Ejercicios](./Ejercicios.md).

Referencia: Odersky, Spoon y Venners, *Programming in Scala*, 3.ª edición,
capítulos 4, 6 y 10.

## El problema que abrió la clase

Un racional es `a/b` con `a` y `b` enteros y `b` distinto de cero. Con los
tipos que ya hay, el intento natural es un `Double`:

```scala
val a: Double = 1 / 3.0
val b: Double = 1 / 9.0
println(a + b)
println(4 / 9.0)
```

```
0.4444444444444444
0.4444444444444444
```

Los dos coinciden, y aun así el `Double` no guarda un tercio: guarda la
aproximación que cabe en 64 bits. Entre 0 y 1 hay infinitos reales y los bits
son finitos, así que lo que se almacena es lo más cercano representable. Que
estas dos sumas coincidan es suerte del redondeo, no exactitud; basta correr
otro caso para verlo:

```
0.1 + 0.2        0.30000000000000004
(0.1 + 0.2) == 0.3        false
```

De ahí sale el encargo: si el racional se guarda como **dos enteros**, la
aritmética vuelve a ser exacta. Y dos enteros sueltos no bastan: hay que
poder tratarlos como una sola cosa.

En la tarde el mismo problema con vectores de dos dimensiones, escritos sin
abstracción:

```scala
val x1: Int = 1;  val y1: Int = 10
val x2: Int = 12; val y2: Int = 10
val x3: Int = x1 + x2
val y3: Int = y1 + y2
```

```
v1 1,10
v2 12,10
v3 13,20
```

Funciona, y con tres vectores ya son seis nombres. La pregunta que cerró el
tramo fue qué pasa cuando hay muchos: la respuesta es que el programa se llena
de variables que solo existen porque el dato no tiene nombre propio.

## La clase y su constructor

En Scala el constructor va en la declaración de la clase: los parámetros se
escriben al lado del nombre.

```scala
class Racional(a: Int, b: Int) {
  val num = a
  val den = b
}
```

El nombre `Vector` no se puede usar para la clase de la tarde, porque ya existe
en la librería de Scala; por eso quedó `Vectores`.

La primera corrida, antes de tocar nada más, no imprime lo que se espera:

```
Vectores@4f3f5b24
```

Eso viene del `toString` que toda clase hereda, y que muestra el nombre de la
clase y una referencia. Para que el objeto se imprima como lo que es hay que
sobreescribirlo:

```scala
override def toString(): String = this.num + "/" + this.den
```

En vectores, `"(" + this.x + "," + this.y + ")"`.

## Normalizar dentro del constructor

La suma de `1/3` y `1/9` da `12/27`, que es correcto y está sin reducir. Para
reducirlo hace falta el máximo común divisor, con el algoritmo de Euclides por
residuos:

```scala
private def mcd(a: Int, b: Int): Int = {
  if (b == 0) a
  else mcd(b, a % b)
}
```

Para `mcd(12, 27)`:

```
12 mod 27 = 12
27 mod 12 = 3
12 mod  3 = 0   ->  el mcd es 3
```

y `12/27` queda en `4/9`. El mcd se calcula al construir, de modo que ningún
racional existe sin reducir:

```scala
val num = a / mcd(a, b)
val den = b / mcd(a, b)
```

En la tarde se aplicó la misma idea al vector, dividiendo por la norma:

```scala
val x = a / norma(a, b)
val y = b / norma(a, b)

private def norma(x: Double, y: Double): Double = Math.sqrt(x * x + y * y)
```

Aquí la analogía se rompe, y vale la pena ver dónde. Dividir por el máximo
común divisor **no cambia el número**: `12/27` y `4/9` son el mismo racional.
Dividir por la norma **sí cambia el vector**: lo deja de longitud uno. Por eso
`new Vectores(2, 3)` no guarda `(2, 3)`:

```
(0.5547001962252291,0.8320502943378437)
```

y la suma de dos vectores ya normalizados se vuelve a normalizar al
construirse, así que tampoco es la suma de las coordenadas originales. Sin la
norma, `a.suma(b)` con `(2,3)` y `(4,5)` daría `(6,8)`, que es lo que se vio
antes de agregarla.

## Encapsulación

`mcd` y `norma` van `private`. Son cuentas internas: existen para que el
constructor deje el dato en forma, y nadie fuera de la clase tiene por qué
llamarlas ni depender de ellas. Lo que queda público es lo que el dato ofrece.

## Las operaciones devuelven objetos nuevos

```scala
def suma(r: Racional): Racional = {
  new Racional(this.num * r.den + this.den * r.num,
    this.den * r.den)
}
```

Ninguna operación modifica el receptor: cada una construye un racional nuevo.

```
r1.suma(r2)            4/9
r1.resta(r2)           2/9
r1.multiplicacion(r2)  1/27
```

con `r1 = 1/3` y `r2 = 1/9`. Un tercio son tres novenos, así que la resta deja
dos novenos; y un tercio por un noveno, uno sobre veintisiete.

## El argumento implícito

`suma` recibe un parámetro y, sin embargo, trabaja con dos racionales. El
segundo entra sin escribirse: es `this`, el objeto sobre el que se llamó el
método. La firma, puesta por completo, sería:

```scala
def suma(this: Racional, r: Racional): Racional
```

`this` es la instancia; el área de memoria con los campos de este objeto. Todo
método dentro de una clase lo recibe, aunque no aparezca, y por eso cuando el
cuerpo nombra `num` sin calificar, el compilador lee `this.num`:

```scala
def obtenerX() = x        // lo que se escribe
def obtenerX() = this.x   // lo que se compila
```

En Python ese argumento se escribe:

```python
class Ejemplo:
    def __init__(self, x, y):
        self.x = x
        self.y = y
```

`self` es el mismo puntero, con nombre por convención y puesto a mano. Un
método que lo omite no alcanza el objeto, y llamarlo falla con un error de
cantidad de argumentos. Scala y Java lo ponen solos; Python, no. Es una
decisión de cada lenguaje, no una diferencia de fondo.

## Notación infija

Cuando un método recibe un solo parámetro se puede escribir sin punto y sin
paréntesis:

```scala
r1.suma(r2)     // con punto
r1 suma r2      // infija
```

Las dos formas son la misma llamada. El operador puede ir delante de los
operandos (prefija), en medio (infija) o detrás (posfija); la aritmética que
todos leemos es infija, y eso es lo que Scala permite recuperar.

## Operadores como métodos

Si `suma` se puede escribir en el medio, el paso siguiente es llamarla por el
símbolo que ya le corresponde:

```scala
def +(r: Racional): Racional = this.suma(r)
def -(r: Racional): Racional = this.resta(r)
def *(r: Racional): Racional = this.multiplicacion(r)
```

```
r1 + r2    4/9
r1 - r2    2/9
r1 * r2    1/27
```

Los mismos números que antes. `+` no es sintaxis privilegiada: es un nombre de
método. Scala admite dos clases de identificador. Los alfanuméricos empiezan
con letra y siguen con letras o dígitos, como `suma` o `x1`. Los simbólicos
están hechos de símbolos de operador: `+`, `++`, `:::`.

La precedencia la fija el primer carácter del símbolo, no el orden en que se
lee la línea. Con los vectores:

```
a * b + c    (0.5317491236059955,0.846901924395178)
c + a * b    (0.5317491236059955,0.846901924395178)
(c + a) * b  (0.4877808772051354,0.8729661023390247)
```

Las dos primeras coinciden porque `*` se agrupa antes que `+` en los dos
sentidos. La tercera, con los paréntesis puestos a mano, da otra cosa: ahí se
ve que la agrupación de las dos primeras no era casualidad.

## Precondiciones

Un racional con denominador cero no es un racional. Mientras la clase no diga
nada, `new Racional(1, 0)` se construye sin protestar y luego no sirve para
nada. La condición se declara en el constructor:

```scala
require(b > 0, "El denominador debe ser positivo")
```

```
java.lang.IllegalArgumentException: requirement failed: El denominador debe ser positivo
```

La condición es `b > 0` y no `b != 0` a propósito: con denominadores negativos
habría que decidir dónde vive el signo y arrastrar esa decisión por todas las
operaciones. Exigir el denominador positivo quita el problema de encima.

`require` y `assert` no son lo mismo: `require` es una condición sobre los
argumentos y **impide que el objeto se construya**; `assert` comprueba algo que
debería cumplirse y falla cuando el objeto ya existe.

## Modelo de sustitución con clases

Las reglas de evaluación de las sesiones anteriores siguen sirviendo, con un
reemplazo más. Para una clase

```
class C(x1, ..., xm) { ... def f(y1, ..., yn) = b ... }
```

evaluar `new C(v1, ..., vm).f(w1, ..., wn)` consiste en reemplazar, dentro del
cuerpo `b`, cada parámetro de la clase `xi` por su valor `vi`, cada parámetro
del método `yi` por su argumento `wi`, y `this` por el objeto receptor,
`new C(v1, ..., vm)`.

## El ejercicio de la sesión

Números complejos con sus operadores. La parte que dejó enseñanza fue la
depuración contra las pruebas, que falló varias veces por motivos distintos:

- **El redondeo a tres decimales.** Multiplicar por mil, redondear a entero y
  dividir por mil: `Math.round(n * 1000) / 1000.0`.
- **La división.** La parte imaginaria es `(a2·b1 − a1·b2) / (a2² + b2²)`, y
  estaba escrita con el producto cambiado. Se encontró contrastando el código
  con la fórmula del enunciado, no mirando el código solo.
- **La prueba de precedencia.** Comprueba que `1 + 2 * 3` sobre complejos se
  agrupe como en los enteros. Falló, y la sospecha fue que Scala no estaba
  aplicando la precedencia. No era eso: la suma tenía un `*` donde iba un `+`.
  La precedencia no se programa; el compilador la aplica por el nombre del
  operador, y lo que estaba mal era la implementación.

Para aislar el problema se quitó el redondeo a propósito: con menos cosas
encima, se ve cuál prueba falla por cuál motivo.

## Lo que queda

En seis puntos, que es como cerró la sesión:

1. Datos compuestos, con nombre propio: un objeto.
2. Las operaciones quedan currificadas, con un parámetro explícito y `this`.
3. `toString` se sobreescribe para que el dato se lea.
4. Las operaciones se pueden escribir en notación infija: `a.+(b)` es `a + b`.
5. Las precondiciones se declaran con `require` y `assert`.
6. El dato compuesto evita arrastrar variables sueltas: `num` y `den` viven
   dentro del racional, `x` e `y` dentro del punto.

El **Taller 2 se entrega el 21 de octubre**.

Lo que sigue: qué pasa cuando varios datos comparten operaciones, que es
herencia, clases abstractas y traits; y cómo se descompone un dato según su
forma, que es el reconocimiento de patrones.
