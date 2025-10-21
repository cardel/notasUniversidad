# Paralelismo en JVM

En la JVM existen rutinas que permiten ejecutar paralelismo a nivel nativo en Java. Scala utiliza estas funciones y características para ofrecer capacidades de paralelización.

## Proceso

Un **proceso** es una instancia de un programa que se está ejecutando en el sistema operativo. Este proceso puede contener internamente tareas paralelas (hilos). La gestión de los procesos es realizada directamente por el kernel del sistema operativo utilizando algoritmos de planificación como **LIFO**, **FIFO**, **Round Robin**, entre otros. Los procesos en memoria están **aislados**, lo que significa que no se permite que dos procesos accedan a la misma sección de memoria.

## Hilo

- Un proceso puede contener uno o más **hilos**
- Existe un **hilo de ejecución principal** sobre el cual se lanzan los hilos de tareas paralelas (utilizando métodos como `start` y `join`)
- Cada hilo tiene su propia **pila de ejecución**
- Los hilos no pueden modificar la pila de otros hilos, manteniéndose **aislados** o **encapsulados**

## Modelo de ejecución en JVM

1. Siempre existe un hilo denominado **hilo principal**
2. La clase **Thread** se encarga de lanzar nuevos hilos mediante el método `run`, y se inician con `start()`
3. Cuando un hilo debe detenerse, se utiliza el método `join()`, que retorna la ejecución al hilo principal
4. Cada hilo se ejecuta **secuencialmente**
5. Cuando hay más de dos hilos, el **orden de ejecución es aleatorio**
   - Se debe tener cuidado con operaciones no conmutativas
   - Es necesario verificar si las operaciones son **paralelizables**, es decir, si pueden realizarse en orden diferente sin afectar el resultado
   - Cuando se requiere garantizar un orden específico en la paralelización, se debe implementar **sincronización** (como `synchronized` en JavaScript)
   - Los hilos no tienen comportamiento **determinístico** ya que se lanzan aleatoriamente y los resultados se recogen según su finalización

## Atomicidad

En ocasiones es necesario asegurar que una secuencia de instrucciones dentro de un hilo se ejecute en un orden específico, sin **intercalación** (ejecución aleatoria).

Para el código:

```scala
def thread(body: => Unit): Thread = {
  val t = new Thread {
    override def run() = body
  }
  t.start()
  t
}

var cnt = 0
def getCnt(): Int = {
  val v = cnt + 1
  Thread.sleep(1000)
  cnt = v
  v
}
```

Se pretende generar un identificador único a partir de la variable `cnt`. Cuando varios hilos ejecutan `getCnt()`, el problema surge porque toman el valor antes de que se modifique, resultando en identificadores repetidos.

```scala
scala> (thread(getCnt()), thread(getCnt()), thread(getCnt()))
val res41: (Thread, Thread, Thread) = (Thread[Thread-18,5,main], Thread[Thread-19,5,main], Thread[Thread-20,5,main])

scala> cnt
val res42: Int = 1
```

Se ejecuta `getCnt()` tres veces, pero todas ven el valor de `cnt = 0`, por lo que todas retornan 1. Para solucionar esto, se necesita que los hilos se ejecuten en orden:

```scala
scala> def getCnt(): Int = synchronized {
  val v = cnt + 1
  Thread.sleep(1000)
  cnt = v
  v
}
```

Para este objetivo se utiliza la directiva **synchronized**, que permite establecer un orden en la ejecución de los hilos:

```scala
scala> (thread(getCnt()), thread(getCnt()), thread(getCnt()))
val res43: (Thread, Thread, Thread) = (Thread[Thread-21,5,main], Thread[Thread-22,5,main], Thread[Thread-23,5,main])

scala> cnt
val res44: Int = 3
```

Con esto, los hilos se ejecutan en orden: el primer hilo cambia `cnt` a 1, el segundo a 2 y el tercero a 3.

## Modelo de memoria de los hilos

1. Dos hilos se ejecutan en **ubicaciones separadas de memoria**
2. Una vez que un hilo hace `join` sobre otro, se puede observar lo que escribió

En programación, generalmente se utilizarán los hilos y las directivas de **synchronized** para asegurar **determinismo**.