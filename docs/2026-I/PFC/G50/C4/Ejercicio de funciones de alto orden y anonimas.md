
Tenemos lo que es la norma-p dada una lista que contiene $n$ elementos, la norma se calcula asi


$$
\begin{align}
A = \{a_0,a_1,a_2,\ldots a_n\} \\
\texttt{norm}=\sqrt[p]{(a_0^p+a_1^p+\ldots+a_n^p)}
\end{align}
$$

Ejemplo dado (1,2,3) entonces

1. Norma 2 $\sqrt{1^2+2^2+3^2} = \sqrt(14)$
2. Norma 3 $\sqrt[3]{1^3+2^3+3^3} = \sqrt[3](36)$

# Solucion

```scala
object NormaP {

  def normaP(l:List[Int],f:(Int,Double)=>Double, g:Double=>Double):Double = {
    @scala.annotation.tailrec
    def normaPAux(l:List[Int],acc:Double):Double = {
      if (l.isEmpty) acc
      else normaPAux(l.tail, f(l.head,acc))
    }
    g(normaPAux(l,0))
  }

  def main(args: Array[String]): Unit = {
    println(normaP(
      List(1,2,3),
      (x,acc)=>x*x+acc,
      s => Math.sqr**w**
    println(normaP(
      List(1,2,3),
      (x,acc)=>x*x*x+acc,
      s => Math.pow(s,1/3.0)))
  }
}
```

Aca podemos ver el uso de f y g para las operaciones de la norma, observese en ningun momento pase el parametro p