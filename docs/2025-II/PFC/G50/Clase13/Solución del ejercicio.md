
![](attachments/Pasted%20image%2020251111080911.png)

```scala
import common._

object Promedio {

  def promedioMovil(v:Vector[Int], ini:Int, fin:Int, k:Int):Vector[Double] = {
    ((ini to fin).map(i => (0 until k).foldLeft(0.0)((acc,j) => acc + v(i+j)/k.toDouble))).toVector
  }

  def main(arr:Array[String]) : Unit = {
    val n = 1000000
    val vec = (1 to n).toVector
    val vecChiqui = Vector(2,4,6,8,10,12)
    val m:Int = (6-3)/2
    val k = 3
    println(promedioMovil(vecChiqui,0,3,k)) 
    val (r1,r2) = parallel (
      promedioMovil(vecChiqui,0,m,k),
      promedioMovil(vecChiqui,m+1,6-3,k)
    )
    println(r1 ++ r2)
    val res1 = promedioMovil(vec,0,n-k,k)
    println(res1.take(10) ++ res1.drop(n-k-10))
    val m2 = (n-k)/2
    val (r3,r4) = parallel (
      promedioMovil(vec,0,m2,k),
      promedioMovil(vec,m2+1,n-k,k)
    )
    val res2 = r3 ++ r4
    println(res2.take(10)++ res2.drop(n-k-10))
    
  }

}
```

Mi enfoque de solución, es tomar el indice inicial y hacer al partición sobre el, sabiendo que necesito siempre una ventana de tamaño $k$.

Inicial = 0
final: n - k

Se que internamente debo siempre recorrer k elementos.