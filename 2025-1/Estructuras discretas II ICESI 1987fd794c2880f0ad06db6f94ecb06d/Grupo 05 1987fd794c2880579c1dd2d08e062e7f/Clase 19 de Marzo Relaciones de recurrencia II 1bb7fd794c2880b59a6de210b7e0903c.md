# Clase 19 de Marzo: Relaciones de recurrencia II

# Material de apoyo

- Relaciones de recurrencia [https://www.youtube.com/watch?v=FzR7O2H7-TI&list=PLi3X2PHYk7zS4e61wu1uir6_nkH2EfiBC&index=25](https://www.youtube.com/watch?v=FzR7O2H7-TI&list=PLi3X2PHYk7zS4e61wu1uir6_nkH2EfiBC&index=25)
- MergeSort [https://www.youtube.com/watch?v=Ec9_hbOQppo&list=PLi3X2PHYk7zS4e61wu1uir6_nkH2EfiBC&index=52](https://www.youtube.com/watch?v=Ec9_hbOQppo&list=PLi3X2PHYk7zS4e61wu1uir6_nkH2EfiBC&index=52)
- Crecimiento de funciones (Notatión Big O, Tetha, Omega) [https://www.youtube.com/watch?v=Keqsnrg3GPo&list=PLi3X2PHYk7zS4e61wu1uir6_nkH2EfiBC&index=23](https://www.youtube.com/watch?v=Keqsnrg3GPo&list=PLi3X2PHYk7zS4e61wu1uir6_nkH2EfiBC&index=23)

# Repaso relaciones de recurrencia homogeneas

[Diapo1_annotated.pdf](Diapo1_annotated.pdf)

```scala
object Ejercicio1 {
  def T(n:Int):Long ={
    if (n==0) 4
    else{
      if (n==1) 12
      else
        6*T(n-1)-9*T(n-2)
    }
  }

  def f(n:Int):Double = {
    4*Math.pow(3,n)
  }

  def main(a:Array[String]):Unit = {
    val l = (1 to 20).toList
    l.foreach(i => println(T(i)+ " "+ f(i)))
  }
}
```

# Relaciones de recurrencia divide y vencerás

[Diapo2_annotated.pdf](Diapo2_annotated.pdf)

```scala
object Ejercicio2 {
  def T(n:Int):Long ={
    if (n==1) 15
    else T(n/2)+1
  }

  def f(n:Int):Double = {
    Math.log(n)/Math.log(2)+15
    
  }

  def main(a:Array[String]):Unit = {
    val l = (1 to 10).toList.map(x => Math.pow(2,x).toInt)
    l.foreach(i => println(T(i)+ " "+ f(i)))
  }
}
```

```scala
object Ejercicio3 {
  def T(n:Int):Long ={
    if (n==1) 2
    else 2*T(n/2)+Math.pow(n,2).toLong
  }

  def f(n:Int):Double = {
    2*Math.pow(n,2)-2*n+2*n
    
  }

  def main(a:Array[String]):Unit = {
    val l = (1 to 10).toList.map(x => Math.pow(2,x).toInt)
    l.foreach(i => println(T(i)+ " "+ f(i)))
  }
}
```