# Clase 10. Principios y abstracciones de la concurrencia

**Jueves 12 de noviembre de 2026, de 7:00 a 10:00 el grupo 50 y de 14:00 a
17:00 el grupo 51, con el mismo contenido en las dos sesiones.**

Hasta aquí el curso trabajó con funciones que, dado el mismo argumento,
devuelven lo mismo siempre. Esta sesión rompe esa garantía: dos hilos que tocan
el mismo dato pueden dar resultados distintos en corridas idénticas. La primera
mitad explica por qué pasa y qué lo contiene; la segunda pasa a las
abstracciones con las que se reparte un cálculo sin caer en eso.

## Un hilo, y qué comparte con los demás

Cada hilo tiene su propia pila, y en ella un marco por llamada activa: si un
hilo está dentro de `f(3)` que llamó a `f(4)`, esos dos marcos son suyos y
ningún otro hilo los ve. Las variables locales viven ahí, y por eso no son el
problema.

Lo que sí se comparte es el montón, donde están los objetos y los arreglos, y
el código. Un contador que dos hilos incrementan, o un arreglo que dos hilos
recorren, es memoria común. La regla práctica sale de ese dibujo: mientras cada
hilo trabaje sobre su pila no hay nada que sincronizar, y el cuidado empieza
donde aparece un dato del montón que más de uno toca.

## El orden en que se intercalan cambia el resultado

Un valor en 2 y dos operaciones sobre él, sumar 3 y multiplicar por 2. Si se
hacen en ese orden el resultado es 10, y si se hacen al revés es 7. Nada de
esto es un error de programación: las dos operaciones son correctas y el
programa no dice en qué orden corren.

Eso es el no determinismo. Con un solo hilo el orden lo fija el programa; con
dos, lo fija el planificador, y puede cambiar entre dos corridas de lo mismo.

## La actualización que se pierde

El caso concreto de la sesión fue un generador de identificadores:

```scala
var uidCount = 0L

def getUniqueId(): Long = {
  val freshUid = uidCount + 1
  uidCount = freshUid
  freshUid
}
```

Con dos hilos, A y B, hay una intercalación que funciona: A lee 0, calcula 1,
lo escribe y devuelve 1; después B lee 1, calcula 2, lo escribe y devuelve 2.
Dos identificadores distintos, que es lo que el nombre promete.

Y hay otra que no. A lee `uidCount` y calcula 1. Antes de que escriba, B lee el
mismo 0 y calcula también 1. Los dos escriben 1 y los dos devuelven 1. Una de
las dos actualizaciones se perdió, y con ella la única propiedad que se le
pedía a la función.

Lo que falla no es el cálculo sino que leer, sumar y escribir sean tres pasos
separados que otro hilo puede partir por la mitad.

## Por qué no basta con pensar en intercalaciones

Entre la memoria y el procesador hay varios niveles de caché. La RAM se mide en
gigabytes y es lenta; las cachés, de L3 a L1, se miden en megabytes y son cada
vez más rápidas y más cercanas al núcleo. Un valor que un hilo escribió puede
quedarse un rato en la caché de su núcleo, de modo que otro hilo lea una copia
vieja aunque la escritura ya haya ocurrido.

Por eso razonar solo sobre el orden de las instrucciones se queda corto: no
basta con que las operaciones ocurran en buen orden, hace falta que lo escrito
sea visible para los demás.

## El cerrojo

La solución de la sesión fue hacer indivisible el bloque que lee y escribe:

```scala
var contador = 0
val cerrojo = new AnyRef
def incrementar(): Unit = cerrojo.synchronized {
  val actual = contador
  contador = actual + 1
}

val h1 = new Thread { override def run() = for (_ <- 1 to 1000) incrementar() }
val h2 = new Thread { override def run() = for (_ <- 1 to 1000) incrementar() }
h1.start(); h2.start(); h1.join(); h2.join()
println(contador)
```

Imprime 2000. Mientras un hilo está dentro del bloque, el otro espera, así que
los tres pasos ocurren juntos y ninguna actualización se pierde. El cerrojo es
un objeto cualquiera, y lo que importa es que los dos hilos usen el mismo.

`join` es lo que hace que la impresión tenga sentido: sin él, el hilo principal
llegaría a `println` antes de que los otros dos terminen.

## Cuánto se gana: speedup

El speedup es el cociente entre el tiempo secuencial y el paralelo. Un speedup
de 1 significa que no se ganó nada, y por debajo de 1 que el reparto costó más
de lo que ahorró.

Con cuatro núcleos uno esperaría 4, y la suma del arreglo medida en clase dio
**2,80**. La diferencia es el precio de repartir y volver a juntar, que no se
paraleliza.

## La abstracción parallel

`parallel` recibe dos expresiones y devuelve sus dos resultados. Lo que decide
si de verdad hay paralelismo está en la firma: los parámetros se reciben por
nombre, de modo que llegan sin evaluar y cada uno se evalúa en su hilo. Con
paso por valor se evaluarían antes de entrar, uno tras otro, y no habría nada
que paralelizar.

Dos consecuencias prácticas. Si las dos tareas son desiguales, el tiempo lo
pone la más lenta, porque hay que esperar a las dos. Y una expresión que llegó
por nombre se evalúa cada vez que se menciona, así que mencionarla dos veces
hace el trabajo dos veces.

## Divide y vencerás con umbral

Repartir un arreglo es partirlo en dos mitades, sumar cada una en paralelo y
juntar los dos resultados. Sobre un arreglo de cien posiciones, el corte deja
0 a 49 y 50 a 99, cada mitad da su resultado parcial y la suma de los dos es el
total.

Partir hasta el final no sirve: crear un hilo cuesta más que sumar dos números.
De ahí el umbral, por debajo del cual el segmento se suma de corrido. La
condición es estricta, y conviene mirar dos casos límite: el segmento que mide
exactamente el umbral todavía se parte, y hay umbrales con los que la recursión
no termina.

## La abstracción task

`task` lanza un cálculo y devuelve algo que se consulta después con `join`.
Dónde se pone el `join` decide si hay paralelismo: con los cuatro `join` al
final las cuatro tareas corren a la vez, y con cada `join` pegado a su `task`
se espera una antes de lanzar la siguiente, que es la versión secuencial
escrita con más palabras.

## Estimar pi con Monte Carlo

El último ejemplo reparte en cuatro tareas y no usa `synchronized` ni una sola
variable mutable compartida. Cada tarea cuenta sus propios aciertos sobre sus
propios datos y al final se suman los cuatro números. Su speedup queda más
cerca del ideal que el de la suma del arreglo, porque el trabajo de cada pedazo
es grande frente al costo de repartir.

Ahí está la moraleja de la sesión. El cerrojo resuelve el problema cuando hay
estado compartido; no tenerlo lo evita de entrada.

## Ejercicios de la segunda mitad

[Ejercicios · PFC C10](./Ejercicios.md){ target=_blank rel=noopener }: nueve
actividades en el orden de la sesión, desde las intercalaciones hasta Monte
Carlo. Los valores finales, los recorridos del árbol de llamadas y los tiempos
salen de correr el mismo código que se escribió en clase.
