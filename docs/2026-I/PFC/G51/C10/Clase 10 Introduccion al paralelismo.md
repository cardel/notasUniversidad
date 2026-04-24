
# Motivación

Aprovechando el hecho que tenemos multiples procesadores podemos correr tareas al mismo tiempo, para esto tenemos la posibilidad e utilizar Thread

```scala
scala> var contador = 0
     | def incrementar(): Unit = {
     | val actual = contador
     | contador = actual + 1
     | }
     | val h1 = new Thread { override def run() =
     | for (_ <- 1 to 1000) incrementar() }
     | val h2 = new Thread { override def run() =
     | for (_ <- 1 to 1000) incrementar() }
     | h1.start(); h2.start(); h1.join(); h2.join()
     | println(contador)
1574
var contador: Int = 1574
def incrementar(): Unit
val h1: Thread = Thread[Thread-6,5,]
val h2: Thread = Thread[Thread-7,5,]

scala> var contador = 0
     | def incrementar(): Unit = {
     | val actual = contador
     | contador = actual + 1
     | }
     | val h1 = new Thread { override def run() =
     | for (_ <- 1 to 1000) incrementar() }
     | val h2 = new Thread { override def run() =
     | for (_ <- 1 to 1000) incrementar() }
     | h1.start(); h2.start(); h1.join(); h2.join()
     | println(contador)
1691
var contador: Int = 1691
def incrementar(): Unit
val h1: Thread = Thread[Thread-8,5,]
val h2: Thread = Thread[Thread-9,5,]

scala> var contador = 0
     | def incrementar(): Unit = {
     | val actual = contador
     | contador = actual + 1
     | }
     | val h1 = new Thread { override def run() =
     | for (_ <- 1 to 1000) incrementar() }
     | val h2 = new Thread { override def run() =
     | for (_ <- 1 to 1000) incrementar() }
     | h1.start(); h2.start(); h1.join(); h2.join()
     | println(contador)
1842
var contador: Int = 1842
def incrementar(): Unit
val h1: Thread = Thread[Thread-10,5,]
val h2: Thread = Thread[Thread-11,5,]
```

Ocurre cuando un corro un codigo que se supone que da 2000, pero da valores distintos

Esto se debe a que como incrementar corre al tiempo en ambos hilos, es posible que cuando uno se ejecutando el otro este en el momento del cambio de la variable y no se lea este cambio (se pierde) esto ocurre de forma aleatoria


# Temas.

1. [Paralelismo y concurrencia](Paralelismo%20y%20concurrencia.md)
2. [Aspectos de la paralelizacion](Aspectos%20de%20la%20paralelizacion.md)
3. [Parallel y Task](Parallel%20y%20Task.md)