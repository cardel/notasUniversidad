Paralelismo de tareas consiste en como se distribuyen los procesos en los hilos

Hacer un almuerzo
	- Cocinar la sopa
	- Cocinar la carne
	- Cocinar el arroz
Todo esto lo puedo hacer al tiempo.

Ahora vamos a trabajar la paralelización de datos, la diferencia es por ejemplo cocinar arroz para muchas personas.

Para esto vamos a utilizar las colecciones paralelas, estas naturalmente permiten dividir en hilos el calculo de un proceso, debe tener en cuenta cuenta que no puede hacer dependencias y la operación debe ser asociativa

Para esto vamos a utilizar la libreria de parallel collection de Scala, en el Gradle se debe importar esta librería:

```groovy
    implementation group: 'org.scala-lang.modules', name: 'scala-parallel-collections_2.13', version: '1.0.4'

```

Para usarla necesitamos importar la siguiente linea

```scala
import scala.collection.parallel.CollectionConverters._
```

Esto nos permite usar las colecciones paralelas.

```scala
  def paralelo():Unit = {
    var arrSeq = (1 to 1000000).toArray
    val t1 = withWarmer(new Warmer.Default) measure {
    
      val sumaSeq = arrSeq.reduce((x,y) => x + y)
    }
    val arr = (1 to 1000000).toArray.par
    val t2 = withWarmer(new Warmer.Default) measure {
  
      val suma = arr.reduce((x,y) => x + y)
    }
    println(s"Tiempo secuencial: $t1")
    println(s"Tiempo paralelo: $t2")
  }
```

Los resultados son:

```
Tiempo secuencial: 5.262293 ms
Tiempo paralelo: 2.237507 ms
```

No todas la operaciones en paralelo (de datos)  no dan los mejores resultados, en el caso de map y scan se observa

```scala
    val t3 = withWarmer (new Warmer.Default) measure {
      arrSeq = arrSeq.map(x => x + 1)
    }
    val t4 = withWarmer (new Warmer.Default) measure {
      val arrPar = arr.map(x => x + 1)
    }

    val t5 = withWarmer (new Warmer.Default) measure {
      arrSeq = arrSeq.scan(0)((acc,x) => acc + x)
    }

    val t6 = withWarmer (new Warmer.Default) measure {
      val arrPar = arr.scan(0)((acc,x) => acc + x)
    }
    println(s"Tiempo map secuencial: $t3")
    println(s"Tiempo map paralelo: $t4")
    println(s"Tiempo scan secuencial: $t5")
    println(s"Tiempo scan paralelo: $t6")
 
```

Obtenemos

```bash
Tiempo map secuencial: 28.33166 ms
Tiempo map paralelo: 83.826413 ms
Tiempo scan secuencial: 84.885203 ms
Tiempo scan paralelo: 90.86937 ms
```

En este caso para el map y el scan la paralelización de datos no es la mejor opción, a comparación de la paralelización de tareas.