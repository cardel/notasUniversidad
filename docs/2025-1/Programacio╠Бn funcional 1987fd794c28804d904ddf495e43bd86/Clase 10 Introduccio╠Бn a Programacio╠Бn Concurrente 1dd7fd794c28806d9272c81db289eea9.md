# Clase 10: Introducción a Programación Concurrente (PC)

# Recursos

[Ejemplo.zip](Clase%2010%20Introduccio%CC%81n%20a%20Programacio%CC%81n%20Concurrente%201dd7fd794c28806d9272c81db289eea9/Ejemplo.zip)

# Contexto

- **FCFS (First-Come, First-Served):** Los procesos se ejecutan en el orden en que llegan.
    
    *Ejemplo:* Si los procesos llegan en el orden P1, P2, y P3, se ejecutarán en ese mismo orden.
    
- **SJF (Shortest Job First):** Se ejecuta primero el proceso con el menor tiempo de ejecución.
    
    *Ejemplo:* Si P1 tarda 5 unidades de tiempo, P2 tarda 3, y P3 tarda 2, P3 se ejecutará primero, seguido de P2 y luego P1.
    
- **Round Robin (RR):** Cada proceso recibe un tiempo fijo para ejecutarse, conocido como "quantum", y luego se alternan en ciclos.
    
    *Ejemplo:* Con un quantum de 2 unidades de tiempo, P1, P2 y P3 alternan después de ejecutar 2 unidades, continuando hasta que todos terminen.
    
- **Priority Scheduling:** Los procesos se ejecutan según su prioridad, donde los de mayor prioridad se ejecutan primero.
    
    *Ejemplo:* Si P1 tiene prioridad 3, P2 prioridad 1, y P3 prioridad 2, P2 se ejecutará primero, seguido de P3 y luego P1.
    
- **Multilevel Queue:** Los procesos se dividen en diferentes colas según sus características (como interactivos o por lotes), y cada cola tiene su propia política de planificación.
    
    *Ejemplo:* Una cola para procesos interactivos usa Round Robin y otra para procesos por lotes usa FCFS.
    

### Condición de Carrera

Una condición de carrera ocurre cuando múltiples procesos o hilos acceden y manipulan datos compartidos de manera concurrente, y el resultado final depende del orden en que se ejecutan. Esto puede llevar a resultados impredecibles o erróneos si no se controla adecuadamente.

**Ejemplo simple:** Dos hilos intentan incrementar una misma variable compartida `x` que inicialmente tiene el valor 0. Si ambos hilos leen el valor de `x` al mismo tiempo y luego lo incrementan y escriben el resultado, el valor final podría ser 1 en lugar de 2, ya que cada hilo sobrescribe el cambio del otro.

---

### Abrazo Mortal (Deadlock)

Un abrazo mortal ocurre cuando dos o más procesos están bloqueados indefinidamente porque cada uno está esperando que el otro libere un recurso que necesita para continuar.

**Ejemplo simple:** El Proceso A tiene el Recurso 1 y está esperando el Recurso 2, mientras que el Proceso B tiene el Recurso 2 y está esperando el Recurso 1. Ninguno puede avanzar porque ambos están esperando por un recurso que está bloqueado por el otro.

En un lenguaje funcional, las condiciones de carrera no pueden ocurrir durante la paralelización debido a la inmutabilidad de los valores. En programación funcional, los datos son inmutables, lo que significa que una vez que se crea un valor, no puede ser modificado. En lugar de modificar un valor existente, se crea una nueva copia con los cambios necesarios.

Esto elimina los problemas asociados con el acceso concurrente a los datos compartidos, ya que no existen "escrituras" sobre un mismo valor que puedan generar conflictos. Cada proceso o hilo trabaja con su propio conjunto de datos, garantizando que las operaciones sean independientes unas de otras. Como resultado, no importa el orden de ejecución de los procesos, ya que no hay riesgo de que uno sobrescriba o interfiera con el trabajo de otro.

Además, los lenguajes funcionales a menudo emplean estructuras de datos persistentes, que están optimizadas para ser copiadas de manera eficiente y segura. Esto refuerza aún más la seguridad en contextos concurrentes, permitiendo que la paralelización sea predecible y libre de errores típicos como las condiciones de carrera.

# Introducción a la paralelización

- Computación paralela:  Se pueden realizar muchos calculos al mismo tiempo
- Suposición Tenemos hardware paralelo

## Programación concurrente vs paralela

- Programación paralelo: Usar hardware paralelo pensando en la **eficiencia**
- Programación concurrente. Puede o no puede realizar multiples ejecucione, su preocupación es **modularidad, capacidad de respuesta y mantenibilidad**

## Granularidad

- Paralelismo a nivel de bits: CPU
- Paralelismo a nivel de instrucciones. Compilador,este determina que puede ejecutarse de forma paralela
- Paralelismo a nivel de tareas: Son flujos de instrucciones secuenciales

# Concurrencia en la JVM

- Un proceso es un instancia en el sistema operativo, esta aislada en memoria de otros procesos (Word, Intelijj, LOL, etc)
- Un hilo es una unidad de ejecución concurrente y un proceso puede tener uno o más hilos, cada hilo tiene un pila de ejecución pero compartir el mismo espacio de memoria
- Comportamiento de los hilos es **no deterministico** (se pueden ejecutar en cualquier orden)
- Atomocidad: Se necesita asegurar un orden de ejecución para los hilos para garantizar consistencia o determinismo en los resultados de un algoritmo, para esto los lenguajes de programación proveen rutinas **syncronized (se ejecutan todas las hilos sin hacer intercalación)**

## Modelo de memoria

- Conjunto de reglas de como los hilos trabajan la memoria compartida
- Dos hilos que escriben en ubicaciones separadas no necesitan sincronización, si escriben en las mismas ubicaciones si requieren

# Abstracciones

## Parallel

Toma dos expresiones y las calcula en paralelo, posteriormente nos retorna los dos resultados

![image.png](Clase%2010%20Introduccio%CC%81n%20a%20Programacio%CC%81n%20Concurrente%201dd7fd794c28806d9272c81db289eea9/image.png)

La abstracción paralllel:

- Dos procesos (funciones) y nos retorna una tupla de resultados
- Tambien puede recibir 4 procesos
- No tenemos que preocuparnos por su funcionamiento interno
- Los argumentos se pasan por nombre

# Ejemplo parallel

```scala
package taller
import common._

import scala.annotation.tailrec

class SumaLista {

  @tailrec
  final def sumarListaA(l:Array[Int], a:Int, b:Int, acc:Int=0) :Int = {
    if (a > b) acc
    else sumarListaA(l, a+1, b, acc + l(a))
  }

}

@RunWith(classOf[JUnitRunner])
class SumaListaTest extends AnyFunSuiteLike {
  val objSumaLista = new SumaLista()

  test("Suma parcial de los primeros 10 elementos") {
    val expected = 55
    val l = (0 to 100000).toArray
    val current = objSumaLista.sumarListaA(l, 0, 10)
    assert(expected == current)
  }

  test("Suma todos lo snumeros") {
    val expected = 100000 * (100001) / 2
    val l = (0 to 100000).toArray
    val current = objSumaLista.sumarListaA(l, 0, 100000)
    assert(expected == current)
  }

  //Trabajar la paralizacion 2 hilos
  test("Suma con dos hilos") {
    val l = (0 to 100000).toArray
    val mitad = l.length/2
    val (r1,r2) = parallel(
      objSumaLista.sumarListaA(l, 0, mitad),
      objSumaLista.sumarListaA(l, mitad+1, l.length-1)
    )
    val expected = 100000*100001/2
    assert(expected == (r1+r2))
  }

  //Trabajar la paralelizacion en 4 hilos
  test("Paralelizacion 4 hilos") {
    val l = (0 to 100000).toArray
    val expected = 100000*100001/2
    val (r1,r2,r3,r4) = parallel(
      objSumaLista.sumarListaA(l, 0, l.length/4),
      objSumaLista.sumarListaA(l, l.length/4+1, l.length/2),
      objSumaLista.sumarListaA(l, l.length/2+1, 3*l.length/4),
      objSumaLista.sumarListaA(l, 3*l.length/4+1, l.length-1)
    )
    assert(expected == r1+r2+r3+r4)
  }

  //Trabajar la paralelizacion en 9 hilos
  test("Paralelizacion 8 hilos") {
    val l = (0 to 100000).toArray
    val expected = 100000*100001/2
    val (r1,r2,r3,r4) = parallel(
      objSumaLista.sumarListaA(l, 0, l.length/8),
      objSumaLista.sumarListaA(l, l.length/8+1, l.length/4),
      objSumaLista.sumarListaA(l, l.length/4+1, 3*l.length/8),
      objSumaLista.sumarListaA(l, 3*l.length/8+1, l.length/2)
    )
    val (r5,r6,r7,r8) = parallel(
      objSumaLista.sumarListaA(l,  l.length/2+1, 5*l.length/8),
      objSumaLista.sumarListaA(l, 5*l.length/8+1, 6*l.length/8),
      objSumaLista.sumarListaA(l, 6*l.length/8+1, 7*l.length/8),
      objSumaLista.sumarListaA(l, 7*l.length/8+1, l.length-1)
    )
    assert(expected == r1+r2+r3+r4+r5+r6+r7+r8)
  }
}

```

# Task

- Parallel es una abstracción de alto de nivel de task
- Task nos permite a diferente de paralllel lanzar un número arbitrario de tareas
    - task(e1) lanzamos la tarea
    - t1.join() unimos al hilo principal la tarea, es decir esperamos a que termine

```scala
val t1 = task(e1)
val t2 = task(e2)
val v1 = t1.join()
val v2 = t2.join()

/*
Este comportamiento es paralelo
se lanza t1 y t2, y luego se
unen al hilo principal
*/
```

```scala
val t1 = task(e1)
val v1 = t1.join()
val t2 = task(e2)
val v2 = t2.join()

/*
Este comportamiento es secuencial
se lanza t1, se espera que termine
y luego se lanza t2
CUIDADO
*/
```

En general task nos permite tener un mayor control sobre la paralelización a diferencia de paralllel que nos esconde (start y el join)

# Resumen

¡Aquí tienes un resumen de los conceptos clave de la clase de Programación Concurrente!

**Conceptos Fundamentales:**

- Programación paralela enfocada en eficiencia vs. Programación concurrente enfocada en modularidad y mantenibilidad
- Procesos son instancias aisladas del SO, mientras que los hilos comparten memoria dentro de un proceso
- Los hilos tienen comportamiento no determinístico y requieren sincronización cuando comparten recursos

**Herramientas de Paralelización:**

- Parallel: Permite ejecutar dos o cuatro procesos simultáneamente retornando sus resultados
- Task: Ofrece mayor control sobre la paralelización, permitiendo lanzar un número arbitrario de tareas

🔥 ¡Hey, levanta la mirada del TikTok! La programación concurrente es como coordinar un equipo de baile: cada bailarín (hilo) tiene su papel, y cuando todos se mueven en sincronía, ¡crean algo asombroso! Tu código puede ser esa coreografía perfecta. 💻✨