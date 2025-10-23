# Ejercicio de Paralelización

## Instrucciones

### Descargar el repositorio plantilla funcional

```bash
git clone git@github.com:cardel/plantilla-funcional.git
```

### Borrar el repositorio de git

```bash
rm -rf .git
```

## Ejercicio: Cálculo de Promedio Ponderado

El **promedio ponderado** va a tomar un arreglo de notas y un arreglo de número de créditos.

### Datos de Ejemplo

$$
\begin{align}
\texttt{notas} = \{4.2, 4.3, 1.2\} \\
\texttt{creditos} = \{4, 3, 2\}
\end{align}
$$

### Proceso de Cálculo

**Primero sacar los intermedios:**

$$
\texttt{intermedio} = \{4.2 \times 4, 4.3 \times 3, 1.2 \times 2\}
$$

**Sumamos los créditos:**

$$
\texttt{sumcreditos} = 4 + 3 + 2 = 9
$$

**Sumamos los intermedios:**

$$
\texttt{sumintermedio} = 4.2 \times 4 + 4.3 \times 3 + 1.2 \times 2 = 32.1
$$

**Finalmente el promedio ponderado:**

$$
\frac{\texttt{sumintermedio}}{\texttt{sumcreditos}} = \frac{32.1}{9} = 3.56667
$$

# Ejercicio de Paralelización: Promedio Ponderado

## Solución Implementada

### Clase Ponderado

```scala
class Ponderado {
    def poderacion(notas: Array[Double], creditos: Array[Int], ini: Int, fin: Int): Double = {
        (ini until fin).map(i => notas(i) * creditos(i)).sum
    }
    
    def sumaCreditos(creditos: Array[Int], ini: Int, fin: Int): Int = {
        (ini until fin).map(i => creditos(i)).sum
    }
}
```

### Clase Principal

```scala
import scala.util.Random
import common._

object App {
    def main(args: Array[String]): Unit = {
        val objPonderado = new Ponderado()
        val n = 10000000
        val r = new Random()
        
        // Generación de datos de prueba
        val arrayNotas = (1 to n).map(x => r.nextDouble() * 5).toArray
        val arrayCreditos = (1 to n).map(x => r.nextInt(5) + 1).toArray
        
        // Versión Secuencial
        val res = objPonderado.poderacion(arrayNotas, arrayCreditos, 0, n) / 
                  objPonderado.sumaCreditos(arrayCreditos, 0, n)
        println(s"El ponderado secuencial es: $res")

        // Paralelización con Parallel (2 hilos)
        val (pond1, pond2) = parallel(
            objPonderado.poderacion(arrayNotas, arrayCreditos, 0, n/2), 
            objPonderado.poderacion(arrayNotas, arrayCreditos, n/2, n)
        )
        val (suma1, suma2) = parallel(
            objPonderado.sumaCreditos(arrayCreditos, 0, n/2), 
            objPonderado.sumaCreditos(arrayCreditos, n/2, n)
        )
        println(s"El ponderado paralelo es: ${(pond1 + pond2) / (suma1 + suma2)}")
        
        // Paralelización con Task (4 hilos)
        val t1 = task(objPonderado.poderacion(arrayNotas, arrayCreditos, 0, n/2))
        val t2 = task(objPonderado.poderacion(arrayNotas, arrayCreditos, n/2, n))
        val t3 = task(objPonderado.sumaCreditos(arrayCreditos, 0, n/2))
        val t4 = task(objPonderado.sumaCreditos(arrayCreditos, n/2, n))
        
        val pond3 = t1.join()
        val pond4 = t2.join()
        val suma3 = t3.join()
        val suma4 = t4.join()
        
        println(s"El ponderado paralelo con task es: ${(pond3 + pond4) / (suma3 + suma4)}")
    }
}
```

## Tabla de Resumen

| Componente | Descripción | Implementación | Paralelización |
|------------|-------------|----------------|----------------|
| **Clase Ponderado** | Contiene métodos para cálculo ponderado | `poderacion()` y `sumaCreditos()` | - |
| **Generación de Datos** | Crea arrays de prueba grandes | `n = 10,000,000` elementos | - |
| **Versión Secuencial** | Cálculo en un solo hilo | Llamadas directas a métodos | Sin paralelismo |
| **Parallel (2 hilos)** | Uso de abstracción parallel | Divide trabajo en 2 partes | 2 hilos por operación |
| **Task (4 hilos)** | Uso de abstracción task | Control granular de hilos | 4 hilos total |
| **Partición de Datos** | División del array para procesamiento | Rangos `[0, n/2)` y `[n/2, n)` | Balance de carga |

## Características de la Solución

1. **Escalabilidad**: Maneja grandes volúmenes de datos (10 millones de elementos)
2. **Múltiples Estrategias**: Implementa secuencial, parallel y task
3. **Balance de Carga**: División equitativa del trabajo entre hilos
4. **Verificación**: Comparación de resultados entre diferentes implementaciones

## Ventajas de la Paralelización

- **Aceleración**: Procesamiento simultáneo de diferentes segmentos
- **Eficiencia**: Mejor uso de recursos en sistemas multinúcleo
- **Flexibilidad**: Diferentes niveles de granularidad con parallel vs task