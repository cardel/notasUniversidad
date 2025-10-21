```bash 
git clone git@github.com:cardel/plantilla-funcional.git
 ```
Recomendación dentro de la carpeta

```bash
rm -rf .git
```

Propone un algoritmo para hacer en 2,4 y 6 hilos la paralelización del producto cartesiano

$$
\begin{align}
A = \{a_1,a_2,a_3,\ldots a_n\} \\
B = \{b_1,b_2,b_3,\ldots b_n\} \\
A.B = a_1*b_1+a_2*b_2+a_3*b_3+ \ldots +a_n*b_n
\end{align}
$$

La estrategia

1. Dividir el problema en sus problemas más pequeños
	1. Problema 1: Calculo del vector producto vectorial (elemento por elemento)
	2. Problema 2: Sumar este vector
2. Identificar que se puede paralelizacion, porque no hay dependencias entre valores y las operaciones son asociativas

```scala
package taller
import common._
import scala.util.Random
object App {


 def main(args: Array[String]): Unit = {
  val n = 1000000
  val r = new Random()
  val prod = new ProductoCartesiano()
  val a1 = (1 to n).map(x => r.nextInt(10)).toVector
  val a2 = (1 to n).map(x => r.nextInt(10)).toVector
  //operacion secuencial
  val res = prod.sumaVector(prod.productoVectorial(a1,a2,0,n),0,n)
  println(s"Suma secuencial: $res")
  //Parallel 2 hilos
  val (p1,p2) = parallel(
    prod.productoVectorial(a1,a2,0,n/2),
    prod.productoVectorial(a1,a2,n/2,n)
  )
  val (s1, s2, s3, s4) = parallel(
    prod.sumaVector(p1,0,p1.length/2),
    prod.sumaVector(p1,p1.length/2,p1.length),
    prod.sumaVector(p2,0,p2.length/2),
    prod.sumaVector(p2,p2.length/2,p2.length)
  )
  println(s"Suma parallel 2 hilos: ${s1 + s2 + s3 + s4}")
  
  //Abstraccion task scheduler
  val t1 = task(prod.productoVectorial(a1,a2,0,n/2))
  val t2 = task(prod.productoVectorial(a1,a2,n/2,n))
  val p1b = t1.join()
  val p2b = t2.join()
  val st1 = task(prod.sumaVector(p1b,0,p1b.length/2))
  val st2 = task(prod.sumaVector(p1b,p1b.length/2,p1b.length))
  val st3 = task(prod.sumaVector(p2b,0,p2b.length/2))
  val st4 = task(prod.sumaVector(p2b,p2b.length/2,p2b.length))
  val sumb = st1.join() + st2.join() + st3.join() + st4.join()
  println(s"Suma con task: $sumb")
  } 

}
```