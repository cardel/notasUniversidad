# Paralelismo de datos

Hasta ahora hemos visto paralelismo de tareas. Por ejemplo, en un restaurante necesitamos preparar:

1. Sopa
2. Arroz  
3. Carne

Cada uno de estos se puede preparar de forma independiente (separada) y luego se juntan para producir el resultado.

El **paralelismo de datos** es análogo a preparar arroz para muchas personas. La idea es aplicar una operación sobre una colección de datos de forma paralela.

## Concepto teórico: Paralelismo de datos vs paralelismo de tareas

- **Paralelismo de tareas**: Diferentes tareas se ejecutan simultáneamente sobre diferentes datos
- **Paralelismo de datos**: La misma operación se aplica simultáneamente sobre diferentes partes de los datos

# Colecciones paralelizables

Scala incluye un conjunto de colecciones paralelizables, las cuales ejecutan sus operaciones automáticamente de forma paralela.

Para poder utilizarlas debemos agregar la librería scala parallel collections al archivo de especificación. En el caso de Gradle, agregamos a las dependencias del archivo `gradle.build` lo siguiente:

```groovy
implementation group: 'org.scala-lang.modules', name: 'scala-parallel-collections_2.13', version: '1.0.4'
```

Y en los archivos de código debemos agregar:

```scala
import scala.collection.parallel.CollectionConverters._
```

Esto nos permite usar `.par` en las colecciones, por ejemplo:

```scala
def main(a:Array[String]):Unit = {
    val n = 10000000
    // Medición del tiempo para operación secuencial
    val t1 = withWarmer (new Warmer.Default) measure {
      (1 to n).reduce (_ + _)
    }
    // Medición del tiempo para operación paralela
    val t2 = withWarmer (new Warmer.Default) measure {
      (1 to n).par.reduce (_ + _)
    }
    println (s"Tiempo secuencial: $t1")
    println (s"Tiempo paralelo: $t2")
    println (s"Aceleración ${t1.value/t2.value}")
  }
```

Nos da como resultado:

```bash
Tiempo secuencial: 58.434045 ms
Tiempo paralelo: 24.936211 ms
Aceleración 2.343340975098422
```

Observemos que tuvimos una aceleración de 2.34.

En otros casos:

```scala
def main(a:Array[String]):Unit = {
    val n = 10000000
    
    // Prueba de reducción
    val t1 = withWarmer (new Warmer.Default) measure {
      (1 to n).reduce (_ + _)
    }
    val t2 = withWarmer (new Warmer.Default) measure {
      (1 to n).par.reduce (_ + _)
    }
    println (s"Tiempo secuencial reducción: $t1")
    println (s"Tiempo paralelo reducción: $t2")
    println (s"Aceleración reduccion ${t1.value/t2.value}")

    // Prueba de map
    val t3 = withWarmer (new Warmer.Default) measure {
      (1 to n).map (_ + 1)
    }
    val t4 = withWarmer (new Warmer.Default) measure {
      (1 to n).par.map (_ + 1)
    }
    println (s"Tiempo secuencial map: $t3")
    println (s"Tiempo paralelo map: $t4")
    println (s"Aceleración map ${t3.value/t4.value}")
    
    // Prueba de filter
    val t5 = withWarmer (new Warmer.Default) measure {
      ( 1 to n).filter (_ % 2 == 0)
    }
    val t6 = withWarmer (new Warmer.Default) measure {
      ( 1 to n).par.filter (_ % 2 == 0)
    }
    println (s"Tiempo secuencial filter: $t5")
    println (s"Tiempo paralelo filter: $t6")
    println (s"Aceleración filter ${t5.value/t6.value}")

    // Prueba de scan
    val t7 = withWarmer (new Warmer.Default) measure {
      (1 to n).scan (0)(_ + _)
    }
    val t8 = withWarmer (new Warmer.Default) measure {
      (1 to n).par.scan (0)(_ + _)
    }
    println (s"Tiempo secuencial scan: $t7")
    println (s"Tiempo paralelo scan: $t8")
    println (s"Aceleración scan ${t7.value/t8.value}")
  }
```

Los resultados son:

```bash
Tiempo secuencial reducción: 72.645867 ms
Tiempo paralelo reducción: 25.281309 ms
Aceleración reduccion 2.8735010121509132
Tiempo secuencial map: 88.300568 ms
Tiempo paralelo map: 154.237561 ms
Aceleración map 0.5724971753151621
Tiempo secuencial filter: 38.268286 ms
Tiempo paralelo filter: 38.104865 ms
Aceleración filter 1.0042887174642925
Tiempo secuencial scan: 105.709297 ms
Tiempo paralelo scan: 220.66437 ms
Aceleración scan 0.4790501384523474
```

## Análisis de resultados

La paralelización de datos no funciona bien cuando tiene que crear resultados con operaciones como `map`, `filter` o `scan` que generan colecciones del mismo tamaño de la original. Esto se debe a que hacer el join de muchos hilos (generarlos también) genera latencia debido a que el administrador de hilos del lenguaje debe gestionar muchos hilos al tiempo, lo que agrega latencia.

## Factores que afectan el rendimiento del paralelismo de datos

- **Overhead de sincronización**: La coordinación entre hilos consume tiempo
- **Granularidad de las tareas**: Si las tareas son muy pequeñas, el overhead domina
- **Operaciones que generan colecciones**: `map`, `filter`, `scan` crean nuevas colecciones completas
- **Operaciones de reducción**: Funcionan mejor porque combinan resultados parciales