# Clase 19 de Marzo Relaciones de recurrencia II

# Material de apoyo

- Relaciones de recurrencia [https://www.youtube.com/watch?v=FzR7O2H7-TI&list=PLi3X2PHYk7zS4e61wu1uir6_nkH2EfiBC&index=25](https://www.youtube.com/watch?v=FzR7O2H7-TI&list=PLi3X2PHYk7zS4e61wu1uir6_nkH2EfiBC&index=25)
- MergeSort [https://www.youtube.com/watch?v=Ec9_hbOQppo&list=PLi3X2PHYk7zS4e61wu1uir6_nkH2EfiBC&index=52](https://www.youtube.com/watch?v=Ec9_hbOQppo&list=PLi3X2PHYk7zS4e61wu1uir6_nkH2EfiBC&index=52)
- Crecimiento de funciones (Notatión Big O, Tetha, Omega) [https://www.youtube.com/watch?v=Keqsnrg3GPo&list=PLi3X2PHYk7zS4e61wu1uir6_nkH2EfiBC&index=23](https://www.youtube.com/watch?v=Keqsnrg3GPo&list=PLi3X2PHYk7zS4e61wu1uir6_nkH2EfiBC&index=23)

# Solución de relaciones de recurrencia homogeneas

Metodo

1. Supongo que la solución es r^n 
2. Encuentro la ecuación caracteristica
3. La solución tiene la forma de constantes multiplicadas por las raices elevadas a la n (Ecuación general)
4. Uso las condiciones las condiciones iniciales para calcular las constantes (Solución total/general)

```scala
object Ejercicio1 {
  def T(n:Int):Long = {
    if (n==0) 5
    else {
      if (n==1) 7
      else 5*T(n-1)+6*T(n-2)
    }
  }

  def f(n:Int):Double = {
    (12/7.0)* Math.pow(6,n) + (23/7.0)* Math.pow(-1,n)
}

  def main(a:Array[String]):Unit = {
    val l = (0 to 20).toList
    for (i <- l) {
      println("T("+i+") = " + T(i))
      println("f("+i+") = " + f(i))
    }
  }
}
```

```scala
object Ejercicio2 {
  def T(n:Int):Long = {
    if (n==0) 5
    else {
      if (n==1) 7
      else 5*T(n-1)-6*T(n-2)
    }
  }

  def f(n:Int):Double = {
    (8.0)* Math.pow(2,n) + (-3)* Math.pow(3,n)
}

  def main(a:Array[String]):Unit = {
    val l = (0 to 20).toList
    for (i <- l) {
      println("T("+i+") = " + T(i))
      println("f("+i+") = " + f(i))
    }
  }
}
```

```scala
object Ejercicio3 {
  def T(n:Int):Long = {
    if (n==0) 5
    else {
      if (n==1) 20
      else 4*T(n-1)-4*T(n-2)
    }
  }

  def f(n:Int):Double = {
    (5.0)* Math.pow(2,n) + (5)*n* Math.pow(2,n)
}

  def main(a:Array[String]):Unit = {
    val l = (0 to 20).toList
    for (i <- l) {
      println("T("+i+") = " + T(i))
      println("f("+i+") = " + f(i))
    }
  }
}
```

[2025-03-19-Note-13-03_annotated.pdf](2025-03-19-Note-13-03_annotated.pdf)

# Solucion ecuaciones forma T(n) = aT(n/b) + f(n)

[2025-03-19-Note-12-53_annotated.pdf](2025-03-19-Note-12-53_annotated.pdf)